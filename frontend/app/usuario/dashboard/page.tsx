"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Building2,
  Star,
} from "lucide-react"
import Link from "next/link"

// Mock data para o dashboard do usuário
const userStats = {
  totalComplaints: 8,
  resolved: 5,
  pending: 2,
  inProgress: 1,
}

const recentComplaints = [
  {
    id: 1,
    title: "Produto com defeito não foi trocado",
    company: "TechStore Brasil",
    status: "Em análise",
    date: "2024-01-15",
    rating: 2,
    responses: 3,
    views: 156,
  },
  {
    id: 2,
    title: "Cobrança indevida no cartão",
    company: "Banco Digital Plus",
    status: "Respondida",
    date: "2024-01-14",
    rating: 1,
    responses: 1,
    views: 89,
  },
  {
    id: 3,
    title: "Entrega atrasada sem justificativa",
    company: "LogiExpress",
    status: "Resolvida",
    date: "2024-01-13",
    rating: 4,
    responses: 2,
    views: 203,
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

function getStatusIcon(status: string) {
  switch (status) {
    case "Resolvida":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "Respondida":
      return <MessageSquare className="h-4 w-4 text-blue-600" />
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
    </div>
  )
}

export default function UserDashboard() {
  const resolutionRate = Math.round((userStats.resolved / userStats.totalComplaints) * 100)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Meu Dashboard</h1>
              <p className="text-muted-foreground">Gerencie suas reclamações e acompanhe o progresso</p>
            </div>
            <Button asChild>
              <Link href="/usuario/nova-reclamacao">
                <Plus className="h-4 w-4 mr-2" />
                Nova Reclamação
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Reclamações</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalComplaints}</div>
                <p className="text-xs text-muted-foreground">Todas as suas reclamações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.resolved}</div>
                <p className="text-xs text-muted-foreground">Problemas solucionados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{userStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Sendo analisadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolutionRate}%</div>
                <Progress value={resolutionRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Recent Complaints */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reclamações Recentes</CardTitle>
                  <CardDescription>Suas últimas reclamações registradas</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/usuario/reclamacoes">Ver Todas</Link>
                </Button>
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
                      </div>
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">{complaint.title}</h3>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          {complaint.company}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(complaint.date).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {complaint.responses} respostas
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {complaint.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StarRating rating={complaint.rating} />
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
