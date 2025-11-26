"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import api from "@/services/api" 
import { useAuth } from "@/hooks/use-auth"; 

// Define types for API responses
interface SignupResponse {
  message: string;
  token: string;
  usuario_consumidor?: { id: number; email: string; nome: string; /* Add other consumer fields as needed */ };
  usuario_empresa?: { id: number; email: string; nome: string; cnpj: string; razao_social: string; nome_social?: string; descricao?: string; /* Add other company fields as needed */ };
}

interface SignupError {
  detail?: string;
  error?: string; // Backend also returns 'error' key
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<"user" | "company">("user")
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const { login } = useAuth(); // Get the login function from useAuth

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) {
      setSignupError("Você deve aceitar os termos de uso para continuar")
      return
    }

    setIsLoading(true)
    setSignupError(null)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const signupData: { [key: string]: any } = Object.fromEntries(formData.entries()); // Convert FormData to plain object

    // Client-side password confirmation
    if (signupData.senha !== signupData.confirm_senha) {
        setSignupError("As senhas não coincidem.");
        setIsLoading(false);
        return;
    }
    delete signupData.confirm_senha; // Remove confirm_senha before sending
    
    try {
      let apiEndpoint = ''
      if (userType === "user") {
        apiEndpoint = `/consumidores/cadastro/` // New endpoint for consumer registration
      } else {
        apiEndpoint = `/empresas/cadastro/`
      }

      // For company registration, ensure 'nome' field for the base User is populated
      if (userType === "company") { 
          signupData.nome = signupData.nome_empresa; // Assign directly
          delete signupData.nome_empresa; // Remove the frontend-specific field
      }

      console.log("[DEBUG] Frontend sending signup data:", signupData); // Add this line for debugging

      const response = await api.post<SignupResponse>(apiEndpoint, signupData)
      const { token, usuario_consumidor, usuario_empresa } = response.data;

      // Determine the actual user type based on the successful signup response
      let actualUserType: "user" | "company";
      let userInfo: any; // Use 'any' for now, can be refined with specific types

      if (userType === "user" && usuario_consumidor) {
        actualUserType = "user";
        userInfo = usuario_consumidor; // The backend returns usuario_consumidor object
      } else if (userType === "company" && usuario_empresa) {
        actualUserType = "company";
        userInfo = usuario_empresa; // The backend returns usuario_empresa object
      } else {
        throw new Error("Invalid user type or missing user data in response.");
      }

      // Log the user in directly after successful signup
      login(token, actualUserType, userInfo);


    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.error) {
            setSignupError(error.response.data.error);
        } else if (error.response.data.email) {
            setSignupError(`Email: ${error.response.data.email[0]}`);
        } else if (error.response.data.cnpj) {
            setSignupError(`CNPJ: ${error.response.data.cnpj[0]}`);
        } else if (error.response.data.senha) {
            setSignupError(`Senha: ${error.response.data.senha[0]}`);
        } else {
            setSignupError("Ocorreu um erro no cadastro. Verifique os dados e tente novamente.");
        }
      } else {
        setSignupError(error.message)
      }
      console.error("Signup error:", error)
    } finally {
      setIsLoading(false)
    }
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
              <Tabs value={userType} onValueChange={(value) => {
                setUserType(value as "user" | "company")
                setSignupError(null) // Clear error when changing tab
              }}>
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
                  <form id="user-signup-form" onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Nome completo</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="user-name" name="nome" type="text" placeholder="Seu nome completo" className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="user-email" name="email" type="email" placeholder="seu@email.com" className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="user-password"
                          name="senha" // Changed to 'senha' for backend consistency
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
                      <Label htmlFor="user-confirm-password">Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="user-confirm-password"
                          name="confirm_senha"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          className="pl-10 pr-10"
                          required
                          minLength={8}
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
                        id="user-terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => {
                           setAcceptTerms(checked as boolean)
                           setSignupError(null) // Clear error on terms change
                        }}
                      />
                      <Label htmlFor="user-terms" className="text-sm">
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

                    {signupError && (
                      <div className="text-red-500 text-sm text-center border border-red-500/50 p-2 rounded">
                        {signupError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms} form="user-signup-form">
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
                  <form id="company-signup-form" onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da empresa</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-name"
                          name="nome_empresa"
                          type="text"
                          placeholder="Nome da sua empresa"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-cnpj">CNPJ</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="company-cnpj" name="cnpj" type="text" placeholder="00.000.000/0000-00" className="pl-10" required />
                      </div>
                    </div>
                      <div className="space-y-2">
                           <Label htmlFor="company-email">E-mail da empresa</Label>
                           <div className="relative">
                             <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                               id="company-email"
                             name="email"
                               type="email"
                               placeholder="contato@empresa.com"
                           className="pl-10"
                           required
                         />
                       </div>
                     </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-razao-social">Razão Social</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-razao-social"
                          name="razao_social"
                          type="text"
                          placeholder="Razão Social da sua empresa"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-nome-social">Nome Social (opcional)</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-nome-social"
                          name="nome_social"
                          type="text"
                          placeholder="Nome social da empresa (fantasia)"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-descricao">Descrição (opcional)</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-descricao"
                          name="descricao"
                          type="text"
                          placeholder="Breve descrição da sua empresa"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-password"
                          name="senha" // Changed to 'senha' for backend consistency
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
                      <Label htmlFor="company-confirm-password">Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-confirm-password"
                          name="confirm_senha"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          className="pl-10 pr-10"
                          required
                          minLength={8}
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
                        onCheckedChange={(checked) => {
                          setAcceptTerms(checked as boolean)
                          setSignupError(null)
                        }}
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

                    {signupError && (
                      <div className="text-red-500 text-sm text-center border border-red-500/50 p-2 rounded">
                        {signupError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms} form="company-signup-form">
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