"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  email: string
  name: string
  profilePicture?: string
  organization?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  updateProfile: (updates: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple demo authentication - in real app, this would call an API
    if (email && password) {
      setUser({
        email,
        name: email.split("@")[0] || "User",
        organization: "Blue Carbon Initiative",
        role: "Marine Biologist",
      })
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simple demo signup - in real app, this would call an API
    if (email && password && name) {
      setUser({
        email,
        name,
        organization: "Blue Carbon Initiative",
        role: "Researcher",
      })
      return true
    }
    return false
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (user) {
      setUser({ ...user, ...updates })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
