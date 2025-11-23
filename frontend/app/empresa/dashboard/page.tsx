"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CompanyInfo {
  display_id: number;
  nome: string;
  email: string;
  cnpj: string;
  razao_social: string;
  nome_social?: string;
  descricao?: string;
  date_joined: string;
}

export default function CompanyDashboard() {
  const { isAuthenticated, userType, userInfo, logout } = useAuth();
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (userType !== "company") {
      setError("Acesso negado. Esta página é apenas para empresas.");
      setLoading(false);
      // Optionally redirect non-company users
      // router.push("/usuario/dashboard");
      return;
    }

    const fetchCompanyData = async () => {
      try {
        // Fetch company profile data
        const profileResponse = await api.get<CompanyInfo>(`/empresas/perfil/`);
        setCompanyData(profileResponse.data);

        // The /dashboard/stats/ endpoint does not exist yet, so we'll skip fetching from it for now
        // Once implemented, you would fetch it here:
        // const statsResponse = await api.get(`/empresas/dashboard/stats/`);
        // setCompanyStats(statsResponse.data);

      } catch (err: any) {
        console.error("Failed to fetch company data:", err);
        if (err.response && err.response.status === 401) {
            setError("Sessão expirada ou não autorizada. Faça login novamente.");
            logout(); // Log out if unauthorized
        } else {
            setError(err.message || "Erro ao carregar dados da empresa.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard da Empresa</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nome da Empresa</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyData.nome}</div>
              {companyData.nome_social && <p className="text-xs text-muted-foreground">({companyData.nome_social})</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Razão Social</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyData.razao_social}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">E-mail</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyData.email}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CNPJ</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyData.cnpj}</div>
            </CardContent>
          </Card>

          {companyData.descricao && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Descrição</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-base">{companyData.descricao}</div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membro Desde</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(companyData.date_joined).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
