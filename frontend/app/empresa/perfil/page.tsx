"use client"

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import api from "@/services/api"; // Import the configured axios instance
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Edit,
  Save,
  X,
  Star,
  Users,
  MessageSquare,
  TrendingUp,
  Camera,
  FileText,
} from "lucide-react";
import Link from "next/link";

// Updated type to match the backend serializer
interface CompanyProfile {
  display_id: number;
  display_nome: string;
  display_email: string;
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
  // Fields that might not exist in the new API response
  logo?: string | null;
  categories?: string[];
}


export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);
  const [formData, setFormData] = useState({
    nome_social: "",
    descricao: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Check for token existence before making the API call
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Autenticação necessária. Por favor, faça login.");
        setIsLoading(false);
        // Optionally redirect to login page
        // router.push('/login');
        return;
      }

      try {
        const response = await api.get<CompanyProfile>('/empresas/perfil/');
        const profileData = response.data;
        setCompanyData(profileData);

        setFormData({
            nome_social: profileData.nome_social || "",
            descricao: profileData.descricao || "",
        });
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
            setError("Sua sessão expirou. Por favor, faça login novamente.");
        } else {
            setError(err.message || "Falha ao carregar dados da empresa.");
        }
        console.error("Error fetching company profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // The endpoint for updating is the same as retrieving
      const response = await api.patch('/empresas/perfil/', {
        nome_social: formData.nome_social,
        descricao: formData.descricao,
      });

      setCompanyData(response.data); // Update state with the response from the server
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Falha ao salvar alterações.");
      console.error("Error saving company profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (companyData) {
      setFormData({
        nome_social: companyData.nome_social || "",
        descricao: companyData.descricao || "",
      });
    }
    setIsEditing(false);
  };

  const resolutionRate = companyData?.estatisticas?.total_reclamacoes
    ? Math.round((companyData.estatisticas.reclamacoes_resolvidas / companyData.estatisticas.total_reclamacoes) * 100)
    : 0;

    if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p>Carregando perfil da empresa...</p>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="min-h-screen flex items-center justify-center text-red-500">
            <p>Erro ao carregar perfil da empresa: {error}</p>
          </div>
        );
      }
    
      if (!companyData) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p>Nenhum dado de perfil da empresa encontrado.</p>
          </div>
        );
      }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/empresa/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Perfil da Empresa</h1>
              <p className="text-muted-foreground">Gerencie as informações da sua empresa</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Informações da Empresa</CardTitle>
                      <CardDescription>Atualize as informações do seu perfil empresarial</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={companyData?.logo || "/placeholder.svg"} alt={companyData?.display_nome} />
                        <AvatarFallback className="text-2xl">
                          <Building2 className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                          variant="secondary"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{companyData?.razao_social}</h3>
                      <p className="text-muted-foreground">CNPJ: {companyData?.cnpj}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {companyData.estatisticas.total_reclamacoes} reclamações
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {resolutionRate}% resolvidas
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Razão Social</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="company-name" value={companyData.razao_social} disabled className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="email" type="email" value={companyData.display_email} disabled className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome-social">Nome Social</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="nome-social"
                          value={formData.nome_social}
                          onChange={(e) => setFormData((prev) => ({ ...prev, nome_social: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Descrição da empresa</Label>
                      <Textarea
                        id="description"
                        value={formData.descricao}
                        onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                        disabled={!isEditing}
                        rows={4}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">{formData.descricao.length}/500 caracteres</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {new Date(companyData.date_joined).toLocaleDateString("pt-BR")}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Reclamações</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.estatisticas.total_reclamacoes}</div>
                    <p className="text-xs text-muted-foreground">Todas as reclamações recebidas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{companyData.estatisticas.reclamacoes_resolvidas}</div>
                    <p className="text-xs text-muted-foreground">{resolutionRate}% de taxa de resolução</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.estatisticas.reclamacoes_pendentes}</div>
                    <p className="text-xs text-muted-foreground">Reclamações aguardando resolução</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.estatisticas.media_tempo_resolucao.toFixed(2)} horas</div>
                    <p className="text-xs text-muted-foreground">Média para resolver reclamações</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}