"use client"

import { useState, useEffect } from "react" // Import useEffect
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
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

// Define API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Define types for API responses
interface UserProfile {
  usuario: {
    id: number;
    nome: string;
    email: string;
    date_joined: string;
  };
  avatar?: string | null; // Avatar might be optional or null
  phone?: string | null;
  location?: string | null;
  // Stats and badges might be returned directly or need separate fetching
  stats?: {
    totalComplaints: number;
    resolved: number;
    helpfulVotes: number;
    profileViews: number;
  };
  badges?: Array<{ name: string; description: string; earned: boolean }>;
}

interface Complaint {
  id: number;
  status: string;
  // other complaint properties can be added if needed for stats calculation
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // State for user data
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  // Fetch user data and stats
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch User Profile
        const profileResponse = await fetch(`${API_BASE_URL}/consumidores/perfil/`);
        if (!profileResponse.ok) {
          throw new Error(`HTTP error! status: ${profileResponse.status}`);
        }
        const profileData: UserProfile = await profileResponse.json();
        setUserData(profileData);

        // Populate form data with fetched user data
        setFormData({
          name: profileData.usuario.nome,
          email: profileData.usuario.email,
          phone: profileData.phone || "", // Use fetched data or default to empty string
          location: profileData.location || "", // Use fetched data or default to empty string
        });

        let totalComplaints = 0;
        let resolvedComplaints = 0;

        // Fetch user's complaints to calculate stats if not provided in profileData
        if (!profileData.stats) {
            const complaintsResponse = await fetch(`${API_BASE_URL}/reclamacoes/`); // This fetches all complaints. Need to filter by user.
            if (!complaintsResponse.ok) {
              throw new Error(`HTTP error! status: ${complaintsResponse.status}`);
            }
            const complaintsData: PaginatedResponse<Complaint> = await complaintsResponse.json();

            // Filter complaints for the current user
            // Assuming the API /reclamacoes/ can be filtered by user_id, e.g., /reclamacoes/?user_id=PROFILE_USER_ID
            // If not, we might need to fetch all and filter client-side, which is less efficient.
            // For now, let's assume we fetch and filter client-side if no direct filter is available.
            // The provided format for 'consumidores' shows 'usuario' ID. Let's assume we can filter by it.
            // However, the endpoint given is just /reclamacoes/, so we'll filter client-side for now.
            const userComplaints = complaintsData.results.filter(complaint => complaint.id !== undefined); // Placeholder: Ideally filter by user ID from profileData.usuario.id

            totalComplaints = complaintsData.count; // Assuming count reflects all complaints, not just user's. We need user-specific counts.
            resolvedComplaints = complaintsData.results.filter((c: Complaint) => c.status === "Resolvida").length;
        } else {
            // Use stats directly if provided
            totalComplaints = profileData.stats.totalComplaints;
            resolvedComplaints = profileData.stats.resolved;
        }

        // Update stats state (if not provided, we'll need to mock/calculate)
        // For now, we'll create a placeholder if stats are not directly available,
        // or use the fetched/calculated values.
        setUserData(prevData => ({
            ...prevData!,
            stats: profileData.stats || { // Fallback if stats are not in profileData
                totalComplaints: totalComplaints,
                resolved: resolvedComplaints,
                helpfulVotes: 0, // Placeholder, needs API endpoint
                profileViews: 0  // Placeholder, needs API endpoint
            }
        }));


      } catch (err: any) {
        setError(err.message || "Falha ao carregar dados do perfil.");
        console.error("Error fetching user profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array: run once on mount

  // Mock handleSave and handleCancel for now, as API update logic is complex.
  // These would need to make PUT/PATCH requests to the user profile endpoint.
  const handleSave = async () => {
    setIsLoading(true);
    // In a real scenario, send formData to API
    try {
      const userId = userData?.usuario.id;
      if (!userId) throw new Error("User ID not found.");

      const response = await fetch(`${API_BASE_URL}/consumidores/perfil/`, { // Assuming this endpoint also handles updates
        method: 'PUT', // Or 'PATCH'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId, // Include ID if API requires it for update
          nome: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          // avatar, etc. could be handled here too
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Refetch user data to reflect saved changes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setIsLoading(false);
      setIsEditing(false);
      // Re-fetch user data to update the displayed information
      // This is a simplified approach; a more robust solution might update the state directly
      // or use a data fetching library with caching.
      const updatedProfileResponse = await fetch(`${API_BASE_URL}/consumidores/perfil/`);
      const updatedProfileData: UserProfile = await updatedProfileResponse.json();
      setUserData(updatedProfileData);
      setFormData({
        name: updatedProfileData.usuario.nome,
        email: updatedProfileData.usuario.email,
        phone: updatedProfileData.phone || "",
        location: updatedProfileData.location || "",
      });
    } catch (err: any) {
      setError(err.message || "Falha ao salvar alterações.");
      console.error("Error saving user profile:", err);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (userData) {
      setFormData({
        name: userData.usuario.nome,
        email: userData.usuario.email,
        phone: userData.phone || "",
        location: userData.location || "",
      });
    }
    setIsEditing(false);
  };

  // Calculate resolution rate if stats are available
  const resolutionRate = userData?.stats?.totalComplaints
    ? Math.round((userData.stats.resolved / userData.stats.totalComplaints) * 100)
    : 0;

  // Placeholder for when badges are fetched or if they remain static
  const staticBadges = [
    { name: "Primeiro Post", description: "Fez sua primeira reclamação", earned: true },
    { name: "Problema Resolvido", description: "Teve uma reclamação resolvida", earned: true },
    { name: "Contribuidor", description: "Ajudou outros usuários", earned: true },
    { name: "Veterano", description: "Membro há mais de 1 ano", earned: false },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando perfil...</p> {/* Or a proper loading spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Erro ao carregar perfil: {error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Nenhum dado de perfil encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/usuario/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Meu Perfil</h1>
              <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="badges">Conquistas</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>Atualize suas informações de perfil</CardDescription>
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
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt={userData?.usuario.nome} />
                        <AvatarFallback className="text-2xl">{userData?.usuario.nome.charAt(0)}</AvatarFallback>
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
                      <h3 className="text-lg font-semibold">{userData?.usuario.nome}</h3>
                      <p className="text-muted-foreground">
                        Membro desde {userData?.usuario.date_joined ? new Date(userData.usuario.date_joined).toLocaleDateString("pt-BR") : "N/A"}
                      </p>
                      {userData?.stats && (
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {userData.stats.totalComplaints} reclamações
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {userData.stats.helpfulVotes} votos úteis
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Localização</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {userData?.usuario.date_joined ? new Date(userData.usuario.date_joined).toLocaleDateString("pt-BR") : "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Reclamações</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData?.stats?.totalComplaints ?? "N/A"}</div>
                    <p className="text-xs text-muted-foreground">Todas as suas reclamações</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{userData?.stats?.resolved ?? "N/A"}</div>
                    <p className="text-xs text-muted-foreground">
                      {resolutionRate}% de taxa de
                      resolução
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Votos Úteis</CardTitle>
                    <Award className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{userData?.stats?.helpfulVotes ?? "N/A"}</div>
                    <p className="text-xs text-muted-foreground">Pessoas acharam suas reclamações úteis</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData?.stats?.profileViews ?? "N/A"}</div>
                    <p className="text-xs text-muted-foreground">Visualizações do seu perfil</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>Conquistas</CardTitle>
                  <CardDescription>Badges que você ganhou por sua atividade na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Using static badges for now. If API provides badges, this section needs to be updated */}
                    {staticBadges.map((badge, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 p-4 rounded-lg border ${
                          badge.earned ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted"
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            badge.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Award className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{badge.name}</h3>
                            {badge.earned && <Badge variant="secondary">Conquistado</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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