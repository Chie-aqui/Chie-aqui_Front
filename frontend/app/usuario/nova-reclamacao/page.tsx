"use client"

import type React from "react"

import { useState } from "react"
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
import { ArrowLeft, Upload, X, Star, Send, Building2, FileText, Camera } from "lucide-react"
import Link from "next/link"

const categories = [
  "E-commerce",
  "Bancos",
  "Telecomunicações",
  "Varejo",
  "Serviços",
  "Transporte",
  "Alimentação",
  "Saúde",
  "Educação",
  "Outros",
]

const companies = [
  "TechStore Brasil",
  "Banco Digital Plus",
  "LogiExpress",
  "MegaVarejo",
  "ConectaNet",
  "StreamMax",
  "FoodDelivery",
  "HealthCare Plus",
  "EduOnline",
]

export default function NewComplaintPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "",
    description: "",
    rating: 0,
    attachments: [] as File[],
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simular envio
    setTimeout(() => {
      setIsLoading(false)
      // Redirecionar para dashboard
      window.location.href = "/usuario/dashboard"
    }, 2000)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.company && formData.category
      case 2:
        return formData.description.length >= 50
      case 3:
        return formData.rating > 0
      default:
        return false
    }
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
                {step === 3 && "Avaliação e Finalização"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Conte-nos sobre a empresa e o tipo de problema"}
                {step === 2 && "Detalhe o que aconteceu e como gostaria que fosse resolvido"}
                {step === 3 && "Avalie sua experiência e finalize a reclamação"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {step === 1 && (
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

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa *</Label>
                    <Select
                      value={formData.company}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, company: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione ou digite o nome da empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2" />
                              {company}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria do problema" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Description */}
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
                        <div className="flex flex-col items-center space-y-2">
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
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Arquivos anexados:</p>
                        <div className="space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
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

              {/* Step 3: Rating and Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Como você avalia sua experiência com esta empresa? *</Label>
                    <div className="flex items-center justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      {formData.rating === 1 && "Muito insatisfeito"}
                      {formData.rating === 2 && "Insatisfeito"}
                      {formData.rating === 3 && "Neutro"}
                      {formData.rating === 4 && "Satisfeito"}
                      {formData.rating === 5 && "Muito satisfeito"}
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Resumo da sua reclamação:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{formData.category}</Badge>
                        <span className="text-muted-foreground">•</span>
                        <span>{formData.company}</span>
                      </div>
                      <p className="font-medium">{formData.title}</p>
                      <p className="text-muted-foreground line-clamp-3">{formData.description}</p>
                      {formData.attachments.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {formData.attachments.length} arquivo(s) anexado(s)
                        </p>
                      )}
                    </div>
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
