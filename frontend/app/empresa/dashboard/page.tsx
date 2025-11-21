"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Calendar,
  Eye,
  Reply,
} from "lucide-react"

// Mock data para o dashboard da empresa
const companyStats = {
  totalComplaints: 24,
  pending: 8,
  inProgress: 6,
  resolved: 10,
  averageRating: 3.2,
  responseTime: "2.5 dias",
  resolutionRate: 42,
}

const recentComplaints = [
  {
    id: 1,
    title: "Produto com defeito não foi trocado após 3 tentativas",
    customer: "João S.",
    status: "Pendente",
    date: "2024-01-15",
    rating: 2,
    priority: "Alta",
    views: 156,
    category: "Produto",
  },
  {
    id: 2,
    title: "Atendimento inadequado na loja física",
    customer: "Maria O.",
    status: "Em análise",
    date: "2024-01-14",
    rating: 2,
    priority: "Média",
    views: 89,
    category: "Atendimento",
  },
  {
    id: 3,
    title: "Entrega atrasada sem justificativa",
    customer: "Carlos M.",
    status: "Respondida",
    date: "2024-01-13",
    rating: 3,
    priority: "Baixa",
    views: 203,
    category: "Logística",
  },
  {
    id: 4,
    title: "Cobrança indevida no cartão de crédito",
    customer: "Ana P.",
    status: "Resolvida",
    date: "2024-01-12",
    rating: 4,
    priority: "Alta",
    views: 134,
    category: "Financeiro",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Resolvida":
      return "bg-green-100 text-green-800 border-green-200"
    case "Respondida":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Em análise":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Pendente":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Alta":
      return "bg-red-100 text-red-800"
    case "Média":
      return "bg-yellow-100 text-yellow-800"
    case "Baixa":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Resolvida":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "Respondida":
      return <Reply className="h-4 w-4 text-blue-600" />
    case "Em análise":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "Pendente":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
    </div>
  )
}

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard da Empresa</h1>
              <p className="text-muted-foreground">Gerencie reclamações e monitore a satisfação dos clientes</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Exportar Relatório</Button>
              <Button>Responder Reclamações</Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Reclamações</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyStats.totalComplaints}</div>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{companyStats.pending}</div>
                <p className="text-xs text-muted-foreground">Requer atenção imediata</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{companyStats.resolutionRate}%</div>
                <Progress value={companyStats.resolutionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyStats.averageRating}/5</div>
                <div className="flex items-center mt-1">
                  {companyStats.averageRating < 3 ? (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  )}
                  <span className="text-xs text-muted-foreground">Tempo médio: {companyStats.responseTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="complaints" className="space-y-6">
            <TabsList>
              <TabsTrigger value="complaints">Reclamações</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="complaints">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Reclamações Recentes</CardTitle>
                      <CardDescription>Gerencie e responda às reclamações dos clientes</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Filtrar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ordenar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentComplaints.map((complaint) => (
                      <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(complaint.status)}
                            <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                            <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                            <Badge variant="secondary">{complaint.category}</Badge>
                          </div>
                          <h3 className="font-medium text-sm mb-1 line-clamp-1">{complaint.title}</h3>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {complaint.customer}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(complaint.date).toLocaleDateString("pt-BR")}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {complaint.views} views
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <StarRating rating={complaint.rating} />
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            {complaint.status === "Pendente" && (
                              <Button size="sm">
                                <Reply className="h-4 w-4 mr-1" />
                                Responder
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Status</CardTitle>
                    <CardDescription>Como suas reclamações estão distribuídas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Pendentes</span>
                        </div>
                        <span className="text-sm font-medium">{companyStats.pending}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Em análise</span>
                        </div>
                        <span className="text-sm font-medium">{companyStats.inProgress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Respondidas</span>
                        </div>
                        <span className="text-sm font-medium">
                          {companyStats.totalComplaints -
                            companyStats.pending -
                            companyStats.inProgress -
                            companyStats.resolved}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Resolvidas</span>
                        </div>
                        <span className="text-sm font-medium">{companyStats.resolved}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Performance</CardTitle>
                    <CardDescription>Indicadores chave de desempenho</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Taxa de Resolução</span>
                          <span className="text-sm">{companyStats.resolutionRate}%</span>
                        </div>
                        <Progress value={companyStats.resolutionRate} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Tempo Médio de Resposta</span>
                          <span className="text-sm">{companyStats.responseTime}</span>
                        </div>
                        <Progress value={65} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Satisfação do Cliente</span>
                          <span className="text-sm">{companyStats.averageRating}/5</span>
                        </div>
                        <Progress value={(companyStats.averageRating / 5) * 100} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Empresa</CardTitle>
                  <CardDescription>Gerencie as configurações do seu perfil empresarial</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Notificações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Nova reclamação</span>
                            <Button variant="outline" size="sm">
                              Ativo
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Resposta do cliente</span>
                            <Button variant="outline" size="sm">
                              Ativo
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Relatório semanal</span>
                            <Button variant="outline" size="sm">
                              Inativo
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Automação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Resposta automática</span>
                            <Button variant="outline" size="sm">
                              Configurar
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Escalação automática</span>
                            <Button variant="outline" size="sm">
                              Configurar
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Categorização automática</span>
                            <Button variant="outline" size="sm">
                              Ativo
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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
