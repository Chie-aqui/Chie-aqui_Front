"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Building2 } from "lucide-react";
import Link from "next/link";

interface Company {
  display_id: number;
  display_nome: string;
  razao_social: string;
  nome_social: string | null;
  descricao: string | null;
  cnpj: string;
  display_email: string; // Changed from 'email' to 'display_email'
  date_joined: string;
}

export default function CompanySearchPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q"); // Still get searchTerm for display purposes if needed

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/empresas/`); // Fetch all companies
        setCompanies(response.data.results || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Falha ao buscar empresas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []); // Empty dependency array to fetch only once on mount

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center space-x-4 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Todas as Empresas Cadastradas</h1>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-10">
              <p>Carregando empresas...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && companies.length === 0 && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <p>Nenhuma empresa cadastrada.</p>
            </div>
          )}

          <div className="grid gap-6">
            {companies.map((company) => (
              <Card key={company.display_id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <Link href={`/empresas/${company.display_id}`} className="hover:underline">
                      {company.razao_social || company.display_nome}
                    </Link>
                  </CardTitle>
                  {company.nome_social && (
                    <CardDescription className="text-sm text-muted-foreground">
                      Nome Social: {company.nome_social}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email: {company.display_email}</p> {/* Changed to display_email */}
                  <p className="text-sm text-muted-foreground">CNPJ: {company.cnpj}</p>
                  {company.descricao && (
                    <p className="text-sm text-muted-foreground">
                      Descrição: {company.descricao.substring(0, 150)}...
                    </p>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
