"use client"

import type React from "react"
import { useApp } from "../context/AppContext"
import type { PageType } from "../App"
import {
  FaProjectDiagram,
  FaClock,
  FaCheckCircle,
  FaCertificate,
  FaEye,
  FaLeaf,
  FaWater,
  FaSeedling,
  FaCog,
} from "react-icons/fa"

interface DashboardProps {
  setCurrentPage: (page: PageType) => void
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const { projects, credits, activities, metrics } = useApp()

  const recentProjects = projects.slice(0, 5)

  const getProjectIcon = (type: string) => {
    switch (type) {
      case "Mangrove":
        return <FaLeaf className="w-4 h-4 text-green-600" />
      case "Seagrass":
        return <FaWater className="w-4 h-4 text-blue-600" />
      case "Saltmarsh":
        return <FaSeedling className="w-4 h-4 text-emerald-600" />
      default:
        return <FaProjectDiagram className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case "Approved":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return formatDate(timestamp)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-balance">Dashboard Overview</h1>
        <p className="mt-2 text-muted-foreground">Monitor your blue carbon projects and credit generation</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaProjectDiagram className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Projects</dt>
                <dd className="text-3xl font-bold text-foreground">{metrics.totalProjects}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaClock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Pending Verification</dt>
                <dd className="text-3xl font-bold text-foreground">{metrics.pendingVerification}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Approved Projects</dt>
                <dd className="text-3xl font-bold text-foreground">{metrics.approvedProjects}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCertificate className="h-8 w-8 text-accent" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Credits Issued</dt>
                <dd className="text-3xl font-bold text-foreground">
                  {metrics.totalCreditsIssued}
                  <span className="text-sm font-normal text-muted-foreground ml-1">tCO₂e</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
                <button
                  onClick={() => setCurrentPage("projects")}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View all
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {recentProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getProjectIcon(project.type)}
                          <span className="ml-2 text-sm text-foreground">{project.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(project.status)}>{project.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(project.dateCreated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary hover:text-primary/80 flex items-center">
                          <FaEye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {activities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== activities.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`
                              h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-background
                              ${
                                activity.type === "project"
                                  ? "bg-primary"
                                  : activity.type === "credit"
                                    ? "bg-accent"
                                    : "bg-muted"
                              }
                            `}
                            >
                              {activity.type === "project" ? (
                                <FaProjectDiagram className="h-4 w-4 text-white" />
                              ) : activity.type === "credit" ? (
                                <FaCertificate className="h-4 w-4 text-white" />
                              ) : (
                                <FaCog className="h-4 w-4 text-muted-foreground" />
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <p className="text-sm text-foreground">{activity.message}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {formatTimestamp(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
