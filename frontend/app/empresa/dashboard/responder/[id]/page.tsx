"use client"

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ArrowLeft, UserIcon, Calendar, AlertCircle } from "lucide-react";

interface Complaint {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  data_criacao: string;
  usuario_consumidor_nome: string;
  empresa: number; // Assuming the complaint object also has an 'empresa' ID
}

export default function RespondToComplaintPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, userType, userInfo, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const complaintId = pathSegments[pathSegments.length - 1];
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || userType !== "company") {
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
  }, [isAuthenticated, userType, userInfo, router, complaintId, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) {
      toast({
        title: "Erro",
        description: "A resposta não pode ser vazia.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/reclamacoes/${complaintId}/responder/`, {
        descricao: response,
      });
      toast({
        title: "Sucesso!",
        description: "Resposta enviada com sucesso.",
        variant: "default",
      });
      router.push("/empresa/dashboard");
    } catch (err: any) {
      console.error("Failed to submit response:", err);
      toast({
        title: "Erro",
        description: err.response?.data?.descricao || "Erro ao enviar resposta.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
                <Link href="/empresa/dashboard">
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
              <Link href="/empresa/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Responder Reclamação</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{complaint.titulo}</CardTitle>
                <Badge className={
                    complaint.status === "Resolvida" ? "bg-green-100 text-green-800" :
                    complaint.status === "Respondida" ? "bg-blue-100 text-blue-800" :
                    complaint.status === "Em análise" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                }>{complaint.status}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <UserIcon className="h-4 w-4" /> {complaint.usuario_consumidor_nome}
                <Calendar className="h-4 w-4 ml-4" /> {new Date(complaint.data_criacao).toLocaleDateString("pt-BR")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{complaint.descricao}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Sua Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="response">Descreva sua resposta</Label>
                  <Textarea
                    id="response"
                    placeholder="Digite sua resposta aqui..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    required
                    rows={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar Resposta"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
