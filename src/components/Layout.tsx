"use client"

import type React from "react"
import { useState } from "react"
import type { PageType } from "../App"
import { useAuth } from "../context/AuthContext"
import {
  FaHome,
  FaProjectDiagram,
  FaCertificate,
  FaCog,
  FaBars,
  FaTimes,
  FaUser,
  FaSearch,
  FaSignOutAlt,
  FaStore,
} from "react-icons/fa"

interface LayoutProps {
  children: React.ReactNode
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const navigation = [
    { name: "Dashboard", page: "dashboard" as PageType, icon: FaHome },
    { name: "Projects", page: "projects" as PageType, icon: FaProjectDiagram },
      // { name: "Credits", page: "credits" as PageType, icon: FaCertificate },
      // { name: "Marketplace", page: "marketplace" as PageType, icon: FaStore },
    { name: "Settings", page: "settings" as PageType, icon: FaCog },
  ]

  const isActive = (page: PageType) => {
    return currentPage === page
  }

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BC</span>
              </div>
              <span className="text-xl font-bold text-foreground">BlueCrew</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.page)}
                    className={`
                      flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
                      ${
                        isActive(item.page)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </button>
                )
              })}
            </nav>

            {/* Right side - Search, Profile, Logout */}
            <div className="flex items-center space-x-4">
              {/* Search - Hidden on mobile */}
              <div className="hidden lg:block relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  className="block w-64 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Search projects, credits..."
                  type="search"
                />
              </div>

              {/* Profile */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-4 h-4 text-accent-foreground" />
                  )}
                </div>
                <div className="hidden lg:block"></div>
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                title="Sign Out"
              >
                <FaSignOutAlt className="w-4 h-4" />
              </button>

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.page)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left
                      ${
                        isActive(item.page)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                )
              })}

              {/* Mobile Search */}
              <div className="pt-3 border-t border-border mt-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    className="block w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Search projects, credits..."
                    type="search"
                  />
                </div>
              </div>

              {/* Mobile Profile */}
              <div className="pt-3 border-t border-border mt-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center overflow-hidden">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-4 h-4 text-accent-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}

export default Layout
