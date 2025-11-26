"use client";

import { useState, useEffect, createContext, useContext, ReactNode, FC } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

interface UserInfo {
  usuario: {
    id: number;
    email: string;
    nome?: string;
  };
  companyId?: number; // Add companyId for company users
}

interface AuthState {
  isAuthenticated: boolean;
  userType: "user" | "company" | null;
  userInfo: UserInfo | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, userType: "user" | "company", userInfo: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    userInfo: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType') as "user" | "company" | null;
    const userInfoString = localStorage.getItem('userInfo');

    if (token && userType && userInfoString) {
      try {
        const userInfo: UserInfo = JSON.parse(userInfoString);
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
        setAuthState({
          isAuthenticated: true,
          userType,
          userInfo,
          token,
        });
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userType: "user" | "company", userInfo: any) => {
    const essentialUserInfo: UserInfo = {
      usuario: {
        id: userInfo.display_id || userInfo.usuario?.id,
        email: userInfo.display_email || userInfo.usuario?.email,
        nome: userInfo.display_nome || userInfo.usuario?.nome,
      },
    };
  
    if (userType === "company") {
      essentialUserInfo.companyId = userInfo.id;
    }
  
    localStorage.setItem('authToken', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userInfo', JSON.stringify(essentialUserInfo));
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    setAuthState({
      isAuthenticated: true,
      userType,
      userInfo: essentialUserInfo,
      token,
    });
  
    if (userType === "user") {
      router.push("/usuario/dashboard");
    } else {
      router.push("/empresa/dashboard");
    }
  };
  

  const logout = async () => {
    const currentUserType = localStorage.getItem('userType');
    let logoutEndpoint = '';
    if (currentUserType === "user") {
      logoutEndpoint = '/consumidores/logout/';
    } else if (currentUserType === "company") {
      logoutEndpoint = '/empresas/logout/';
    }

    try {
      if (logoutEndpoint) {
        await api.post(logoutEndpoint);
      }
    } catch (error) {
      console.error("Logout API call failed, but logging out client-side anyway.", error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('userInfo');
      delete api.defaults.headers.common['Authorization'];
      setAuthState({
        isAuthenticated: false,
        userType: null,
        userInfo: null,
        token: null,
      });
      router.push("/login");
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
