"use client"

import api from '@/services/api'; 
import { useState, useEffect } from "react"
import { useAuth } from '@/hooks/use-auth';
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  MessageSquare,
  TrendingUp,
  Award,
  Camera,
} from "lucide-react"
import Link from "next/link"

interface UserProfile {
  display_id: number;
  nome: string;
  email: string;
  phone: string | null;
  date_joined: string;
  totalComplaints: number;
  resolved: number;
  helpfulVotes: number;
  profileViews: number;
  avatar?: string | null;
}

export default function UserProfilePage() {
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    phone: '',
    avatar: '',
  });

  // Function to fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const email = userInfo?.usuario?.email;
      if (!email) throw new Error("Email não encontrado no contexto de autenticação.");

      console.log("Buscando dados do usuário:", email);

      const response = await api.get<any>(`/consumidores/?email=${email}`);

      if (response.data.results?.length > 0) {
        const fetchedData = response.data.results[0];
        setUserData(fetchedData);
        // Initialize form data when user data is fetched
        setFormData({
          nome: fetchedData.nome || '',
          email: fetchedData.email || '',
          phone: fetchedData.phone || '',
          avatar: fetchedData.avatar || '',
        });
      } else {
        setUserData(null);
        setError("Nenhum dado de perfil encontrado para este usuário.");
      }

    } catch (err: any) {
      console.error(err);
      let errorMessage = "Falha ao carregar dados do perfil.";
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = "Você não tem permissão para acessar este perfil.";
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = "A solicitação falhou. Verifique sua conexão com a internet.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.usuario?.email) {
      fetchUserData();
    }
  }, [userInfo?.usuario?.email]);

  const handleSave = async () => {
  setIsLoading(true);
  setError(null);

  try {
    if (!userData?.display_id) {
      throw new Error("ID do usuário não encontrado para salvar.");
    }

    const payload = {
      // Remova o aninhamento 'usuario'
      nome: formData.nome,
      email: formData.email,
      phone: formData.phone,
    };

    console.log("Enviando PATCH:", payload);

    const response = await api.patch(`/consumidores/${userData.display_id}/`, payload);

    await fetchUserData();
    setIsEditing(false);

  } catch (err: any) {
    console.error("Erro ao salvar:", err.response?.data || err);

    let errorMessage = "Falha ao salvar alterações.";

    if (err.response?.data) {
      errorMessage = JSON.stringify(err.response.data);
    }

    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};



  const handleCancel = () => {
    // Reset form data to the original userData
    if (userData) {
      setFormData({
        nome: userData.nome || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || '',
      });
    }
    setIsEditing(false);
  };

  const handleEditClick = () => {
    // Initialize formData with current userData when editing starts
    if (userData) {
      setFormData({
        nome: userData.nome || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || '',
      });
    }
    setIsEditing(true);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">Nenhum dado de perfil encontrado.</div>;
  }

  const resolutionRate =
    userData.totalComplaints > 0
      ? Math.round((userData.resolved / userData.totalComplaints) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/usuario/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Meu Perfil</h1>
              <p className="text-muted-foreground">Gerencie suas informações</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="badges">Conquistas</TabsTrigger>
            </TabsList>

            {/* Perfil */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>Atualize suas informações pessoais</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" onClick={handleEditClick}>
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
                        <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{formData.nome.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" variant="secondary">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{formData.nome}</h3>
                      <p className="text-muted-foreground">
                        Membro desde {new Date(userData.date_joined).toLocaleDateString("pt-BR")}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center"><MessageSquare className="h-4 w-4 mr-1" />{userData.totalComplaints} reclamações</span>
                        <span className="flex items-center"><TrendingUp className="h-4 w-4 mr-1" />{userData.helpfulVotes} votos úteis</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="phone"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {new Date(userData.date_joined).toLocaleDateString("pt-BR")}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Estatísticas */}
            <TabsContent value="stats">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total */}
                <Card>
                  <CardHeader>
                    <CardTitle>Total de Reclamações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userData.totalComplaints}</div>
                  </CardContent>
                </Card>

                {/* Resolvidas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resolvidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userData.resolved}</div>
                    <p>{resolutionRate}% de resolução</p>
                  </CardContent>
                </Card>

                {/* Votos Úteis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Votos Úteis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userData.helpfulVotes}</div>
                  </CardContent>
                </Card>

                {/* Visualizações */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visualizações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userData.profileViews}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Conquistas */}
            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>Conquistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Em breve...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}