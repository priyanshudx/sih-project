"use client"

import React, { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { FaUser, FaBell, FaSave, FaUpload, FaCheck, FaSignOutAlt } from "react-icons/fa"

const Settings: React.FC = () => {
  const { logout, user, updateProfile } = useAuth()

  // ✅ Safely initialize state even if user is undefined
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  const [formData, setFormData] = useState({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    organization: user?.organization ?? "",
    role: user?.role ?? "",
  })

  // ✅ Wrap browser-only APIs in safe checks
  const copyToClipboard = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text)
        showNotification("API key copied to clipboard!")
      } catch {
        showNotification("Failed to copy API key", "error")
      }
    }
  }

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
      await new Promise((resolve) => setTimeout(resolve, 500))
      const success = await updateProfile({
        name: formData.fullName,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        profilePicture: profilePicture || undefined,
      })
      success ? showNotification("Profile updated successfully!") : showNotification("Failed to update profile", "error")
    } catch {
      showNotification("Failed to update profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) return showNotification("File size must be less than 1MB", "error")
    if (!file.type.match(/^image\/(jpeg|jpg|gif|png)$/)) return showNotification("Invalid image format", "error")

    const reader = new FileReader()
    reader.onload = (e) => {
      setProfilePicture(e.target?.result as string)
      showNotification("Photo uploaded successfully!")
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <FaCheck className="w-4 h-4 mr-2" />
          {toastMessage}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* User Profile */}
          <div className="bg-card rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center">
              <FaUser className="w-5 h-5 text-primary mr-2" />
              <h3 className="text-lg font-semibold">User Profile</h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-accent rounded-full overflow-hidden flex items-center justify-center">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="w-8 h-8 text-accent-foreground" />
                  )}
                </div>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 border border-input rounded-md text-sm font-medium bg-background hover:bg-muted"
                  >
                    <FaUpload className="w-4 h-4 mr-2" /> Upload Photo
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <p className="mt-2 text-xs text-muted-foreground">JPG, GIF, PNG. Max 1MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Full Name"
                  className="border border-input rounded-md px-3 py-2"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email"
                  className="border border-input rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  <FaSave className="inline w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          {/*
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-11 h-6 rounded-full ${emailNotifications ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transform transition-transform ${
                    emailNotifications ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          */}

          {/* Logout */}
          <div className="bg-card rounded-lg border border-border p-6 flex justify-between">
            <div>
              <h4 className="text-sm font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">You will be redirected to login</p>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <FaSignOutAlt className="inline w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
