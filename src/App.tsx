"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { AppProvider } from "./context/AppContext"
import Layout from "./components/Layout"
// Removed broken imports for non-existent app/* components

import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Credits from "./pages/Credits"
import Marketplace from "./pages/Marketplace"
import Settings from "./pages/Settings"
import LandingPage from "./components/LandingPage"
import SignupPage from "./components/SignupPage"

// export type PageType = "dashboard" | "projects" | "credits" | "settings" | "marketplace"
export type PageType = "dashboard" | "projects" | "credits" | "marketplace" | "settings"

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [isSignupMode, setIsSignupMode] = useState(false)
  const { isAuthenticated, login, signup } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    return await login(email, password)
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    await signup(email, password, name)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "projects":
        return <Projects />;
      case "credits":
        return <Credits />;
      case "marketplace":
        return <Marketplace />;
      case "settings":
        return <Settings />;
      default:
        return <div>Page not found or not implemented.</div>;
    }
  }

  if (!isAuthenticated) {
    if (isSignupMode) {
     // if (isSignupMode) {
     //   return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setIsSignupMode(false)} />
    }
    return <LandingPage onLogin={handleLogin} onSwitchToSignup={() => setIsSignupMode(true)} />
  }

  return (
    <AppProvider>
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
