"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { FaUser, FaBell, FaSave, FaUpload, FaCheck, FaSignOutAlt } from "react-icons/fa"

const Settings: React.FC = () => {
  const { logout, user, updateProfile } = useAuth()
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    organization: user?.organization || "",
    role: user?.role || "",
  })

  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production API", key: "bc_live_1234567890abcdef", created: "2024-01-15" },
    { id: "2", name: "Development API", key: "bc_test_abcdef1234567890", created: "2024-02-01" },
  ])

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user profile in auth context
      const success = await updateProfile({
        name: formData.fullName,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        profilePicture: profilePicture || undefined,
      })

      if (success) {
        showNotification("Profile updated successfully!")
      } else {
        showNotification("Failed to update profile", "error")
      }
    } catch (error) {
      showNotification("Failed to update profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        showNotification("File size must be less than 1MB", "error")
        return
      }
      if (!file.type.match(/^image\/(jpeg|jpg|gif|png)$/)) {
        showNotification("Please upload a valid image file (JPG, GIF, or PNG)", "error")
        return
      }

      // Create a preview URL for the uploaded image
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePicture(result)
        showNotification("Photo uploaded successfully!")
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showNotification("API key copied to clipboard!")
    } catch (error) {
      showNotification("Failed to copy API key", "error")
    }
  }

  const generateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `bc_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split("T")[0],
    }
    setApiKeys((prev) => [...prev, newKey])
    showNotification("New API key generated successfully!")
  }

  const deleteApiKey = (id: string) => {
    if (window.confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      setApiKeys((prev) => prev.filter((key) => key.id !== id))
      showNotification("API key deleted successfully!")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="space-y-8">
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toastType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          <FaCheck className="w-4 h-4 mr-2" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-balance">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* User Profile */}
          <div className="bg-card rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center">
                <FaUser className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold text-foreground">User Profile</h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-8 h-8 text-accent-foreground" />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 border border-input rounded-md text-sm font-medium text-foreground bg-background hover:bg-muted cursor-pointer"
                  >
                    <FaUpload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/gif,image/png"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center">
                <FaBell className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important updates</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${emailNotifications ? "bg-primary" : "bg-muted"}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${emailNotifications ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Project Updates</h4>
                    <p className="text-sm text-muted-foreground">Get notified when project status changes</p>
                  </div>
                  <button
                    onClick={() => setProjectUpdates(!projectUpdates)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${projectUpdates ? "bg-primary" : "bg-muted"}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${projectUpdates ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-card rounded-lg border border-border">{/* API Keys content can go here */}</div>

          {/* Account Actions */}
          <div className="bg-card rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center">
                <FaSignOutAlt className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold text-foreground">Account Actions</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">Sign out of your account and return to the login page</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
