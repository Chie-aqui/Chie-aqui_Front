"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { User, Building2, Eye, EyeOff, Mail, Lock, UserIcon, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<"user" | "company">("user")
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) {
      alert("Você deve aceitar os termos de uso para continuar")
      return
    }

    setIsLoading(true)
    // Simular cadastro
    setTimeout(() => {
      setIsLoading(false)
      // Redirecionar para login
      window.location.href = "/login"
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {userType === "user" ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">Criar nova conta</CardTitle>
                <CardDescription>Cadastre-se gratuitamente e comece a usar o Chie Aqui</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* User Type Selector */}
              <Tabs value={userType} onValueChange={(value) => setUserType(value as "user" | "company")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Usuário
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Empresa
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="mt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="name" type="text" placeholder="Seu nome completo" className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          className="pl-10 pr-10"
                          required
                          minLength={8}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite a senha novamente"
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        Aceito os{" "}
                        <Link href="/termos" className="text-primary hover:underline">
                          termos de uso
                        </Link>{" "}
                        e{" "}
                        <Link href="/privacidade" className="text-primary hover:underline">
                          política de privacidade
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
                      {isLoading ? (
                        "Criando conta..."
                      ) : (
                        <>
                          Criar conta
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="company" className="mt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da empresa</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-name"
                          type="text"
                          placeholder="Nome da sua empresa"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="cnpj" type="text" placeholder="00.000.000/0000-00" className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-email">E-mail da empresa</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-email"
                          type="email"
                          placeholder="contato@empresa.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          className="pl-10 pr-10"
                          required
                          minLength={8}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-confirm-password">Confirmar senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite a senha novamente"
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="company-terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <Label htmlFor="company-terms" className="text-sm">
                        Aceito os{" "}
                        <Link href="/termos" className="text-primary hover:underline">
                          termos de uso
                        </Link>{" "}
                        e{" "}
                        <Link href="/privacidade" className="text-primary hover:underline">
                          política de privacidade
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
                      {isLoading ? (
                        "Criando conta..."
                      ) : (
                        <>
                          Criar conta da empresa
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou</span>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Faça login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
