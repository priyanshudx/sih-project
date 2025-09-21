"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"
import {
  FaPlus,
  FaCertificate,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaEye,
  FaExchangeAlt,
  FaBan,
  FaDownload,
  FaCalendarAlt,
  FaEthereum,
  FaWallet,
  FaLink,
  FaShieldAlt,
  FaSpinner,
  FaExternalLinkAlt,
  FaHistory,
  FaGasPump,
  FaFilter,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa"

const Credits: React.FC = () => {
  const { credits } = useApp()

  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [gasPrice, setGasPrice] = useState("0")
  const [contractAddress] = useState("0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C")
  const [isLoading, setIsLoading] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)

  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  // Removed retire credits feature
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedCredit, setSelectedCredit] = useState<any>(null)

  const [issueForm, setIssueForm] = useState({
    projectId: "",
    amount: "",
    verificationReport: "",
  })
  const [transferForm, setTransferForm] = useState({
    creditId: "",
    recipientAddress: "",
    amount: "",
  })
  // Removed retire credits feature

  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    project: "all",
  })
  const [searchTerm, setSearchTerm] = useState("")

  const [blockchainTransactions, setBlockchainTransactions] = useState([
    {
      id: "tx_001",
      hash: "0x1234567890abcdef1234567890abcdef12345678",
      type: "Issue Credits",
      amount: 1500,
      creditId: "BC-001",
      timestamp: "2024-01-15T10:30:00Z",
      status: "Confirmed",
      gasUsed: "45,231",
      blockNumber: 18945672,
    },
    {
      id: "tx_002",
      hash: "0xabcdef1234567890abcdef1234567890abcdef12",
      type: "Retire Credits",
      amount: 500,
      creditId: "BC-002",
      timestamp: "2024-01-14T15:45:00Z",
      status: "Confirmed",
      gasUsed: "32,156",
      blockNumber: 18943821,
    },
  ])

  useEffect(() => {
    // Check if previously connected
    const wasConnected = localStorage.getItem("walletConnected")
    if (wasConnected === "true") {
      handleConnectWallet()
    }
  }, [])

  const totalIssued = credits.reduce((sum, credit) => sum + credit.amount, 0)
  const totalRetired = credits
    .filter((credit) => credit.status === "Retired")
    .reduce((sum, credit) => sum + credit.amount, 0)
  const availableCredits = totalIssued - totalRetired

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case "Issued":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Retired":
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getNetworkName = (id: number | null) => {
    switch (id) {
      case 1:
        return "Ethereum Mainnet"
      case 11155111:
        return "Sepolia Testnet"
      case 137:
        return "Polygon"
      default:
        return "Unknown Network"
    }
  }

  const handleConnectWallet = async () => {
    setIsLoading(true)
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsConnected(true)
      setWalletAddress("0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C")
      setNetworkId(1)
      setGasPrice("25")
      localStorage.setItem("walletConnected", "true")
      setShowConnectModal(false)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setNetworkId(null)
    setGasPrice("0")
    localStorage.removeItem("walletConnected")
  }

  const handleIssueCredits = async () => {
    if (!issueForm.projectId || !issueForm.amount) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newTransaction = {
        id: `tx_${Date.now()}`,
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        type: "Issue Credits",
        amount: Number.parseInt(issueForm.amount),
        creditId: `BC-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString(),
        status: "Confirmed",
        gasUsed: "47,892",
        blockNumber: 18950000 + Math.floor(Math.random() * 1000),
      }

      setBlockchainTransactions((prev) => [newTransaction, ...prev])
      setIssueForm({ projectId: "", amount: "", verificationReport: "" })
      setShowIssueModal(false)
    } catch (error) {
      console.error("Failed to issue credits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransferCredits = async () => {
    if (!transferForm.creditId || !transferForm.recipientAddress || !transferForm.amount) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const newTransaction = {
        id: `tx_${Date.now()}`,
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        type: "Transfer Credits",
        amount: Number.parseInt(transferForm.amount),
        creditId: transferForm.creditId,
        timestamp: new Date().toISOString(),
        status: "Confirmed",
        gasUsed: "35,421",
        blockNumber: 18950000 + Math.floor(Math.random() * 1000),
      }

      setBlockchainTransactions((prev) => [newTransaction, ...prev])
      setTransferForm({ creditId: "", recipientAddress: "", amount: "" })
      setShowTransferModal(false)
    } catch (error) {
      console.error("Failed to transfer credits:", error)
    } finally {
      setIsLoading(false)
    }
  }


  const filteredCredits = credits.filter((credit) => {
    const matchesSearch =
      credit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filters.status === "all" || credit.status === filters.status
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">NCCR Carbon Credits Registry</h1>
          <p className="mt-2 text-muted-foreground">Blockchain-verified blue carbon credit management system</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-card border border-border rounded-lg p-3 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">BLOCKCHAIN STATUS</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <div className="flex items-center gap-2">
              <FaEthereum className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{isConnected ? getNetworkName(networkId) : "Not Connected"}</span>
            </div>
            {isConnected && <div className="mt-1 text-xs text-muted-foreground">Gas: {gasPrice} gwei</div>}
          </div>

          {isConnected ? (
            <div className="bg-card border border-border rounded-lg p-3 min-w-[250px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">ADMIN WALLET</span>
                <button onClick={handleDisconnectWallet} className="text-xs text-red-600 hover:text-red-700">
                  Disconnect
                </button>
              </div>
              <div className="text-sm font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Contract: {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConnectModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaWallet className="w-4 h-4 mr-2" />
              Connect to Blockchain
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search credits or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="inline-flex items-center px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <FaFilter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <FaDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCertificate className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Credits Issued</dt>
                <dd className="text-3xl font-bold text-foreground">
                  {totalIssued.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">tCO₂e</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaBan className="h-8 w-8 text-gray-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Credits Retired</dt>
                <dd className="text-3xl font-bold text-foreground">
                  {totalRetired.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">tCO₂e</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-8 w-8 text-accent" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Available Credits</dt>
                <dd className="text-3xl font-bold text-foreground">
                  {availableCredits.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">tCO₂e</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaEthereum className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">Blockchain Transactions</dt>
                <dd className="text-3xl font-bold text-foreground">
                  {blockchainTransactions.length}
                  <span className="text-sm font-normal text-muted-foreground ml-1">total</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaHistory className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Recent Blockchain Transactions</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaGasPump className="w-4 h-4" />
            <span>Current Gas: {gasPrice} gwei</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Credit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Gas Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {blockchainTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaEthereum className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-mono text-foreground">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === "Issue Credits" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {tx.amount.toLocaleString()} tCO₂e
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{tx.creditId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    #{tx.blockNumber.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{tx.gasUsed}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaCheckCircle className="w-3 h-3 mr-1" />
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary hover:text-primary/80 mr-3" title="View on Etherscan">
                      <FaExternalLinkAlt className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Smart Contract Info</h3>
            <FaLink className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contract Address</label>
              <div className="mt-1 p-2 bg-muted rounded text-sm font-mono">{contractAddress}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Network</label>
              <div className="mt-1 p-2 bg-muted rounded text-sm">{getNetworkName(networkId)}</div>
            </div>
            <button
              onClick={() => window.open(`https://etherscan.io/address/${contractAddress}`, "_blank")}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <FaExternalLinkAlt className="w-4 h-4 mr-2" />
              View on Etherscan
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Credit Registry</h3>
            <span className="text-sm text-muted-foreground">
              {filteredCredits.length} of {credits.length} credits
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Credit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Associated Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date Issued
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Blockchain Hash
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredCredits.map((credit, index) => (
                <tr key={credit.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FaCertificate className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{credit.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{credit.projectName}</div>
                    <div className="text-sm text-muted-foreground">Project ID: {credit.projectId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{credit.amount.toLocaleString()} tCO₂e</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(credit.status)}>
                      {credit.status === "Issued" ? (
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <FaTimesCircle className="w-3 h-3 mr-1" />
                      )}
                      {credit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaCalendarAlt className="w-4 h-4 mr-1" />
                      {formatDate(credit.dateIssued)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaEthereum className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-mono text-muted-foreground">
                        {blockchainTransactions[index]?.hash.slice(0, 8)}...
                        {blockchainTransactions[index]?.hash.slice(-6)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {credit.status === "Issued" && (
                        <button
                          onClick={() => {
                            setSelectedCredit(credit)
                            setTransferForm({ ...transferForm, creditId: credit.id })
                            setShowTransferModal(true)
                          }}
                          className="text-accent hover:text-accent/80 p-1 rounded"
                          title="Transfer Credit"
                        >
                          <FaExchangeAlt className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedCredit(credit)}
                        className="text-primary hover:text-primary/80 p-1 rounded"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          window.open(`https://etherscan.io/tx/${blockchainTransactions[index]?.hash}`, "_blank")
                        }
                        className="text-blue-600 hover:text-blue-700 p-1 rounded"
                        title="View on Blockchain"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = `/certificates/${credit.id}.pdf`
                          link.download = `${credit.id}-certificate.pdf`
                          link.click()
                        }}
                        className="text-muted-foreground hover:text-foreground p-1 rounded"
                        title="Download Certificate"
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Connect to Blockchain</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FaEthereum className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Ethereum Mainnet</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect to Ethereum mainnet for production carbon credit transactions
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FaExclamationTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Ensure you have sufficient ETH for gas fees</span>
              </div>

              <button
                onClick={handleConnectWallet}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaWallet className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Issue New Credits</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-muted-foreground hover:text-foreground">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Project ID</label>
                <input
                  type="text"
                  value={issueForm.projectId}
                  onChange={(e) => setIssueForm({ ...issueForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Enter project ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount (tCO₂e)</label>
                <input
                  type="number"
                  value={issueForm.amount}
                  onChange={(e) => setIssueForm({ ...issueForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Verification Report</label>
                <input
                  type="text"
                  value={issueForm.verificationReport}
                  onChange={(e) => setIssueForm({ ...issueForm, verificationReport: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Report URL or hash"
                />
              </div>

              <button
                onClick={handleIssueCredits}
                disabled={isLoading || !issueForm.projectId || !issueForm.amount}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> : <FaPlus className="w-4 h-4 mr-2" />}
                {isLoading ? "Issuing..." : "Issue Credits"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Transfer Credits</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Credit ID</label>
                <input
                  type="text"
                  value={transferForm.creditId}
                  onChange={(e) => setTransferForm({ ...transferForm, creditId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Enter credit ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Recipient Address</label>
                <input
                  type="text"
                  value={transferForm.recipientAddress}
                  onChange={(e) => setTransferForm({ ...transferForm, recipientAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount (tCO₂e)</label>
                <input
                  type="number"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Enter amount"
                />
              </div>

              <button
                onClick={handleTransferCredits}
                disabled={isLoading || !transferForm.creditId || !transferForm.recipientAddress || !transferForm.amount}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaExchangeAlt className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Transferring..." : "Transfer Credits"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Filter Credits</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-muted-foreground hover:text-foreground">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="all">All Statuses</option>
                  <option value="Issued">Issued</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilters({ status: "all", dateRange: "all", project: "all" })
                    setShowFilterModal(false)
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {credits.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <FaCertificate className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No credits issued yet</h3>
          <p className="text-muted-foreground mb-6">Start by approving projects to generate carbon credits.</p>
          <button
            onClick={() => setShowIssueModal(true)}
            disabled={!isConnected}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Issue New Credits
          </button>
        </div>
      )}
    </div>
  )
}

export default Credits
