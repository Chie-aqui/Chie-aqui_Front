"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, X, Send, Building2, FileText, Camera } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth.tsx";
import api from "@/services/api";
import { toast } from "@/components/ui/use-toast";

// Define Company interface for type safety
interface Company {
  display_id: number; // Changed from id to display_id
  nome_social: string | null;
  razao_social: string | null;
}

export default function NewComplaintPage() {
  const { isAuthenticated, userType, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    companyId: "", // Store company ID
    companyName: "", // Store company name for display
    description: "",
    attachments: [] as File[] // For file uploads
  })

  const totalSteps = 2 // Reduced to 2 steps: Basic Info + Description
  const progress = (step / totalSteps) * 100

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || userType !== "user")) {
      router.push("/login");
    }

    const fetchCompanies = async () => {
      try {
        const response = await api.get<{ results: Company[] }>('/empresas/');
        console.log("Fetched companies:", response.data.results);
        // Filter out companies without a valid display_id to prevent errors
        const validCompanies = response.data.results.filter(company =>
          company && typeof company.display_id === 'number'
        );
        setCompanies(validCompanies);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        toast({
            title: "Erro",
            description: "Não foi possível carregar a lista de empresas.",
            variant: "destructive",
        });
      }
    };

    if (isAuthenticated && userType === "user") {
        fetchCompanies();
    }

  }, [isAuthenticated, userType, authLoading, router]);


  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const payload = {
        titulo: formData.title,
        descricao: formData.description,
        empresa: parseInt(formData.companyId),
      };
      // TODO: Handle attachments upload here if any
      console.log("Submitting payload:", payload);
      await api.post('/reclamacoes/', payload);
      toast({
        title: "Sucesso!",
        description: "Reclamação enviada com sucesso.",
        variant: "default",
      });
      router.push("/usuario/dashboard");
    } catch (err: any) {
      console.error("Failed to submit complaint:", err);
      toast({
        title: "Erro",
        description: err.response?.data?.detail || "Erro ao enviar reclamação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCompanySelect = (company: Company) => {
    // Ensure company.display_id is a valid number before proceeding
    if (company && typeof company.display_id === 'number') {
      setFormData((prev) => ({ ...prev, companyId: company.display_id.toString(), companyName: company.nome_social || company.razao_social || '' }));
    } else {
      // Log an error or handle cases where company.display_id is not a number, if necessary
      console.error('Invalid company ID:', company);
      // Optionally, clear the selection or show an error to the user
      setFormData((prev) => ({ ...prev, companyId: '', companyName: '' }));
    }
    setCompanySearchQuery(""); // Clear search input
    setShowCompanyDropdown(false); // Hide dropdown
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }));
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove)
    }));
  }

  const filteredCompanies = companySearchQuery
    ? companies.filter(company =>
        (company.razao_social && company.razao_social.toLowerCase().includes(companySearchQuery.toLowerCase())) ||
        (company.nome_social && company.nome_social.toLowerCase().includes(companySearchQuery.toLowerCase()))
      )
    : companies;

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title.trim() !== "" && formData.companyId !== "";
      case 2:
        return formData.description.length >= 50;
      default:
        return false
    }
  }

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/usuario/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Nova Reclamação</h1>
              <p className="text-muted-foreground">Registre sua reclamação em {totalSteps} etapas simples</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Etapa {step} de {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Informações Básicas"}
                {step === 2 && "Descreva o Problema"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Conte-nos sobre a empresa e o tipo de problema"}
                {step === 2 && "Detalhe o que aconteceu e como gostaria que fosse resolvido"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {
                step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título da reclamação *</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Produto com defeito não foi trocado"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground">{formData.title.length}/100 caracteres</p>
                    </div>

                    <div className="space-y-2 relative">
                      <Label htmlFor="company-search">Empresa *</Label>
                      <Input
                        id="company-search"
                        placeholder="Digite para buscar ou selecionar uma empresa..."
                        value={companySearchQuery}
                        onChange={(e) => {
                          setCompanySearchQuery(e.target.value);
                          setShowCompanyDropdown(true);
                          setFormData((prev) => ({ ...prev, companyId: "", companyName: "" })); // Clear selection on search
                        }}
                        onFocus={() => setShowCompanyDropdown(true)}
                        className="mb-2"
                      />
                      {companySearchQuery && showCompanyDropdown && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                          {filteredCompanies.length > 0 ? (
                            filteredCompanies.map((company, index) => (
                              <Button
                                key={company.display_id ? `${company.display_id}` : index}
                                variant="ghost"
                                className="w-full justify-start py-2 px-3 hover:bg-gray-100"
                                onClick={() => handleCompanySelect(company)}
                              >
                                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                {company.nome_social || company.razao_social}
                              </Button>
                            ))
                          ) : (
                            <div className="p-3 text-sm text-muted-foreground">
                              Nenhuma empresa encontrada.
                            </div>
                          )}
                        </div>
                      )}
                      {formData.companyId && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Empresa selecionada: <span className="font-medium text-gray-800">{formData.companyName}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )
              }
              

              {/* Step 2: Description and Attachments */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Descreva o problema *</Label>
                    <Textarea
                      id="description"
                      placeholder="Conte em detalhes o que aconteceu, quando ocorreu, como tentou resolver e qual solução espera..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={8}
                      maxLength={2000}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mínimo 50 caracteres para uma boa descrição</span>
                      <span>{formData.description.length}/2000 caracteres</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Anexos (opcional)</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <Camera className="h-5 w-5 text-muted-foreground" />
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Clique para adicionar fotos, documentos ou comprovantes
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, PDF, DOC até 5MB cada</p>
                        </div>
                      </label>
                    </div>

                    {formData.attachments.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm font-medium">Arquivos anexados:</p>
                        <div className="space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={file.name + index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm truncate">{file.name}</span>
                              <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                  Anterior
                </Button>

                {step < totalSteps ? (
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    Próximo
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canProceed() || isLoading}>
                    {isLoading ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Reclamação
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
