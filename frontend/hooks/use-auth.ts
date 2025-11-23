import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

interface UserInfo {
  id: number;
  email: string;
  nome?: string; // For companies
  // Add other common user/company fields as needed
}

interface AuthState {
  isAuthenticated: boolean;
  userType: "user" | "company" | null;
  userInfo: UserInfo | null;
  token: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    userInfo: null,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType') as "user" | "company" | null;
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo: UserInfo | null = userInfoString ? JSON.parse(userInfoString) : null;

    if (token && userType && userInfo) {
      setAuthState({
        isAuthenticated: true,
        userType,
        userInfo,
        token,
      });
      // Set Authorization header for Axios
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      setAuthState({
        isAuthenticated: false,
        userType: null,
        userInfo: null,
        token: null,
      });
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  const login = (token: string, userType: "user" | "company", userInfo: UserInfo) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setAuthState({
      isAuthenticated: true,
      userType,
      userInfo,
      token,
    });
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    if (userType === "user") {
      router.push("/usuario/dashboard");
    } else {
      router.push("/empresa/dashboard");
    }
  };

  const logout = async () => {
    const currentAuthToken = localStorage.getItem('authToken');
    const currentUserType = localStorage.getItem('userType');

    if (currentAuthToken && currentUserType) {
      try {
        let logoutEndpoint = '';
        if (currentUserType === "user") {
          logoutEndpoint = '/consumidores/logout/';
        } else if (currentUserType === "company") {
          logoutEndpoint = '/empresas/logout/';
        }

        if (logoutEndpoint) {
          await api.post(logoutEndpoint);
        }
      } catch (error) {
        console.error("Logout API call failed:", error);
        // Even if API call fails, clear local storage for a fresh state
      }
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userInfo');
    setAuthState({
      isAuthenticated: false,
      userType: null,
      userInfo: null,
      token: null,
    });
    delete api.defaults.headers.common['Authorization'];
    router.push("/login");
  };

  return { ...authState, login, logout };
}

// Optionally, you might want to create an AuthProvider for context management
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const auth = useAuth();
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// }

// export function useAuthContext() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuthContext must be used within an AuthProvider');
//   }
//   return context;
// }
