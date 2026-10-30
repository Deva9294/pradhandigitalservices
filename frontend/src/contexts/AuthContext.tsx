"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";

export type UserRole = "customer" | "agent" | "staff" | "editor" | "admin" | "superadmin";
export type User = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole | string;
  walletBalance?: number;
  referralCode?: string;
  agentCode?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isReady: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  isCustomer: boolean;
  getRoleRedirect: (overrideRole?: string) => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseStoredUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    if (!parsed?.id || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getRoleRedirect(role?: string): string {
  if (role === "admin" || role === "superadmin") return "/admin";
  if (role === "agent" || role === "staff") return "/agent";
  return "/dashboard";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const savedToken = localStorage.getItem("pds-token");
      const savedUser = parseStoredUser(localStorage.getItem("pds-user"));

      if (!savedToken || !savedUser) {
        localStorage.removeItem("pds-token");
        localStorage.removeItem("pds-user");
        if (active) setIsReady(true);
        return;
      }

      try {
        const response = await authApi.getProfile();
        const freshUser = response.data?.user;
        if (!response.data?.success || !freshUser?.id || !freshUser?.role) {
          throw new Error("Session could not be verified");
        }
        if (!active) return;
        setToken(savedToken);
        setUser(freshUser);
        localStorage.setItem("pds-user", JSON.stringify(freshUser));
      } catch {
        localStorage.removeItem("pds-token");
        localStorage.removeItem("pds-user");
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setIsReady(true);
      }
    };

    restoreSession();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem("pds-token");
      localStorage.removeItem("pds-user");
    };
    window.addEventListener("pds:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("pds:unauthorized", handleUnauthorized);
  }, []);

  const login = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    setIsReady(true);
    localStorage.setItem("pds-token", t);
    localStorage.setItem("pds-user", JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("pds-token");
    localStorage.removeItem("pds-user");
  };

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isAgent = user?.role === "agent" || user?.role === "staff";
  const isCustomer = !!user && !isAdmin && !isAgent;

  return (
    <AuthContext.Provider value={{
      user, token, isReady, login, logout,
      isAuthenticated: !!user,
      isAdmin, isAgent, isCustomer,
      getRoleRedirect: (overrideRole) => getRoleRedirect(overrideRole || user?.role),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
