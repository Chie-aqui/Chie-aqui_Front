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
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userType, userInfo, logout } = useAuth();

  const handleLogout = () => {
    logout();
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              CA
            </div>
            <span className="text-xl font-bold text-primary">Chie Aqui</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar empresas ou reclamações..."
                className="pl-10 bg-muted/50"
              />
            </div>
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
                placeholder="Buscar empresas ou reclamações..."
                className="pl-10 bg-muted/50"
              />
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
