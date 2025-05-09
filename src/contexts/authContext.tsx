"use client";
import { Profile } from "@/repository/auth.repository";
import { createContext, useContext } from "react";

export interface AuthContextType {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
