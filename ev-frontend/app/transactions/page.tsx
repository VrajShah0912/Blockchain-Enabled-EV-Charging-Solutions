"use client"

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Search, Zap, CreditCard, ArrowUpDown, Circle, Waves, HardDrive, Cpu, Link2, Link2Off } from "lucide-react"
import { ethers } from 'ethers'
import { useRouter, useSearchParams } from 'next/navigation'

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (eventName: string, callback: (...args: any[]) => void) => void
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void
  selectedAddress: string | null
  isMetaMask?: boolean
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

interface Transaction {
  id: string
  timestamp: string
  hash: string
  type: 'charging' | 'token'
  stationId?: string
  stationName?: string
  amount: number
  energy?: number
  duration?: number // Added duration field
  status: 'pending' | 'confirmed' | 'failed'
  tokenAmount?: number
}

interface BlockchainStats {
  totalSpent: number
  energyConsumed: number
  tokensEarned: number
  avgCostPerKwh: number
}

interface UserData {
  id: string
  name: string
  tokenBalance: number
}

const BlockchainVisualization = () => {
  const [blocks, setBlocks] = useState<Array<{id: string, status: 'pending' | 'confirmed'}>>([])
  const [isMining, setIsMining] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks(prev => {
        const newBlocks = [...prev]
        if (newBlocks.length > 5) {
          newBlocks.shift()
        }
        
        if (Math.random() > 0.7) {
          newBlocks.push({id: `block-${Date.now()}`, status: 'pending'})
          setIsMining(true)
          
          setTimeout(() => {
            setBlocks(prev => prev.map(b => 
              b.id === newBlocks[newBlocks.length - 1].id 
                ? {...b, status: 'confirmed'} 
                : b
            ))
            setIsMining(false)
          }, 3000)
        } else {
          newBlocks.push({id: `block-${Date.now()}`, status: 'confirmed'})
        }
        
        return newBlocks
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex items-center gap-1 p-2 bg-muted rounded-lg">
      <div className="flex items-center gap-1">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative">
            <div className={`w-3 h-3 rounded-full ${
              block.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
            }`} />
            {index < blocks.length - 1 && (
              <div className="absolute top-1/2 left-3 w-2 h-[2px] bg-gray-400" />
            )}
          </div>
        ))}
      </div>
      <span className="text-xs ml-2">
        {isMining ? 'Mining...' : 'Chain synced'}
      </span>
    </div>
  )
}

const NetworkStatusIndicator = ({ connected }: { connected: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <>
          <div className="relative">
            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
          </div>
          <span className="text-xs">Connected to Ethereum</span>
        </>
      ) : (
        <>
          <Circle className="h-2 w-2 fill-yellow-500 text-yellow-500" />
          <span className="text-xs"></span>
        </>
      )}
    </div>
  )
}

const TransactionStream = () => {
  const [transactions, setTransactions] = useState<string[]>([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTx = `0x${Array(8).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`
        const updated = [...prev, newTx]
        if (updated.length > 4) updated.shift()
        return updated
      })
    }, 1500)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex items-center gap-2">
      <Waves className="h-4 w-4 text-blue-500" />
      <div className="flex gap-1">
        {transactions.map((tx, i) => (
          <span key={i} className="text-xs font-mono bg-muted px-1 rounded">
            {tx}
          </span>
        ))}
      </div>
    </div>
  )
}

const generateMockTransactions = (userId: string, initialTokens: number = 100): Transaction[] => {
  const transactions: Transaction[] = []
  const now = new Date()
  const statuses = ['confirmed', 'pending', 'failed']
  const stationNames = [
    'Koregaon Park EV Hub',
    'Aundh Tata Power Station',
    'Viman Nagar ElectroCharge',
    'Kothrud GreenPower Station',
    'Hinjewadi TechPark Charger',
    'Shivajinagar IOCL Station',
    'Hadapsar HP Power',
    'Baner BatteryZone',
    'Sinhagad Road VoltPoint',
    'Kalyani Nagar ChargeZone',
    'Wakad EcoCharge',
    'Warje PowerPlug',
    'Pashan SparkEV',
    'Kharadi BluSmart',
    'Kondhwa ZipCharge'
  ];
  
  // Add initial token reward
  transactions.push({
    id: `tx-init-${userId}`,
    timestamp: now.toISOString(),
    hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    type: 'token',
    amount: 0,
    status: 'confirmed',
    tokenAmount: initialTokens
  })
  
  // Generate random transactions
  for (let i = 0; i < 20; i++) {
    const type = Math.random() > 0.7 ? 'token' : 'charging'
    const randomDays = Math.floor(Math.random() * 60)
    const txDate = new Date(now)
    txDate.setDate(now.getDate() - randomDays)
    const duration = type === 'charging' ? Math.floor(Math.random() * 120) + 30 : undefined
    
    transactions.push({
      id: `tx-${i}-${Date.now()}`,
      timestamp: txDate.toISOString(),
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      type,
      stationId: type === 'charging' ? `station-${Math.floor(Math.random() * 100)}` : undefined,
      stationName: type === 'charging' ? stationNames[Math.floor(Math.random() * stationNames.length)] : undefined,
      amount: type === 'charging' ? parseFloat((Math.random() * 1500 + 500).toFixed(2)) : 0, // Increased amounts to be more realistic for INR
      energy: type === 'charging' ? parseFloat((Math.random() * 40 + 5).toFixed(1)) : undefined,
      duration: duration,
      status: statuses[Math.floor(Math.random() * statuses.length)] as 'pending' | 'confirmed' | 'failed',
      tokenAmount: type === 'token' ? Math.floor(Math.random() * 100 + 10) : undefined,
    })
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const TransactionsPageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<BlockchainStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [period, setPeriod] = useState('30days')
  const [activeTab, setActiveTab] = useState('all')
  const [isBlockchainConnected, setIsBlockchainConnected] = useState(false)
  const [activeTxHash, setActiveTxHash] = useState<string | null>(null)
  const activeTxRef = useRef<HTMLTableRowElement>(null)

  // Get booking details from URL params
  const newTxHash = searchParams.get('newTx')
  const reward = searchParams.get('reward')
  const amount = searchParams.get('amount')
  const energy = searchParams.get('energy')
  const duration = searchParams.get('duration')
  const station = searchParams.get('station')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('evUser')
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (e) {
          localStorage.removeItem('evUser')
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }
  }, [router])

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_accounts' })
          setIsBlockchainConnected(true)
        } catch {
          setIsBlockchainConnected(false)
        }
      }
    }
    
    checkConnection()
    
    if (window.ethereum) {
      const handleAccountsChanged = () => checkConnection()
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  useEffect(() => {
    if (activeTxHash && activeTxRef.current) {
      activeTxRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      const timer = setTimeout(() => setActiveTxHash(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [activeTxHash])

  useEffect(() => {
    if (newTxHash) {
      setActiveTxHash(newTxHash)
      // Scroll to the transaction after a short delay
      setTimeout(() => {
        if (activeTxRef.current) {
          activeTxRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 500)
    }
  }, [newTxHash])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        const initialTokens = user.tokenBalance || 100
        const txData = generateMockTransactions(user.id, initialTokens)
        const chargingTxs = txData.filter(tx => tx.type === 'charging')
        const tokenTxs = txData.filter(tx => tx.type === 'token')
        
        const totalSpent = chargingTxs.reduce((sum, tx) => sum + tx.amount, 0)
        const energyConsumed = chargingTxs.reduce((sum, tx) => sum + (tx.energy || 0), 0)
        const tokensEarned = tokenTxs.reduce((sum, tx) => sum + (tx.tokenAmount || 0), 0)
        
        setTransactions(txData)
        setStats({
          totalSpent,
          energyConsumed,
          tokensEarned,
          avgCostPerKwh: 150 // Fixed average cost at ₹150/kWh
        })
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    const unsubscribe = setInterval(() => {
      if (Math.random() > 0.7) {
        const types = ['charging', 'token'] as const
        const type = types[Math.floor(Math.random() * types.length)]
        const now = new Date()
        const duration = type === 'charging' ? Math.floor(Math.random() * 120) + 30 : undefined
        
        const newTx: Transaction = {
          id: `tx-live-${Date.now()}`,
          timestamp: now.toISOString(),
          hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          type,
          stationId: type === 'charging' ? `station-${Math.floor(Math.random() * 100)}` : undefined,
          stationName: type === 'charging' ? 'Live Charging Station' : undefined,
          amount: type === 'charging' ? parseFloat((Math.random() * 1500 + 500).toFixed(2)) : 0,
          energy: type === 'charging' ? parseFloat((Math.random() * 40 + 5).toFixed(1)) : undefined,
          duration: duration,
          status: 'pending',
          tokenAmount: type === 'token' ? Math.floor(Math.random() * 100 + 10) : undefined,
        }
        
        setTransactions(prev => {
          setActiveTxHash(newTx.hash)
          return [newTx, ...prev]
        })
        
        setTimeout(() => {
          const updatedTx = {...newTx, status: 'confirmed'}
          setTransactions(prev => {
            const existingIndex = prev.findIndex(tx => tx.id === updatedTx.id)
            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = updatedTx
              return updated
            }
            return prev
          })
          
          if (updatedTx.status === 'confirmed') {
            if (updatedTx.type === 'charging') {
              setStats(prev => prev ? {
                ...prev,
                totalSpent: prev.totalSpent + updatedTx.amount,
                energyConsumed: prev.energyConsumed + (updatedTx.energy || 0),
              } : null)
            } else if (updatedTx.type === 'token') {
              setStats(prev => prev ? {
                ...prev,
                tokensEarned: prev.tokensEarned + (updatedTx.tokenAmount || 0)
              } : null)
            }
          }
        }, 5000)
      }
    }, 30000)
    
    return () => clearInterval(unsubscribe)
  }, [isAuthenticated, user])

  const filteredTransactions = transactions.filter(tx => {
    if (searchTerm && 
        !tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !tx.stationName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    if (activeTab === 'charging' && tx.type !== 'charging') return false
    if (activeTab === 'tokens' && tx.type !== 'token') return false
    
    const txDate = new Date(tx.timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (period === '7days' && diffDays > 7) return false
    if (period === '30days' && diffDays > 30) return false
    if (period === '90days' && diffDays > 90) return false
    if (period === 'year' && diffDays > 365) return false
    
    return true
  })

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Confirmed</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">Pending</Badge>
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Please wait while we load your transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p>Connecting to blockchain network...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isBlockchainConnected ? (
              <Link2 className="h-5 w-5 text-green-500" />
            ) : (
              <Link2Off className="h-5 w-5 text-yellow-500" />
            )}
            <NetworkStatusIndicator connected={isBlockchainConnected} />
          </div>
          <BlockchainVisualization />
        </div>
        <TransactionStream />
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">View and manage your charging transactions and token rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalSpent?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Consumed</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.energyConsumed.toFixed(1) || '0.0'} kWh</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Earned</CardTitle>
            <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tokensEarned || '0'} EVT</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cost</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹150.00/kWh</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Activity</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-blue-500" />
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full animate-pulse" 
                style={{ width: `${Math.random() * 60 + 20}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {isBlockchainConnected 
              ? 'Processing transactions on Ethereum network' 
              : 'Simulating blockchain activity with mock data'}
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="charging">Charging</TabsTrigger>
            <TabsTrigger value="tokens">Token Rewards</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search transactions..." 
                className="w-full sm:w-[200px] pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Energy</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <TableRow 
                        key={tx.id} 
                        ref={tx.hash === activeTxHash ? activeTxRef : null}
                        className={tx.hash === activeTxHash ? 'bg-blue-50 animate-pulse' : ''}
                      >
                        <TableCell className="font-medium">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {formatHash(tx.hash)}
                        </TableCell>
                        <TableCell>
                          {tx.type === 'charging' ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                              Charging
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">
                              Token Reward
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{tx.stationName || '-'}</TableCell>
                        <TableCell className="text-right">
                          {tx.type === 'charging' 
                            ? `₹${tx.amount.toFixed(2)}`
                            : `+${tx.tokenAmount} EVT`}
                        </TableCell>
                        <TableCell className="text-right">
                          {tx.duration ? `${tx.duration} min` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {tx.energy ? `${tx.energy.toFixed(1)} kWh` : '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(tx.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charging">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Energy</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.filter(tx => tx.type === 'charging').length > 0 ? (
                    filteredTransactions
                      .filter(tx => tx.type === 'charging')
                      .map((tx) => (
                        <TableRow 
                          key={tx.id}
                          ref={tx.hash === activeTxHash ? activeTxRef : null}
                          className={tx.hash === activeTxHash ? 'bg-blue-50 animate-pulse' : ''}
                        >
                          <TableCell className="font-medium">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {formatHash(tx.hash)}
                          </TableCell>
                          <TableCell>{tx.stationName || '-'}</TableCell>
                          <TableCell className="text-right">
                            ₹{tx.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {tx.duration ? `${tx.duration} min` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {tx.energy ? `${tx.energy.toFixed(1)} kWh` : '-'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(tx.status)}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No charging transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.filter(tx => tx.type === 'token').length > 0 ? (
                    filteredTransactions
                      .filter(tx => tx.type === 'token')
                      .map((tx) => (
                        <TableRow 
                          key={tx.id}
                          ref={tx.hash === activeTxHash ? activeTxRef : null}
                          className={tx.hash === activeTxHash ? 'bg-blue-50 animate-pulse' : ''}
                        >
                          <TableCell className="font-medium">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {formatHash(tx.hash)}
                          </TableCell>
                          <TableCell className="text-right">
                            +{tx.tokenAmount} EVT
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(tx.status)}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No token transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Analytics</CardTitle>
          <CardDescription>Visualize your spending and energy consumption patterns</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center flex-col">
          {newTxHash && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg w-full">
              <h3 className="font-medium text-green-800">New Charging Session</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Station:</span>
                  <span className="ml-2 font-medium">{station}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-2 font-medium">{duration} minutes</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Energy:</span>
                  <span className="ml-2 font-medium">{energy} kWh</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="ml-2 font-medium">₹{amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tokens Earned:</span>
                  <span className="ml-2 font-medium">+{reward} EVT</span>
                </div>
              </div>
            </div>
          )}
          <p className="text-muted-foreground">Transaction analytics chart will appear here</p>
        </CardContent>
      </Card>
    </div>
  )
}

const TransactionsPage = dynamic(
  () => Promise.resolve(TransactionsPageContent),
  { ssr: false }
)

export default TransactionsPage