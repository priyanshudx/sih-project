"use client"

import type React from "react"
import { useState } from "react"
import { FaStore, FaUsers, FaCoins, FaEye, FaDownload, FaSearch, FaTimes, FaCheck, FaBan } from "react-icons/fa"

interface Transaction {
  id: string
  sellerId: string
  sellerName: string
  sellerCompany: string
  sellerLocation: string // Added location field for Indian NGOs
  sellerRegistration: string // Added NGO registration number
  buyerId: string
  buyerCompany: string
  creditAmount: number
  pricePerCredit: number
  totalValue: number
  transactionDate: string
  status: "pending" | "completed" | "cancelled"
  projectType: string
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    sellerId: "NGO-001",
    sellerName: "Rajesh Kumar",
    sellerCompany: "Green Earth Foundation",
    sellerLocation: "Mumbai, Maharashtra",
    sellerRegistration: "NGO/2019/0012345",
    buyerId: "CMP-001",
    buyerCompany: "Microsoft Corp",
    creditAmount: 1500,
    pricePerCredit: 25.5,
    totalValue: 38250,
    transactionDate: "2024-01-15",
    status: "completed",
    projectType: "Mangrove Restoration",
  },
  {
    id: "TXN-002",
    sellerId: "NGO-002",
    sellerName: "Priya Sharma",
    sellerCompany: "Sustainable India Trust",
    sellerLocation: "Delhi, NCR",
    sellerRegistration: "NGO/2020/0023456",
    buyerId: "CMP-002",
    buyerCompany: "Apple Inc",
    creditAmount: 2000,
    pricePerCredit: 28.75,
    totalValue: 57500,
    transactionDate: "2024-01-14",
    status: "pending",
    projectType: "Seagrass Conservation",
  },
  {
    id: "TXN-003",
    sellerId: "NGO-003",
    sellerName: "Arjun Patel",
    sellerCompany: "Carbon Neutral India",
    sellerLocation: "Ahmedabad, Gujarat",
    sellerRegistration: "NGO/2018/0034567",
    buyerId: "CMP-003",
    buyerCompany: "Google LLC",
    creditAmount: 800,
    pricePerCredit: 32.0,
    totalValue: 25600,
    transactionDate: "2024-01-13",
    status: "completed",
    projectType: "Coastal Wetland Protection",
  },
  {
    id: "TXN-004",
    sellerId: "NGO-004",
    sellerName: "Meera Reddy",
    sellerCompany: "Wind Energy Alliance",
    sellerLocation: "Hyderabad, Telangana",
    sellerRegistration: "NGO/2021/0045678",
    buyerId: "CMP-004",
    buyerCompany: "Amazon",
    creditAmount: 1200,
    pricePerCredit: 26.25,
    totalValue: 31500,
    transactionDate: "2024-01-12",
    status: "completed",
    projectType: "Salt Marsh Restoration",
  },
  {
    id: "TXN-005",
    sellerId: "NGO-005",
    sellerName: "Vikram Singh",
    sellerCompany: "Ocean Conservation Society",
    sellerLocation: "Chennai, Tamil Nadu",
    sellerRegistration: "NGO/2019/0056789",
    buyerId: "CMP-005",
    buyerCompany: "Tesla Inc",
    creditAmount: 950,
    pricePerCredit: 30.0,
    totalValue: 28500,
    transactionDate: "2024-01-11",
    status: "cancelled",
    projectType: "Marine Protected Areas",
  },
]

const Marketplace: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Calculate summary statistics
  const totalTransactions = transactions.length
  const completedTransactions = transactions.filter((t) => t.status === "completed")
  const totalValue = completedTransactions.reduce((sum, t) => sum + t.totalValue, 0)
  const totalCredits = completedTransactions.reduce((sum, t) => sum + t.creditAmount, 0)
  const uniqueSellers = new Set(transactions.map((t) => t.sellerId)).size

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesProjectType = projectTypeFilter === "all" || transaction.projectType === projectTypeFilter

    return matchesSearch && matchesStatus && matchesProjectType
  })

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case "completed":
        return `${baseClasses} bg-accent/10 text-accent`
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`
      case "cancelled":
        return `${baseClasses} bg-destructive/10 text-destructive`
      default:
        return `${baseClasses} bg-muted text-muted-foreground`
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowModal(true)
  }

  const handleApproveTransaction = (transactionId: string) => {
    setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, status: "completed" as const } : t)))
    setShowModal(false)
  }

  const handleRejectTransaction = (transactionId: string) => {
    setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, status: "cancelled" as const } : t)))
    setShowModal(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTransaction(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blue Carbon Credits Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Monitor blue carbon transactions between Indian NGOs and companies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FaStore className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active NGOs</p>
              <p className="text-2xl font-bold text-foreground">{uniqueSellers}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blue Credits Traded</p>
              <p className="text-2xl font-bold text-foreground">{totalCredits.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FaCoins className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search by seller, buyer, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Project Type Filter */}
          <select
            value={projectTypeFilter}
            onChange={(e) => setProjectTypeFilter(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Ecosystem Types</option>
            <option value="Mangrove Restoration">Mangrove Restoration</option>
            <option value="Seagrass Conservation">Seagrass Conservation</option>
            <option value="Coastal Wetland Protection">Coastal Wetland Protection</option>
            <option value="Salt Marsh Restoration">Salt Marsh Restoration</option>
            <option value="Marine Protected Areas">Marine Protected Areas</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Blue Carbon Transactions</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {totalTransactions} transactions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  NGO Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Blue Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-foreground">{transaction.id}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(transaction.transactionDate)}</div>
                      <div className="text-xs text-muted-foreground">{transaction.projectType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-foreground">{transaction.sellerName}</div>
                      <div className="text-sm text-muted-foreground">{transaction.sellerCompany}</div>
                      <div className="text-xs text-muted-foreground">{transaction.sellerLocation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{transaction.buyerCompany}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {transaction.creditAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {formatCurrency(transaction.pricePerCredit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{formatCurrency(transaction.totalValue)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-primary hover:text-primary/80 transition-colors p-1 rounded"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      {transaction.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveTransaction(transaction.id)}
                            className="text-accent hover:text-accent/80 transition-colors p-1 rounded"
                            title="Approve Transaction"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectTransaction(transaction.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded"
                            title="Reject Transaction"
                          >
                            <FaBan className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FaStore className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Blue Carbon Transaction Details</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <p className="text-foreground font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-foreground">{formatDate(selectedTransaction.transactionDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Blue Carbon Ecosystem</label>
                  <p className="text-foreground">{selectedTransaction.projectType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <span className={getStatusBadge(selectedTransaction.status)}>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-3">NGO Seller Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <p className="text-foreground">{selectedTransaction.sellerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">NGO Name</label>
                    <p className="text-foreground">{selectedTransaction.sellerCompany}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-foreground">{selectedTransaction.sellerLocation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                    <p className="text-foreground font-mono">{selectedTransaction.sellerRegistration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">NGO ID</label>
                    <p className="text-foreground font-mono">{selectedTransaction.sellerId}</p>
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-3">Buyer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="text-foreground">{selectedTransaction.buyerCompany}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Buyer ID</label>
                    <p className="text-foreground font-mono">{selectedTransaction.buyerId}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-3">Blue Carbon Transaction Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blue Credit Amount</label>
                    <p className="text-foreground text-lg font-semibold">
                      {selectedTransaction.creditAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Price per Credit</label>
                    <p className="text-foreground text-lg font-semibold">
                      {formatCurrency(selectedTransaction.pricePerCredit)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Value</label>
                    <p className="text-foreground text-lg font-semibold text-accent">
                      {formatCurrency(selectedTransaction.totalValue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pending Transactions */}
              {selectedTransaction.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleApproveTransaction(selectedTransaction.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    <FaCheck className="w-4 h-4" />
                    Approve Transaction
                  </button>
                  <button
                    onClick={() => handleRejectTransaction(selectedTransaction.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    <FaBan className="w-4 h-4" />
                    Reject Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Marketplace
