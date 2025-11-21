"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ComplaintFilters } from "@/components/complaint-filters"
import { ComplaintCard } from "@/components/complaint-card"
import { Search, TrendingUp, Shield, Users, MessageSquare, Building2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Mock data expandido para demonstração
const allComplaints = [
  {
    id: 1,
    title: "Produto com defeito não foi trocado após 3 tentativas",
    company: "TechStore Brasil",
    status: "Em análise",
    date: "2024-01-15",
    rating: 2,
    responses: 3,
    category: "E-commerce",
    excerpt:
      "Comprei um smartphone que apresentou defeito na tela após 2 dias de uso. Já tentei trocar 3 vezes mas sempre inventam uma desculpa diferente.",
    helpful: 12,
    notHelpful: 2,
    views: 156,
  },
  {
    id: 2,
    title: "Cobrança indevida no cartão de crédito sem autorização",
    company: "Banco Digital Plus",
    status: "Respondida",
    date: "2024-01-14",
    rating: 1,
    responses: 1,
    category: "Bancos",
    excerpt:
      "Apareceu uma cobrança de R$ 89,90 no meu cartão que eu não reconheço. Entrei em contato mas o atendimento foi péssimo.",
    helpful: 8,
    notHelpful: 1,
    views: 89,
  },
  {
    id: 3,
    title: "Entrega atrasada sem justificativa há mais de 15 dias",
    company: "LogiExpress",
    status: "Resolvida",
    date: "2024-01-13",
    rating: 4,
    responses: 2,
    category: "Transporte",
    excerpt:
      "Meu pedido estava previsto para chegar em 5 dias úteis, mas já se passaram 15 dias e nada. Finalmente resolveram após esta reclamação.",
    helpful: 15,
    notHelpful: 0,
    views: 203,
  },
  {
    id: 4,
    title: "Atendimento inadequado e funcionários mal educados",
    company: "MegaVarejo",
    status: "Pendente",
    date: "2024-01-12",
    rating: 2,
    responses: 0,
    category: "Varejo",
    excerpt:
      "Fui muito mal atendido na loja da Rua das Flores. Os funcionários foram grosseiros e não quiseram resolver meu problema.",
    helpful: 6,
    notHelpful: 3,
    views: 67,
  },
  {
    id: 5,
    title: "Internet lenta e quedas constantes de conexão",
    company: "ConectaNet",
    status: "Em análise",
    date: "2024-01-11",
    rating: 1,
    responses: 1,
    category: "Telecomunicações",
    excerpt:
      "Pago por 100MB mas recebo no máximo 20MB. Além disso, a internet cai várias vezes por dia, principalmente à noite.",
    helpful: 23,
    notHelpful: 1,
    views: 312,
  },
  {
    id: 6,
    title: "Cancelamento de serviço não processado corretamente",
    company: "StreamMax",
    status: "Respondida",
    date: "2024-01-10",
    rating: 3,
    responses: 2,
    category: "Serviços",
    excerpt:
      "Solicitei o cancelamento da assinatura há 2 meses mas continuam cobrando. Já entrei em contato várias vezes.",
    helpful: 9,
    notHelpful: 2,
    views: 134,
  },
]

const stats = [
  { label: "Reclamações Registradas", value: "12.847", icon: MessageSquare },
  { label: "Empresas Cadastradas", value: "2.156", icon: Building2 },
  { label: "Problemas Resolvidos", value: "8.923", icon: Shield },
  { label: "Usuários Ativos", value: "45.231", icon: Users },
]

export default function HomePage() {
  const [filteredComplaints, setFilteredComplaints] = useState(allComplaints)
  const [currentPage, setCurrentPage] = useState(1)
  const complaintsPerPage = 4

  const handleFilterChange = (filters: any) => {
    let filtered = allComplaints

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((complaint) => filters.status.includes(complaint.status))
    }

    setFilteredComplaints(filtered)
    setCurrentPage(1)
  }

  // Paginação
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage)
  const startIndex = (currentPage - 1) * complaintsPerPage
  const currentComplaints = filteredComplaints.slice(startIndex, startIndex + complaintsPerPage)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Sua voz <span className="text-primary">importa</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              Registre reclamações, encontre soluções e ajude outras pessoas a tomar melhores decisões de consumo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8">
                <MessageSquare className="h-5 w-5 mr-2" />
                Fazer Reclamação
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Search className="h-5 w-5 mr-2" />
                Buscar Empresas
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Busque por empresa, produto ou serviço..."
                  className="pl-12 h-14 text-lg bg-background/80 backdrop-blur"
                />
                <Button className="absolute right-2 top-2 h-10">Buscar</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Complaints Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Reclamações Recentes</h2>
                <p className="text-muted-foreground">Mostrando {filteredComplaints.length} reclamações encontradas</p>
              </div>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Ranking
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <ComplaintFilters onFilterChange={handleFilterChange} />
            </div>

            {/* Complaints Grid */}
            <div className="grid gap-6 mb-8">
              {currentComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para fazer a diferença?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de consumidores que já usam o Chie Aqui para resolver seus problemas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Criar Conta Gratuita
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Sou uma Empresa
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
