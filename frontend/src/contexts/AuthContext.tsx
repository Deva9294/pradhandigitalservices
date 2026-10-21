"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  if (role === "admin" || role === "superadmin") {
    return "/admin";
  }
  if (role === "agent" || role === "staff") {
    return "/agent";
  }
  return "/dashboard";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("pds-token");
    const savedUser = parseStoredUser(localStorage.getItem("pds-user"));
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    } else if (savedToken || localStorage.getItem("pds-user")) {
      localStorage.removeItem("pds-token");
      localStorage.removeItem("pds-user");
    }
  }, []);

  const login = (t: string, u: User) => {
    setToken(t);
    setUser(u);
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
  const isCustomer = !isAdmin && !isAgent;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        isAgent,
        isCustomer,
        getRoleRedirect: (overrideRole) => getRoleRedirect(overrideRole || user?.role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
