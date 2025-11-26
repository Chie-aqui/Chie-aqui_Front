"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ArrowLeft, UserIcon, Calendar, MessageSquare, AlertCircle, Download } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResponseInfo {
  id: number;
  descricao: string;
  data_criacao: string;
  status_resolucao: string;
}

// Interface for individual file attachments
interface Arquivo {
  arquivo: string; // URL to the file
  nome_arquivo: string; // Original name of the file
}

interface Complaint {
  id: number;
  titulo: string;
  descricao: string;
  status: string; // Updated to reflect new backend status: ABERTA or ENCERRADA
  data_criacao: string;
  usuario_consumidor_nome: string;
  empresa_razao_social: string;
  resposta?: ResponseInfo | null;
  arquivos?: Arquivo[]; // Optional array of attachments
}

function getStatusColor(status: string) {
  switch (status) {
    case "Resolvida": // This refers to RespostaReclamacao.status_resolucao
      return "bg-green-100 text-green-800 border-green-200";
    case "Não Resolvida": // This refers to RespostaReclamacao.status_resolucao
      return "bg-red-100 text-red-800 border-red-200";
    case "Em Análise": // This refers to RespostaReclamacao.status_resolucao
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Aberta": // This refers to Reclamacao.status
      return "bg-red-100 text-red-800 border-red-200";
    case "Encerrada": // This refers to Reclamacao.status
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function ComplaintDetailPage() { // Removed params prop
  const { isAuthenticated, userType, logout } = useAuth();
  const router = useRouter();
  const params = useParams(); // Get params using useParams hook
  const complaintId = params.id as string; // Access id from params
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const isValidDate = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchComplaint = async () => {
      if (!complaintId) {
        setError("ID da reclamação não fornecido.");
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<Complaint>(`/reclamacoes/${complaintId}/`);
        setComplaint(res.data);
      } catch (err: any) {
        console.error("Failed to fetch complaint:", err);
        if (err.response && err.response.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          logout();
        } else {
          setError(err.message || "Erro ao carregar detalhes da reclamação.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [isAuthenticated, complaintId, router, logout]);

  const handleFinalizeComplaint = async (status_resolucao: 'RESOLVIDA' | 'NAO_RESOLVIDA') => {
    if (!complaint?.resposta?.id) {
      toast({
        title: "Erro",
        description: "Não há resposta para finalizar.",
        variant: "destructive",
      });
      return;
    }

    setIsFinalizing(true);
    try {
      await api.patch(`/respostas-reclamacao/${complaint.resposta.id}/status/`, {
        status_resolucao: status_resolucao,
      });
      toast({
        title: "Sucesso!",
        description: `Reclamação marcada como '${status_resolucao}'.`,
        variant: "default",
      });
      // Refresh the page data
      setComplaint(prev => prev ? { 
        ...prev, 
        status: 'Encerrada', // Update main complaint status to Encerrada
        resposta: { ...prev.resposta!, status_resolucao: status_resolucao } 
      } : null);
      // No need for router.refresh() if local state is updated effectively
    } catch (err: any) {
      console.error("Failed to finalize complaint:", err);
      toast({
        title: "Erro",
        description: err.response?.data?.detail || "Erro ao finalizar reclamação.",
        variant: "destructive",
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando detalhes da reclamação...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <CardTitle className="text-xl">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 mb-4">{error}</p>
              <Button asChild>
                <Link href={userType === "user" ? "/usuario/dashboard" : "/empresa/dashboard"}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para o Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Reclamação não encontrada.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href={userType === "user" ? "/usuario/dashboard" : "/empresa/dashboard"}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Detalhes da Reclamação</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{complaint.titulo}</CardTitle>
                <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> {complaint.usuario_consumidor_nome}
                </span>
                <span className="flex items-center gap-2 mt-1">
                  <MessageSquare className="h-4 w-4" /> Empresa: {complaint.empresa_razao_social}
                </span>
                <span className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />{" "}
                  {isValidDate(complaint.data_criacao)
                    ? format(new Date(complaint.data_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                    : 'Data inválida'}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{complaint.descricao}</p>
            </CardContent>
          </Card>

          {/* Attachments Section */}
          {complaint.arquivos && complaint.arquivos.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Anexos</CardTitle>
                <CardDescription>
                  Arquivos anexados a esta reclamação.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {complaint.arquivos.map((arquivo) => (
                  <Button
                    key={arquivo.arquivo}
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <a
                      href={arquivo.arquivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {arquivo.nome_arquivo}
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {complaint.resposta && isValidDate(complaint.resposta.data_criacao) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  Resposta da Empresa
                  <Badge className={getStatusColor(complaint.resposta.status_resolucao)}>
                    {complaint.resposta.status_resolucao}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Calendar className="h-4 w-4" />{" "}
                  {isValidDate(complaint.resposta.data_criacao)
                    ? format(new Date(complaint.resposta.data_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                    : 'Data inválida'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{complaint.resposta.descricao}</p>
              </CardContent>
            </Card>
          )}

          {userType === "user" && complaint.resposta && complaint.status !== 'Encerrada' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Finalizar Reclamação</CardTitle>
                <CardDescription>
                  Avalie a resposta da empresa para finalizar sua reclamação.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button
                  variant="default"
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => handleFinalizeComplaint('RESOLVIDA')}
                  disabled={isFinalizing}
                >
                  {isFinalizing ? "Finalizando..." : "Marcar como Resolvida"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleFinalizeComplaint('NAO_RESOLVIDA')}
                  disabled={isFinalizing}
                >
                  {isFinalizing ? "Finalizando..." : "Marcar como Não Resolvida"}
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
