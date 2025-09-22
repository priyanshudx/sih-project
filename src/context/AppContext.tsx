"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface Project {
  id: string
  name: string
  type: "Mangrove" | "Seagrass" | "Saltmarsh"
  location: string
  area: number
  status: "Pending" | "Approved" | "Rejected"
  estimatedCarbon: number
  dateCreated: string
  metadata: {
    coordinator: string
    fundingSource: string
    methodology: string
    monitoringFrequency: string
  }
  notes: string
}

interface Credit {
  id: string
  projectId: string
  projectName: string
  amount: number
  status: "Issued" | "Retired"
  dateIssued: string
  verificationReport: string
}

interface Activity {
  id: string
  message: string
  timestamp: string
  type: "project" | "credit" | "system"
}

interface AppContextType {
  projects: Project[]
  credits: Credit[]
  activities: Activity[]
  metrics: {
    totalProjects: number
    pendingVerification: number
    approvedProjects: number
    totalCreditsIssued: number
  }
  updateProject: (id: string, updates: Partial<Project>) => void
  addProject: (project: Omit<Project, "id" | "dateCreated">) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Mangrove Restoration Sundarbans",
      type: "Mangrove",
      location: "Sundarbans, West Bengal, India",
      area: 150,
      status: "Approved",
      estimatedCarbon: 2250,
      dateCreated: "2024-01-15",
      metadata: {
        coordinator: "Dr. Sarah Johnson",
        fundingSource: "Blue Carbon Initiative",
        methodology: "VM0033",
        monitoringFrequency: "Quarterly",
      },
      notes:
        "This project focuses on restoring 150 hectares of mangrove ecosystem in the Sundarbans. The restoration includes replanting native mangrove species and removing invasive vegetation. Expected to sequester significant amounts of blue carbon while providing coastal protection.",
    },
    {
      id: "2",
      name: "Seagrass Conservation Gulf of Mannar",
      type: "Seagrass",
      location: "Gulf of Mannar, Tamil Nadu, India",
      area: 200,
      status: "Pending",
      estimatedCarbon: 1800,
      dateCreated: "2024-02-20",
      metadata: {
        coordinator: "Prof. Michael Chen",
        fundingSource: "EPA Grant",
        methodology: "VM0033",
        monitoringFrequency: "Monthly",
      },
      notes:
        "Large-scale seagrass restoration in the Gulf of Mannar focusing on Halophila ovalis. Project includes water quality monitoring and community engagement components.",
    },
    {
      id: "3",
      name: "Saltmarsh Restoration Bhitarkanika",
      type: "Saltmarsh",
      location: "Bhitarkanika, Odisha, India",
      area: 120,
      status: "Approved",
      estimatedCarbon: 1680,
      dateCreated: "2024-01-08",
      metadata: {
        coordinator: "Dr. Emily Rodriguez",
        fundingSource: "State Environmental Fund",
        methodology: "VM0033",
        monitoringFrequency: "Bi-monthly",
      },
      notes:
        "Restoration of degraded saltmarsh habitat with native plant species in Bhitarkanika. Includes sediment management and invasive species control.",
    },
    {
      id: "4",
      name: "Coastal Wetland Protection Gujarat",
      type: "Mangrove",
      location: "Gulf of Kutch, Gujarat, India",
      area: 300,
      status: "Rejected",
      estimatedCarbon: 4500,
      dateCreated: "2024-03-01",
      metadata: {
        coordinator: "Dr. James Wilson",
        fundingSource: "Private Foundation",
        methodology: "VM0033",
        monitoringFrequency: "Quarterly",
      },
      notes:
        "Large-scale coastal protection project in the Gulf of Kutch. Rejected due to insufficient baseline data. Resubmission planned with additional monitoring data.",
    },
    {
      id: "5",
      name: "Blue Carbon Research Chilika Lake",
      type: "Seagrass",
      location: "Chilika Lake, Odisha, India",
      area: 80,
      status: "Pending",
      estimatedCarbon: 720,
      dateCreated: "2024-03-10",
      metadata: {
        coordinator: "Dr. Lisa Park",
        fundingSource: "Research Grant",
        methodology: "VM0033",
        monitoringFrequency: "Weekly",
      },
      notes:
        "Research-focused project studying blue carbon sequestration rates in seagrass meadows of Chilika Lake. Includes advanced monitoring equipment and data collection.",
    },
  ])

  const [credits] = useState<Credit[]>([
    {
      id: "BC-001",
      projectId: "1",
      projectName: "Mangrove Restoration Bay Area",
      amount: 150,
      status: "Issued",
      dateIssued: "2024-02-15",
      verificationReport: "/reports/BC-001-verification.pdf",
    },
    {
      id: "BC-002",
      projectId: "3",
      projectName: "Saltmarsh Restoration Initiative",
      amount: 120,
      status: "Issued",
      dateIssued: "2024-02-28",
      verificationReport: "/reports/BC-002-verification.pdf",
    },
    {
      id: "BC-003",
      projectId: "1",
      projectName: "Mangrove Restoration Bay Area",
      amount: 100,
      status: "Retired",
      dateIssued: "2024-03-05",
      verificationReport: "/reports/BC-003-verification.pdf",
    },
  ])

  const [activities] = useState<Activity[]>([
    {
      id: "1",
      message: "Project 'Mangrove Restoration Bay Area' was approved",
      timestamp: "2024-03-15T10:30:00Z",
      type: "project",
    },
    {
      id: "2",
      message: "150 Credits were issued to Blue Carbon Initiative",
      timestamp: "2024-03-15T09:15:00Z",
      type: "credit",
    },
    {
      id: "3",
      message: "Project 'Coastal Wetland Protection' verification completed",
      timestamp: "2024-03-14T16:45:00Z",
      type: "project",
    },
    {
      id: "4",
      message: "100 Credits were retired by Ocean Foundation",
      timestamp: "2024-03-14T14:20:00Z",
      type: "credit",
    },
    {
      id: "5",
      message: "System maintenance completed successfully",
      timestamp: "2024-03-13T22:00:00Z",
      type: "system",
    },
  ])

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...updates } : project)))
  }

  const addProject = (projectData: Omit<Project, "id" | "dateCreated">) => {
    const newProject: Project = {
      ...projectData,
      id: (projects.length + 1).toString(),
      dateCreated: new Date().toISOString().split("T")[0],
    }
    setProjects((prev) => [...prev, newProject])
  }

  const metrics = {
    totalProjects: projects.length,
    pendingVerification: projects.filter((p) => p.status === "Pending").length,
    approvedProjects: projects.filter((p) => p.status === "Approved").length,
    totalCreditsIssued: credits.reduce((sum, credit) => sum + credit.amount, 0),
  }

  return (
    <AppContext.Provider value={{ projects, credits, activities, metrics, updateProject, addProject }}>
      {children}
    </AppContext.Provider>
  )
}
