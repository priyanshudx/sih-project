"use client"

import type React from "react"
import { useState } from "react"
import { useApp } from "../context/AppContext"
import {
  FaPlus,
  FaFilter,
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
  FaPlane,
  FaHistory,
  FaCoins,
  FaExternalLinkAlt,
  FaBuilding,
  FaRulerCombined,
  FaPercentage,
  FaDownload,
  FaShieldAlt,
} from "react-icons/fa"

const Projects: React.FC = () => {
  const { projects, updateProject, addProject } = useApp()
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<string>("")
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showCreditModal, setShowCreditModal] = useState<boolean>(false)
  const [creditAmount, setCreditAmount] = useState<number>(0)
  const [issuingCredits, setIssuingCredits] = useState<boolean>(false)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [newProject, setNewProject] = useState({
    name: "",
    type: "Mangrove" as "Mangrove" | "Seagrass" | "Saltmarsh",
    location: "",
    area: 0,
    status: "Pending" as "Pending" | "Approved" | "Rejected",
    estimatedCarbon: 0,
    metadata: {
      coordinator: "",
      fundingSource: "",
      methodology: "VM0033",
      monitoringFrequency: "Quarterly",
    },
    notes: "",
  })

  const [blockchainStatus, setBlockchainStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [gasEstimate, setGasEstimate] = useState<number>(0)
  const [networkId, setNetworkId] = useState<number>(1) // Mainnet by default

  const filteredProjects = projects.filter((project) => {
    const statusMatch = statusFilter === "All" || project.status === statusFilter
    const typeMatch = typeFilter === "All" || project.type === typeFilter
    return statusMatch && typeMatch
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

  const handleAddProject = () => {
    setShowAddModal(true)
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("metadata.")) {
      const metadataField = field.split(".")[1]
      setNewProject((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value,
        },
      }))
    } else {
      setNewProject((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const validFiles: File[] = []
    const newPreviewUrls: string[] = []

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image file`)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`)
        return
      }

      validFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    })

    setSelectedPhotos((prev) => [...prev, ...validFiles])
    setPhotoPreviewUrls((prev) => [...prev, ...newPreviewUrls])
  }

  const removePhoto = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(photoPreviewUrls[index])

    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitProject = () => {
    if (!newProject.name || !newProject.location || newProject.area <= 0) {
      alert("Please fill in all required fields")
      return
    }

    console.log("[v0] Submitting project with photos:", selectedPhotos.length)

    addProject(newProject)
    setShowAddModal(false)

    photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    setSelectedPhotos([])
    setPhotoPreviewUrls([])
    setNewProject({
      name: "",
      type: "Mangrove",
      location: "",
      area: 0,
      status: "Pending",
      estimatedCarbon: 0,
      metadata: {
        coordinator: "",
        fundingSource: "",
        methodology: "VM0033",
        monitoringFrequency: "Quarterly",
      },
      notes: "",
    })
  }

  const connectToEthereum = async () => {
    setBlockchainStatus("connecting")
    try {
      // Simulate Web3 connection
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setWalletAddress("0x742d35Cc6634C0532925a3b8D4C9db96590e4CAb")
      setNetworkId(1) // Mainnet
      setBlockchainStatus("connected")
    } catch (error) {
      setBlockchainStatus("disconnected")
      alert("Failed to connect to Ethereum network")
    }
  }

  const handleIssueCredits = async () => {
    if (!selectedProject || creditAmount <= 0) {
      alert("Please enter a valid credit amount")
      return
    }

    if (blockchainStatus !== "connected") {
      alert("Please connect to Ethereum network first")
      return
    }

    setIssuingCredits(true)

    try {
      // Simulate gas estimation
      setGasEstimate(0.0045) // ETH

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      setTransactionHash(mockTxHash)

      // Update project with issued credits and blockchain data
      const project = projects.find((p) => p.id === selectedProject)
      if (project) {
        updateProject(selectedProject, {
          ...project,
          issuedCredits: (project.issuedCredits || 0) + creditAmount,
          creditStatus: "Issued" as any,
          blockchainData: {
            transactionHash: mockTxHash,
            blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
            contractAddress: "0x1234567890123456789012345678901234567890",
            tokenId: Math.floor(Math.random() * 10000) + 1000,
            timestamp: new Date().toISOString(),
            gasUsed: "0.0045 ETH",
            network: "Ethereum Mainnet",
          },
        })
      }

      alert(`Successfully issued ${creditAmount} carbon credits on Ethereum blockchain!`)
      setShowCreditModal(false)
      setCreditAmount(0)
    } catch (error) {
      alert("Blockchain transaction failed. Please try again.")
    } finally {
      setIssuingCredits(false)
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
        <button
          onClick={handleAddProject}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Add New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-4">
          <FaFilter className="w-5 h-5 text-blue-600" />
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
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">Project Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">All Types</option>
                <option value="Mangrove">Mangrove</option>
                <option value="Seagrass">Seagrass</option>
                <option value="Saltmarsh">Saltmarsh</option>
              </select>
            </div>
          </div>
          <div className="ml-auto text-sm text-blue-700 font-medium">
            {filteredProjects.length} of {projects.length} projects
          </div>
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
          <button
            onClick={handleAddProject}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add New Project
          </button>
        </div>
      )}

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

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaCoins className="w-5 h-5 text-blue-600 mr-2" />
                    Carbon Credits Registry
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${blockchainStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-600">
                      {blockchainStatus === "connected" ? "Ethereum Connected" : "Blockchain Disconnected"}
                    </span>
                  </div>
                </div>

                {blockchainStatus !== "connected" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-yellow-800">Ethereum Network Required</h4>
                        <p className="text-sm text-yellow-700">
                          Connect to Ethereum to issue and verify carbon credits
                        </p>
                      </div>
                      <button
                        onClick={connectToEthereum}
                        disabled={blockchainStatus === "connecting"}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {blockchainStatus === "connecting" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                            Connecting...
                          </>
                        ) : (
                          "Connect Ethereum"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-blue-600">Registry Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                        (selectedProjectData as any).creditStatus === "Issued"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {(selectedProjectData as any).creditStatus || "Pending Verification"}
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-blue-600">Total Credits Issued</p>
                    <p className="text-2xl font-bold text-blue-800 mt-1">
                      {((selectedProjectData as any).issuedCredits || 0).toLocaleString()} tCO₂e
                    </p>
                    <p className="text-xs text-blue-600">
                      {(selectedProjectData as any).issuedCredits ? "On-chain verified" : "Awaiting issuance"}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-blue-600">Token Contract</p>
                    <p className="text-sm font-mono text-gray-800 mt-1">
                      {(selectedProjectData as any).blockchainData?.contractAddress
                        ? `${(selectedProjectData as any).blockchainData.contractAddress.slice(0, 10)}...`
                        : "Not deployed"}
                    </p>
                    <p className="text-xs text-blue-600">ERC-721 Standard</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-blue-600">Network</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">Ethereum Mainnet</p>
                    <p className="text-xs text-blue-600">Chain ID: {networkId}</p>
                  </div>
                </div>

                {(selectedProjectData as any).blockchainData && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Latest Blockchain Transaction</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Transaction Hash</p>
                        <p className="font-mono text-blue-600 break-all">
                          {(selectedProjectData as any).blockchainData.transactionHash}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Block Number</p>
                        <p className="font-mono text-gray-800">
                          #{(selectedProjectData as any).blockchainData.blockNumber?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Token ID</p>
                        <p className="font-mono text-gray-800">
                          #{(selectedProjectData as any).blockchainData.tokenId}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Gas Used</p>
                        <p className="font-mono text-gray-800">{(selectedProjectData as any).blockchainData.gasUsed}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  

                  <button
                    onClick={() =>
                      window.open(
                        `https://etherscan.io/tx/${(selectedProjectData as any).blockchainData?.transactionHash || ""}`,
                        "_blank",
                      )
                    }
                    disabled={!(selectedProjectData as any).blockchainData?.transactionHash}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaExternalLinkAlt className="w-4 h-4" />
                    <span>View on Etherscan</span>
                  </button>

                  

                  
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

      {showCreditModal && selectedProjectData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  <FaCoins className="w-5 h-5 mr-2" />
                  Issue Carbon Credits to Ethereum
                </h2>
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="text-white hover:text-gray-200 p-1 rounded"
                  disabled={issuingCredits}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-2">NCCR Admin Panel - Blockchain Registry Management</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{selectedProjectData.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Project ID</p>
                    <p className="font-mono text-gray-800">{selectedProjectData.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="text-gray-800">{selectedProjectData.location}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900">Ethereum Network Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-blue-700">Connected</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Wallet Address</p>
                    <p className="font-mono text-blue-800">{walletAddress.slice(0, 20)}...</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Estimated Gas Fee</p>
                    <p className="font-mono text-blue-800">{gasEstimate} ETH</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-medium text-emerald-900 mb-3">Credit Calculation</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-emerald-600 font-medium">Total Estimated</p>
                    <p className="text-emerald-800 font-bold text-lg">
                      {selectedProjectData.estimatedCarbon.toLocaleString()} tCO₂e
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-600 font-medium">Already Issued</p>
                    <p className="text-emerald-800 font-bold text-lg">
                      {((selectedProjectData as any).issuedCredits || 0).toLocaleString()} tCO₂e
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-600 font-medium">Available</p>
                    <p className="text-emerald-800 font-bold text-lg">
                      {(
                        selectedProjectData.estimatedCarbon - ((selectedProjectData as any).issuedCredits || 0)
                      ).toLocaleString()}{" "}
                      tCO₂e
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits to Issue (tCO₂e) *</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number.parseFloat(e.target.value) || 0)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter credit amount"
                  min="0"
                  max={selectedProjectData.estimatedCarbon - ((selectedProjectData as any).issuedCredits || 0)}
                  disabled={issuingCredits}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum available:{" "}
                  {(
                    selectedProjectData.estimatedCarbon - ((selectedProjectData as any).issuedCredits || 0)
                  ).toLocaleString()}{" "}
                  tCO₂e
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-start space-x-2">
                  <FaShieldAlt className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-indigo-800">
                    <p className="font-medium mb-2">Blockchain Issuance Process</p>
                    <ul className="text-xs space-y-1 text-indigo-700">
                      <li>• Smart contract validation of project data</li>
                      <li>• ERC-721 token minting on Ethereum mainnet</li>
                      <li>• IPFS metadata storage with verification hashes</li>
                      <li>• Registry update with immutable transaction record</li>
                      <li>• Automatic compliance with international standards</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleIssueCredits}
                  disabled={issuingCredits || creditAmount <= 0 || blockchainStatus !== "connected"}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {issuingCredits ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing on Blockchain...
                    </>
                  ) : (
                    <>
                      <FaCoins className="w-4 h-4 mr-2" />
                      Issue Credits to Ethereum
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCreditModal(false)}
                  disabled={issuingCredits}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-lg rounded-none">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add New Project</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                    <select
                      value={newProject.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mangrove">Mangrove</option>
                      <option value="Seagrass">Seagrass</option>
                      <option value="Saltmarsh">Saltmarsh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project location"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares) *</label>
                    <input
                      type="number"
                      value={newProject.area}
                      onChange={(e) => handleInputChange("area", Number.parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Carbon (tCO₂e)</label>
                    <input
                      type="number"
                      value={newProject.estimatedCarbon}
                      onChange={(e) => handleInputChange("estimatedCarbon", Number.parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaImages className="w-5 h-5 text-blue-600 mr-2" />
                  Project Photos
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                      <FaImages className="w-12 h-12 text-gray-400" />
                      <div>
                        <span className="text-blue-600 font-medium">Click to upload photos</span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                    </label>
                  </div>
                </div>

                {/* Photo Previews */}
                {photoPreviewUrls.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Selected Photos ({photoPreviewUrls.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {photoPreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove photo"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {selectedPhotos[index]?.name.substring(0, 10)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Notes</label>
                <textarea
                  value={newProject.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description and notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmitProject}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                >
                  <FaSave className="w-4 h-4 mr-2" />
                  Create Project
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
