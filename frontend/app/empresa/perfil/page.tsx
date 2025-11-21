"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
} from "lucide-react"
import Link from "next/link"

// Mock company data
const companyData = {
  name: "TechStore Brasil",
  cnpj: "12.345.678/0001-90",
  email: "contato@techstore.com.br",
  phone: "(11) 3000-0000",
  website: "www.techstore.com.br",
  address: "Av. Paulista, 1000 - São Paulo, SP",
  description:
    "Loja especializada em produtos eletrônicos e tecnologia, oferecendo as melhores marcas e atendimento diferenciado há mais de 10 anos no mercado.",
  joinDate: "2022-03-15",
  logo: "/tech-store-logo.png",
  stats: {
    totalComplaints: 24,
    resolved: 10,
    averageRating: 3.2,
    responseTime: "2.5 dias",
  },
  categories: ["E-commerce", "Eletrônicos", "Tecnologia"],
}

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: companyData.name,
    email: companyData.email,
    phone: companyData.phone,
    website: companyData.website,
    address: companyData.address,
    description: companyData.description,
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simular salvamento
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      // Atualizar dados da empresa
    }, 1000)
  }

  const handleCancel = () => {
    setFormData({
      name: companyData.name,
      email: companyData.email,
      phone: companyData.phone,
      website: companyData.website,
      address: companyData.address,
      description: companyData.description,
    })
    setIsEditing(false)
  }

  const resolutionRate = Math.round((companyData.stats.resolved / companyData.stats.totalComplaints) * 100)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="public">Perfil Público</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
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
                  {/* Logo Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={companyData.logo || "/placeholder.svg"} alt={companyData.name} />
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
                      <h3 className="text-lg font-semibold">{companyData.name}</h3>
                      <p className="text-muted-foreground">CNPJ: {companyData.cnpj}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {companyData.stats.totalComplaints} reclamações
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {companyData.stats.averageRating}/5
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {resolutionRate}% resolvidas
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da empresa</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-name"
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
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Descrição da empresa</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        disabled={!isEditing}
                        rows={4}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">{formData.description.length}/500 caracteres</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {new Date(companyData.joinDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Public Profile Tab */}
            <TabsContent value="public">
              <Card>
                <CardHeader>
                  <CardTitle>Como sua empresa aparece publicamente</CardTitle>
                  <CardDescription>Esta é a visualização que os usuários veem do seu perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={companyData.logo || "/placeholder.svg"} alt={companyData.name} />
                        <AvatarFallback>
                          <Building2 className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{companyData.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {companyData.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            {companyData.stats.averageRating}/5
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {companyData.stats.totalComplaints} reclamações
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {resolutionRate}% resolvidas
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{companyData.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {companyData.website}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        São Paulo, SP
                      </span>
                    </div>
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
                    <div className="text-2xl font-bold">{companyData.stats.totalComplaints}</div>
                    <p className="text-xs text-muted-foreground">Todas as reclamações recebidas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{companyData.stats.resolved}</div>
                    <p className="text-xs text-muted-foreground">{resolutionRate}% de taxa de resolução</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                    <Star className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.stats.averageRating}/5</div>
                    <p className="text-xs text-muted-foreground">Baseado em todas as avaliações</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companyData.stats.responseTime}</div>
                    <p className="text-xs text-muted-foreground">Tempo médio de primeira resposta</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Histórico de Performance</CardTitle>
                  <CardDescription>Evolução das suas métricas ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>Gráficos de performance serão exibidos aqui</p>
                    <p className="text-sm">Dados históricos dos últimos 12 meses</p>
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
