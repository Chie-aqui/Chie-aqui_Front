"use client";

import { Search, User, Building2, Menu, LogOut, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import api from "@/services/api";

interface CompanySuggestion {
  display_id: number;
  razao_social: string;
  nome_social: string | null;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState<CompanySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { isAuthenticated, userType, userInfo, logout } = useAuth();
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleCompanySearch = () => {
    if (companySearchTerm.trim()) {
      router.push(`/empresas/search?q=${companySearchTerm}`);
      setCompanySearchTerm(""); // Clear search term after search
      setCompanySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchCompanySuggestions = async (query: string) => {
    if (query.length < 2) {
      setCompanySuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await api.get(`/empresas/?search=${query}`);
      setCompanySuggestions(response.data.results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching company suggestions:", error);
      setCompanySuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (companySearchTerm) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchCompanySuggestions(companySearchTerm);
      }, 300); // Debounce for 300ms
    } else {
      setCompanySuggestions([]);
      setShowSuggestions(false);
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [companySearchTerm]);

  const handleSuggestionClick = (companyId: number) => {
    router.push(`/empresas/${companyId}`);
    setCompanySearchTerm("");
    setCompanySuggestions([]);
    setShowSuggestions(false);
  };

  const displayName =
  userInfo?.usuario?.nome ||
  userInfo?.usuario?.email ||
  "Usuário";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
                src="/chie_aqui_logo.png"  
                alt="Logo"
                width={72}                
                height={72}               
                className="rounded-lg object-cover"
              />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar empresas..."
              className="pl-10 bg-muted/50"
              value={companySearchTerm}
              onChange={(e) => setCompanySearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCompanySearch()}
              onFocus={() => companySearchTerm && companySuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            />
            {companySuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg mt-1 z-10">
                {companySuggestions.map((company) => (
                  <div
                    key={company.display_id}
                    className="px-4 py-2 hover:bg-muted cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(company.display_id)}
                  >
                    {company.razao_social || company.nome_social}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Início
            </Link>
            <Link
              href="/sobre"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sobre
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">

                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={
                      userType === "user"
                        ? "/usuario/nova-reclamacao"
                        : "/empresa/dashboard"
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {userType === "user" ? "Nova Reclamação" : "Dashboard"}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full p-0"
                    >
                      <Avatar className="h-8 w-8 flex items-center justify-center bg-muted rounded-full">
                        <AvatarFallback>
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userInfo?.usuario?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          userType === "user"
                            ? "/usuario/perfil"
                            : "/empresa/perfil"
                        }
                        className="flex"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          userType === "user"
                            ? "/usuario/dashboard"
                            : "/empresa/dashboard"
                        }
                        className="flex"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout} className="flex">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login" className="flex">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/cadastro" className="flex">
                    <Building2 className="h-4 w-4 mr-2" />
                    Cadastro
                  </Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar empresas..."
                className="pl-10 bg-muted/50"
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCompanySearch()}
                onFocus={() => companySearchTerm && companySuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              />
              {showSuggestions && companySuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg mt-1 z-10">
                  {companySuggestions.map((company) => (
                    <div
                      key={company.display_id}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onMouseDown={() => handleSuggestionClick(company.display_id)}
                    >
                      {company.razao_social || company.nome_social}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <nav className="flex flex-col space-y-3">

              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Início
              </Link>
              <Link
                href="/sobre"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sobre
              </Link>

              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-2 border-t">

                  <div className="flex items-center space-x-2 px-2 py-1">
                    <Avatar className="h-6 w-6 flex items-center justify-center bg-muted rounded-full">
                      <AvatarFallback className="text-xs">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{displayName}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <Link href={
                      userType === "user"
                        ? "/usuario/dashboard"
                        : "/empresa/dashboard"
                    }>
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <Link href={
                      userType === "user"
                        ? "/usuario/perfil"
                        : "/empresa/perfil"
                    }>
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">

                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <Link href="/cadastro">
                      <Building2 className="h-4 w-4 mr-2" />
                      Cadastro
                    </Link>
                  </Button>

                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
