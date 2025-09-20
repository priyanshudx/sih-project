"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { AppProvider } from "./context/AppContext"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Credits from "./pages/Credits"
import Settings from "./pages/Settings"
import Marketplace from "./pages/Marketplace"
import LandingPage from "./components/LandingPage"
import SignupPage from "./components/SignupPage"

export type PageType = "dashboard" | "projects" | "credits" | "settings" | "marketplace"

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [isSignupMode, setIsSignupMode] = useState(false)
  const { isAuthenticated, login, signup } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    await signup(email, password, name)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />
      case "projects":
        return <Projects />
      case "credits":
        return <Credits />
      case "settings":
        return <Settings />
      case "marketplace":
        return <Marketplace />
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />
    }
  }

  if (!isAuthenticated) {
    if (isSignupMode) {
      return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setIsSignupMode(false)} />
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
