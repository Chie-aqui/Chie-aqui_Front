"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Mail, UserIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ComplaintCard } from "@/components/complaint-card"; // Import ComplaintCard

interface ResponseInfo {
  id: number;
  descricao: string;
  data_criacao: string;
  status_resolucao: string;
}

interface Reclamation {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  data_criacao: string;
  usuario_consumidor_nome: string;
  empresa_razao_social: string;
  resposta?: ResponseInfo | null; // Add optional response field
}

interface ConsumerInfo {
  display_id: number;
  nome: string;
  email: string;
  date_joined: string;
  user_complaints: Reclamation[];
}

export default function UserDashboard() {
  const { isAuthenticated, userType, userInfo, logout } = useAuth();
  const router = useRouter();
  const [consumerData, setConsumerData] = useState<ConsumerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (userType !== "user") {
      setError("Acesso negado. Esta página é apenas para usuários consumidores.");
      setLoading(false);
      // Optionally redirect non-consumer users
      // router.push("/empresa/dashboard");
      return;
    }

    const fetchConsumerData = async () => {
      try {
        const response = await api.get<ConsumerInfo>(`/consumidores/perfil/`);
        setConsumerData(response.data);
      } catch (err: any) {
        console.error("Failed to fetch consumer data:", err);
        if (err.response && err.response.status === 401) {
            setError("Sessão expirada ou não autorizada. Faça login novamente.");
            logout(); // Log out if unauthorized
        } else {
            setError(err.message || "Erro ao carregar dados do consumidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConsumerData();
  }, [isAuthenticated, userType, router, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando dashboard do consumidor...</p>
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

  if (!consumerData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Nenhum dado do consumidor encontrado.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard do Consumidor</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nome</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consumerData.nome}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">E-mail</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consumerData.email}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membro Desde</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(consumerData.date_joined).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">Minhas Reclamações</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {consumerData.user_complaints && consumerData.user_complaints.length > 0 ? (
            consumerData.user_complaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          ) : (
            <p className="col-span-full text-muted-foreground">Nenhuma reclamação encontrada.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
