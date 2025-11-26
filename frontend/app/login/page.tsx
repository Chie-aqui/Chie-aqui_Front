"use client"

import { useState } from "react"
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
import api from "@/services/api"
import { useAuth } from "@/hooks/use-auth" // Import the useAuth hook

// Define types for API responses to match backend structure
interface LoginResponse {
  message: string;
  token: string;
  usuario_consumidor?: any;
  usuario_empresa?: any;
}

export default function LoginPage() {
  const { login } = useAuth(); // Use the login function from our auth context
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
    const loginData = Object.fromEntries(formData.entries());

    // Ensure the password field name is 'senha' for company as well
    if (userType === 'company' && loginData.password) {
      loginData.senha = loginData.password;
      delete loginData.password;
    }
    
    try {
      const apiEndpoint = userType === "user" ? `/consumidores/login/` : `/empresas/login/`;
      const response = await api.post<LoginResponse>(apiEndpoint, loginData);
      const { token, usuario_consumidor, usuario_empresa } = response.data;

      if (token && (usuario_consumidor || usuario_empresa)) {
        // Call the central login function to set the auth state globally
        login(token, userType, usuario_consumidor || usuario_empresa);
      } else {
        throw new Error("Token ou informações do usuário ausentes na resposta.");
      }

    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError("Ocorreu um erro desconhecido. Tente novamente.");
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
              <Tabs value={userType} onValueChange={(value) => {
                setUserType(value as "user" | "company")
                setLoginError(null)
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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Entrando..." : <>Entrar<ArrowRight className="ml-2 h-4 w-4" /></>}
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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Entrando..." : <>Entrar como Empresa<ArrowRight className="ml-2 h-4 w-4" /></>}
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