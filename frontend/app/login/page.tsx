"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Building2, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import api from "@/services/api" // Import the axios instance

// Define types for API responses
interface UserLoginResponse {
  message: string;
  token: string;
  usuario_consumidor?: { id: number; email: string; /* Add other consumer fields as needed */ };
  usuario_empresa?: { id: number; email: string; nome: string; /* Add other company fields as needed */ };
}

interface LoginError {
  detail?: string;
  error?: string; // Backend also returns 'error' key
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"user" | "company">("user")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const loginData = Object.fromEntries(formData.entries()); // Convert FormData to plain object

    try {
      let apiEndpoint = ''
      if (userType === "user") {
        apiEndpoint = `/consumidores/login/`
      } else {
        apiEndpoint = `/empresas/login/`
      }

      const response = await api.post<UserLoginResponse>(apiEndpoint, loginData)
      const { token, usuario_consumidor, usuario_empresa } = response.data;

      // Determine the actual user type based on the successful login response
      let actualUserType: "user" | "company";
      if (userType === "user" && usuario_consumidor) {
        actualUserType = "user";
      } else if (userType === "company" && usuario_empresa) {
        actualUserType = "company";
      } else {
        throw new Error("Invalid user type in response.");
      }

      // Store token and user info in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userType', actualUserType);
      localStorage.setItem('userInfo', JSON.stringify(usuario_consumidor || usuario_empresa));
      
      if (actualUserType === "user") {
        window.location.href = "/usuario/dashboard";
      } else {
        window.location.href = "/empresa/dashboard";
      }

    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError(error.message);
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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
                <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
                <CardDescription>Acesse sua conta para gerenciar suas reclamações</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* User Type Selector */}
              <Tabs value={userType} onValueChange={(value) => {
                setUserType(value as "user" | "company")
                setLoginError(null) // Clear error when changing tab
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
                  <form id="user-login-form" onSubmit={handleLogin} className="space-y-4">
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
                          name="senha"
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          className="pl-10 pr-10"
                          required
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

                    <div className="flex items-center justify-between text-sm">
                      <Link href="/esqueci-senha" className="text-primary hover:underline">
                        Esqueci minha senha
                      </Link>
                    </div>

                    {loginError && (
                      <div className="text-red-500 text-sm text-center border border-red-500/50 p-2 rounded">
                        {loginError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading} form="user-login-form">
                      {isLoading ? (
                        "Entrando..."
                      ) : (
                        <>
                          Entrar
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="company" className="mt-6">
                  <form id="company-login-form" onSubmit={handleLogin} className="space-y-4">
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
                      <Label htmlFor="company-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Senha da empresa"
                          className="pl-10 pr-10"
                          required
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

                    <div className="flex items-center justify-between text-sm">
                      <Link href="/esqueci-senha" className="text-primary hover:underline">
                        Esqueci minha senha
                      </Link>
                    </div>

                    {loginError && (
                      <div className="text-red-500 text-sm text-center border border-red-500/50 p-2 rounded">
                        {loginError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading} form="company-login-form">
                      {isLoading ? (
                        "Entrando..."
                      ) : (
                        <>
                          Entrar como Empresa
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
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <Link href="/cadastro" className="text-primary hover:underline font-medium">
                  Cadastre-se gratuitamente
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