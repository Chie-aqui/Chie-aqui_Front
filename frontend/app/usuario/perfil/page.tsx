"use client"

import { useState } from "react"
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

// Mock user data
const userData = {
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 99999-9999",
  location: "São Paulo, SP",
  joinDate: "2023-06-15",
  avatar: "/diverse-user-avatars.png",
  stats: {
    totalComplaints: 8,
    resolved: 5,
    helpfulVotes: 23,
    profileViews: 156,
  },
  badges: [
    { name: "Primeiro Post", description: "Fez sua primeira reclamação", earned: true },
    { name: "Problema Resolvido", description: "Teve uma reclamação resolvida", earned: true },
    { name: "Contribuidor", description: "Ajudou outros usuários", earned: true },
    { name: "Veterano", description: "Membro há mais de 1 ano", earned: false },
  ],
}

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simular salvamento
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      // Atualizar dados do usuário
    }, 1000)
  }

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
    })
    setIsEditing(false)
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
                        <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                        <AvatarFallback className="text-2xl">{userData.name.charAt(0)}</AvatarFallback>
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
                      <h3 className="text-lg font-semibold">{userData.name}</h3>
                      <p className="text-muted-foreground">
                        Membro desde {new Date(userData.joinDate).toLocaleDateString("pt-BR")}
                      </p>
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
                    <span>Membro desde {new Date(userData.joinDate).toLocaleDateString("pt-BR")}</span>
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
                    <div className="text-2xl font-bold">{userData.stats.totalComplaints}</div>
                    <p className="text-xs text-muted-foreground">Todas as suas reclamações</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{userData.stats.resolved}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((userData.stats.resolved / userData.stats.totalComplaints) * 100)}% de taxa de
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
                    <div className="text-2xl font-bold text-yellow-600">{userData.stats.helpfulVotes}</div>
                    <p className="text-xs text-muted-foreground">Pessoas acharam suas reclamações úteis</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.stats.profileViews}</div>
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
                    {userData.badges.map((badge, index) => (
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
  )
}
