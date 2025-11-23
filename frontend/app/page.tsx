"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ComplaintFilters } from "@/components/complaint-filters"
import { ComplaintCard } from "@/components/complaint-card"
import { Search, TrendingUp, Shield, Users, MessageSquare, Building2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import api from "@/services/api"

export default function HomePage() {
  const [allComplaints, setAllComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("");
  const complaintsPerPage = 4

  const stats = [
    { label: "Reclamações Registradas", value: "12.847", icon: MessageSquare },
    { label: "Empresas Cadastradas", value: "2.156", icon: Building2 },
    { label: "Problemas Resolvidos", value: "8.923", icon: Shield },
    { label: "Usuários Ativos", value: "45.231", icon: Users },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [companiesResponse, complaintsResponse] = await Promise.all([
          api.get('empresas/'),
          api.get('reclamacoes/')
        ]);
        const companies = companiesResponse.data.results || [];
        const complaints = complaintsResponse.data.results || [];

        setCompanies(companies);
        setAllComplaints(complaints);
        setFilteredComplaints(complaints);
        
        console.log('Companies:', companies);
        console.log('Complaints:', complaints);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = allComplaints

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((complaint) => filters.status.includes(complaint.status))
    }

    setFilteredComplaints(filtered)
    setCurrentPage(1)
  }

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reclamacoes/?search=${searchTerm}`);
      const complaints = response.data.results || [];
      setAllComplaints(complaints);
      setFilteredComplaints(complaints);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to search complaints");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button className="absolute right-2 top-2 h-10" onClick={handleSearch}>Buscar</Button>
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
              {currentComplaints.map((apiComplaint: any) => {
                const cardComplaint = {
                  id: apiComplaint.id,
                  title: apiComplaint.titulo,
                  company: apiComplaint.empresa_razao_social,
                  status: apiComplaint.status,
                  date: apiComplaint.data_criacao,
                  excerpt: apiComplaint.descricao,
                  rating: 3, 
                  responses: 0,
                  category: "Serviços",
                  helpful: 0,
                  notHelpful: 0,
                  views: 0,
                };
                return <ComplaintCard key={cardComplaint.id} complaint={cardComplaint} />;
              })}
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
