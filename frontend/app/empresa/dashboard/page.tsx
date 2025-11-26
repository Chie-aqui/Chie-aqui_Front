"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth.tsx";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, Info, ArrowLeft, Building2, Mail, FileText, UserIcon, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ComplaintCard } from "@/components/complaint-card";

interface CompanyInfo {
  display_id: number;
  nome: string;
  email: string;
  cnpj: string;
  razao_social: string;
  nome_social?: string;
  descricao?: string;
  date_joined: string;
  estatisticas: {
    total_reclamacoes: number;
    reclamacoes_resolvidas: number;
    reclamacoes_pendentes: number;
    media_tempo_resolucao: number;
  };
}

interface Complaint {
    id: number;
    titulo: string;
    descricao: string;
    status: string;
    data_criacao: string;
    usuario_consumidor_nome: string;
    resposta?: {
      id: number;
      descricao: string;
      data_criacao: string;
      status_resolucao: string;
    } | null;
}

export default function CompanyDashboard() {
  const { isAuthenticated, userType, logout } = useAuth();
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || userType !== "company") {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const profileResponse = await api.get<CompanyInfo>(`/empresas/perfil/`);
        setCompanyData(profileResponse.data);

        const complaintsResponse = await api.get<{ results: Complaint[] }>(`/reclamacoes/`);
        setComplaints(complaintsResponse.data.results);

      } catch (err: any) {
        console.error("Failed to fetch company data:", err);
        if (err.response && err.response.status === 401) {
            setError("Sessão expirada. Faça login novamente.");
            logout();
        } else {
            setError(err.message || "Erro ao carregar dados da empresa.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, userType, router, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando dashboard da empresa...</p>
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
              <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
              <CardTitle className="text-xl">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 mb-4">{error}</p>
              <Button asChild>
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para o Login
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Nenhum dado da empresa encontrado.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard da Empresa</h1>
            
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Reclamações</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{companyData.estatisticas.total_reclamacoes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reclamações Resolvidas</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{companyData.estatisticas.reclamacoes_resolvidas}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reclamações Pendentes</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{companyData.estatisticas.reclamacoes_pendentes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tempo Médio de Resolução</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{companyData.estatisticas.media_tempo_resolucao.toFixed(1)}h</div>
                    </CardContent>
                </Card>
            </div>

            {/* Complaints Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Reclamações Recebidas</h2>
                {complaints.length > 0 ? (
                    <div className="space-y-4">
                    {complaints.map((complaint) => (
                        <ComplaintCard key={complaint.id} complaint={complaint} userType={userType} />
                    ))}
                    </div>
                ) : (
                    <Card className="text-center py-8">
                        <CardContent>
                            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">Nenhuma reclamação recebida ainda.</h3>
                            <p className="text-sm text-gray-500">Quando um consumidor registrar uma reclamação contra sua empresa, ela aparecerá aqui.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
