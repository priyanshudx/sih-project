"use client"

import type React from "react"
import { useState } from "react"
import { useApp } from "../context/AppContext"
import {
  FaLeaf,
  FaWater,
  FaSeedling,
  FaEye,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaClipboardList,
  FaSave,
  FaChartLine,
  FaImages,
  FaHistory,
  FaCoins,
  FaExternalLinkAlt,
  FaBuilding,
  FaRulerCombined,
  FaShieldAlt,
} from "react-icons/fa"

const Projects: React.FC = () => {
  const { projects, updateProject } = useApp()
  const [_, setForceUpdate] = useState(0) // force re-render after delete
  // Delete project handler
  const handleDeleteProject = (projectId: string) => {
    // Remove project from context (mock, since no API)
    const index = projects.findIndex((p) => p.id === projectId)
    if (index !== -1) {
      projects.splice(index, 1)
      setForceUpdate((n) => n + 1)
    }
  }
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<string>("")
  const [showCreditModal, setShowCreditModal] = useState<boolean>(false)
  const [creditAmount, setCreditAmount] = useState<number>(0)
  const [issuingCredits, setIssuingCredits] = useState<boolean>(false)
  const [blockchainStatus, setBlockchainStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [gasEstimate, setGasEstimate] = useState<number>(0)
  const [networkId, setNetworkId] = useState<number>(1)

  const filteredProjects = projects.filter((project) => {
    const statusMatch = statusFilter === "All" || project.status === statusFilter
    return statusMatch
  })

  const getProjectIcon = (type: string) => {
    switch (type) {
      case "Mangrove":
        return <FaLeaf className="w-5 h-5 text-green-500" />
      case "Seagrass":
        return <FaWater className="w-5 h-5 text-blue-500" />
      case "Saltmarsh":
        return <FaSeedling className="w-5 h-5 text-teal-500" />
      default:
        return <FaLeaf className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "Approved":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`
      case "Pending":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleViewProject = (projectId: string) => {
    setSelectedProject(projectId)
  }

  const handleEditProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      setEditingProject(projectId)
      setEditStatus(project.status)
    }
  }

  const handleSaveEdit = () => {
    if (editingProject) {
      updateProject(editingProject, { status: editStatus as "Pending" | "Approved" | "Rejected" })
      setEditingProject(null)
      setEditStatus("")
    }
  }

  const selectedProjectData = selectedProject ? projects.find((p) => p.id === selectedProject) : null
  const editingProjectData = editingProject ? projects.find((p) => p.id === editingProject) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Projects</h1>
          <p className="mt-2 text-muted-foreground">Manage your blue carbon restoration projects</p>
        </div>
      </div>
      {/* Status Filter */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-gradient-to-r from-blue-100 to-green-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Carbon Estimate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center border border-blue-200">
                          {getProjectIcon(project.type)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{project.name}</div>
                        <div className="text-sm text-blue-600">ID: {project.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getProjectIcon(project.type)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{project.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FaMapMarkerAlt className="w-4 h-4 text-blue-500 mr-1" />
                      {project.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.area} ha</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(project.status)}>{project.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.estimatedCarbon.toLocaleString()} tCO₂e
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="w-4 h-4 mr-1" />
                      {formatDate(project.dateCreated)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewProject(project.id)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProject(project.id)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-colors"
                        title="Edit Project"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Project"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4 border border-blue-200">
            <FaLeaf className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">
            No projects match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
      {/* Project Details Modal */}
      {selectedProject && selectedProjectData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Section */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-lg bg-white/20 flex items-center justify-center">
                    {getProjectIcon(selectedProjectData.type)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedProjectData.name}</h2>
                    <p className="text-blue-100 text-lg">#{selectedProjectData.id}</p>
                    <div className="mt-2">
                      <span
                        className={`${getStatusBadge(selectedProjectData.status)} bg-white/20 text-white border-white/30`}
                      >
                        {selectedProjectData.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleEditProject(selectedProjectData.id)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-8">
              {/* Key Metrics Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Location</p>
                      <p className="text-2xl font-bold text-blue-800">{selectedProjectData.location}</p>
                    </div>
                    <FaMapMarkerAlt className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Area</p>
                      <p className="text-2xl font-bold text-green-800">{selectedProjectData.area} ha</p>
                    </div>
                    <FaRulerCombined className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-600 text-sm font-medium">Carbon Estimate</p>
                      <p className="text-2xl font-bold text-teal-800">
                        {selectedProjectData.estimatedCarbon.toLocaleString()}
                      </p>
                      <p className="text-teal-600 text-xs">tCO₂e</p>
                    </div>
                    <FaChartLine className="w-8 h-8 text-teal-500" />
                  </div>
                </div>
              </div>
              {/* Core Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaClipboardList className="w-5 h-5 text-blue-600 mr-2" />
                  Core Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Project Description</p>
                      <p className="text-gray-900 mt-1">
                        Restoration of {selectedProjectData.type.toLowerCase()} ecosystem to enhance carbon
                        sequestration and biodiversity.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Project Type</p>
                      <div className="flex items-center mt-1">
                        {getProjectIcon(selectedProjectData.type)}
                        <span className="ml-2 text-gray-900 font-medium">{selectedProjectData.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Start Date</p>
                      <p className="text-gray-900 mt-1">{formatDate(selectedProjectData.dateCreated)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Lead Organization</p>
                      <div className="flex items-center mt-1">
                        <FaBuilding className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-gray-900 font-medium">{selectedProjectData.metadata.coordinator}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Data Section - MRV Core */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaImages className="w-5 h-5 text-green-600 mr-2" />
                  Data & Monitoring
                </h3>
                {/* Image Gallery */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Image Gallery</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border border-blue-200 flex items-center justify-center"
                      >
                        <FaImages className="w-8 h-8 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Activity Log */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaHistory className="w-5 h-5 text-green-600 mr-2" />
                    Activity Log
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Nov 20: Submitted for verification</p>
                        <p className="text-xs text-gray-600">Project data submitted to verification body</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Nov 05: Health survey completed</p>
                        <p className="text-xs text-gray-600">Ecosystem health assessment conducted</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Oct 18: Planting completed</p>
                        <p className="text-xs text-gray-600">Initial restoration planting phase finished</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Project Notes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Notes</h3>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedProjectData.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Project Status Modal */}
      {editingProject && editingProjectData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Project Status</h2>
                <button onClick={() => setEditingProject(null)} className="text-white hover:text-gray-200 p-1 rounded">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{editingProjectData.name}</h3>
                <p className="text-sm text-gray-600 mb-4">Project ID: {editingProjectData.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                >
                  <FaSave className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
