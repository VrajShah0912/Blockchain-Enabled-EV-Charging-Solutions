"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckCircle2,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Zap,
  Wallet,
  DollarSign,
  Activity,
} from "lucide-react"

// Mock data for charging stations
const chargingStations = [
  {
    id: "CS001",
    name: "Downtown EV Hub",
    location: "123 Main St, Downtown",
    status: "operational",
    ports: 8,
    portsAvailable: 3,
    lastUpdated: "2023-06-15T10:30:00",
    compliance: "verified",
    maintenanceScheduled: false,
    revenue: 12580,
    energyDelivered: 3450,
    sessions: 245,
    paymentMethods: ["Credit Card", "EVT Token", "Mobile Pay"],
    portTypes: [
      { type: "CCS", power: "150 kW", count: 4, operational: 4 },
      { type: "CHAdeMO", power: "50 kW", count: 2, operational: 1 },
      { type: "Type 2", power: "22 kW", count: 2, operational: 2 },
    ],
  },
  {
    id: "CS002",
    name: "Westside Charging Center",
    location: "456 West Ave, Westside",
    status: "maintenance",
    ports: 6,
    portsAvailable: 0,
    lastUpdated: "2023-06-14T16:45:00",
    compliance: "pending",
    maintenanceScheduled: true,
    revenue: 8750,
    energyDelivered: 2100,
    sessions: 178,
    paymentMethods: ["Credit Card", "EVT Token"],
    portTypes: [
      { type: "CCS", power: "350 kW", count: 2, operational: 0 },
      { type: "Type 2", power: "22 kW", count: 4, operational: 0 },
    ],
  },
  {
    id: "CS003",
    name: "Northgate Power Station",
    location: "789 North Blvd, Northgate",
    status: "operational",
    ports: 12,
    portsAvailable: 5,
    lastUpdated: "2023-06-15T09:15:00",
    compliance: "verified",
    maintenanceScheduled: false,
    revenue: 18900,
    energyDelivered: 5200,
    sessions: 320,
    paymentMethods: ["Credit Card", "EVT Token", "Mobile Pay"],
    portTypes: [
      { type: "CCS", power: "150 kW", count: 6, operational: 5 },
      { type: "CHAdeMO", power: "50 kW", count: 2, operational: 2 },
      { type: "Type 2", power: "22 kW", count: 4, operational: 3 },
    ],
  },
  {
    id: "CS004",
    name: "Eastside Quick Charge",
    location: "321 East St, Eastside",
    status: "operational",
    ports: 4,
    portsAvailable: 1,
    lastUpdated: "2023-06-15T11:20:00",
    compliance: "verified",
    maintenanceScheduled: false,
    revenue: 6450,
    energyDelivered: 1800,
    sessions: 120,
    paymentMethods: ["Credit Card", "EVT Token"],
    portTypes: [
      { type: "CCS", power: "50 kW", count: 2, operational: 1 },
      { type: "Type 2", power: "22 kW", count: 2, operational: 2 },
    ],
  },
  {
    id: "CS005",
    name: "Southpark EV Station",
    location: "654 South Ave, Southpark",
    status: "offline",
    ports: 10,
    portsAvailable: 0,
    lastUpdated: "2023-06-13T14:10:00",
    compliance: "failed",
    maintenanceScheduled: true,
    revenue: 10200,
    energyDelivered: 2800,
    sessions: 195,
    paymentMethods: ["Credit Card", "EVT Token", "Mobile Pay"],
    portTypes: [
      { type: "CCS", power: "150 kW", count: 4, operational: 0 },
      { type: "CHAdeMO", power: "50 kW", count: 2, operational: 0 },
      { type: "Type 2", power: "22 kW", count: 4, operational: 0 },
    ],
  },
]

// Mock data for maintenance schedules
const maintenanceSchedules = [
  {
    id: "MS001",
    stationId: "CS002",
    stationName: "Westside Charging Center",
    scheduledDate: "2023-07-10",
    status: "scheduled",
    type: "routine",
    description: "Quarterly maintenance check",
    technician: "John Smith",
    estimatedDuration: 4,
  },
  {
    id: "MS002",
    stationId: "CS005",
    stationName: "Southpark EV Station",
    scheduledDate: "2023-07-08",
    status: "scheduled",
    type: "repair",
    description: "Replace faulty CCS connectors and power modules",
    technician: "Maria Rodriguez",
    estimatedDuration: 8,
  },
  {
    id: "MS003",
    stationId: "CS001",
    stationName: "Downtown EV Hub",
    scheduledDate: "2023-08-15",
    status: "scheduled",
    type: "upgrade",
    description: "Firmware update and power module upgrade",
    technician: "David Chen",
    estimatedDuration: 6,
  },
]

// Mock data for payment methods
const paymentMethods = [
  { id: "PM001", name: "Credit Card", enabled: true, fee: "2.5%", processingTime: "Instant" },
  { id: "PM002", name: "EVT Token", enabled: true, fee: "1.0%", processingTime: "< 1 minute" },
  { id: "PM003", name: "Mobile Pay", enabled: true, fee: "1.8%", processingTime: "Instant" },
  { id: "PM004", name: "RFID Card", enabled: false, fee: "0.5%", processingTime: "Instant" },
  { id: "PM005", name: "QR Code", enabled: false, fee: "1.2%", processingTime: "< 1 minute" },
]

export default function StationOwnerDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [complianceFilter, setComplianceFilter] = useState("all")
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [editingPorts, setEditingPorts] = useState(false)

  // Filter stations based on search term and filters
  const filteredStations = chargingStations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || station.status === statusFilter
    const matchesCompliance = complianceFilter === "all" || station.compliance === complianceFilter

    return matchesSearch && matchesStatus && matchesCompliance
  })

  // Calculate total stats
  const totalRevenue = chargingStations.reduce((sum, station) => sum + station.revenue, 0)
  const totalEnergy = chargingStations.reduce((sum, station) => sum + station.energyDelivered, 0)
  const totalSessions = chargingStations.reduce((sum, station) => sum + station.sessions, 0)
  const operationalStations = chargingStations.filter((s) => s.status === "operational").length

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Station Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your EV charging stations</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Station
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Charging Station</DialogTitle>
                <DialogDescription>Enter the details for the new charging station.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="station-name" className="text-right">
                    Name
                  </Label>
                  <Input id="station-name" placeholder="Station name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="station-location" className="text-right">
                    Location
                  </Label>
                  <Input id="station-location" placeholder="Address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="station-ports" className="text-right">
                    Ports
                  </Label>
                  <Input id="station-ports" type="number" placeholder="Number of ports" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="station-status" className="text-right">
                    Status
                  </Label>
                  <Select defaultValue="operational">
                    <SelectTrigger id="station-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Station</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all stations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Delivered</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnergy.toLocaleString()} kWh</div>
            <p className="text-xs text-muted-foreground">Total energy provided</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charging Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total completed sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational Stations</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operationalStations}/{chargingStations.length}
            </div>
            <p className="text-xs text-muted-foreground">Stations ready for use</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stations" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="stations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Stations
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>Charging Station Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search stations..."
                      className="w-full sm:w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Filter by compliance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Compliance</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Ports</TableHead>
                    <TableHead className="hidden md:table-cell">Revenue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell className="font-medium">{station.id}</TableCell>
                      <TableCell>{station.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{station.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            station.status === "operational"
                              ? "success"
                              : station.status === "maintenance"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {station.status === "operational"
                            ? "Operational"
                            : station.status === "maintenance"
                              ? "Maintenance"
                              : "Offline"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {station.portsAvailable} / {station.ports} available
                      </TableCell>
                      <TableCell className="hidden md:table-cell">${station.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedStation(station)}>
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Station Performance</CardTitle>
              <CardDescription>Revenue and usage statistics for your stations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Performance chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>Upcoming and past maintenance for your stations</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Maintenance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Schedule Maintenance</DialogTitle>
                      <DialogDescription>Plan maintenance for one of your charging stations.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-station">Station</Label>
                        <Select>
                          <SelectTrigger id="maintenance-station">
                            <SelectValue placeholder="Select station" />
                          </SelectTrigger>
                          <SelectContent>
                            {chargingStations.map((station) => (
                              <SelectItem key={station.id} value={station.id}>
                                {station.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maintenance-date">Date</Label>
                          <Input id="maintenance-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maintenance-duration">Duration (hours)</Label>
                          <Input id="maintenance-duration" type="number" min="1" max="24" defaultValue="4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maintenance-type">Maintenance Type</Label>
                        <Select>
                          <SelectTrigger id="maintenance-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine Maintenance</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="upgrade">Upgrade</SelectItem>
                            <SelectItem value="inspection">Inspection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maintenance-description">Description</Label>
                        <Input id="maintenance-description" placeholder="Describe the maintenance work" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maintenance-technician">Technician</Label>
                        <Input id="maintenance-technician" placeholder="Technician name" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Schedule</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceSchedules.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell className="font-medium">{maintenance.id}</TableCell>
                      <TableCell>{maintenance.stationName}</TableCell>
                      <TableCell>{maintenance.scheduledDate}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">{maintenance.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{maintenance.estimatedDuration} hours</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {maintenance.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel Maintenance
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Configure payment options for your charging stations</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>Configure a new payment method for your stations.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-name">Payment Method Name</Label>
                        <Input id="payment-name" placeholder="e.g., Apple Pay" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-fee">Transaction Fee (%)</Label>
                          <Input id="payment-fee" type="number" step="0.1" min="0" max="10" defaultValue="1.5" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payment-time">Processing Time</Label>
                          <Input id="payment-time" placeholder="e.g., Instant" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="payment-enabled" defaultChecked />
                        <Label htmlFor="payment-enabled">Enable immediately</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Payment Method</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead className="hidden md:table-cell">Processing Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.id}</TableCell>
                      <TableCell>{method.name}</TableCell>
                      <TableCell>{method.fee}</TableCell>
                      <TableCell className="hidden md:table-cell">{method.processingTime}</TableCell>
                      <TableCell>
                        <Badge variant={method.enabled ? "success" : "secondary"}>
                          {method.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Switch checked={method.enabled} />
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>Payment method usage and transaction volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Transaction analytics chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Verification</CardTitle>
              <CardDescription>Verify and manage compliance for your charging stations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Station</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Last Verified</TableHead>
                    <TableHead className="hidden md:table-cell">Standards</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chargingStations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell className="font-medium">{station.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            station.compliance === "verified"
                              ? "success"
                              : station.compliance === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {station.compliance === "verified"
                            ? "Verified"
                            : station.compliance === "pending"
                              ? "Pending"
                              : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(station.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">ISO 15118, IEC 61851</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Station Management Dialog */}
      {selectedStation && (
        <Dialog open={!!selectedStation} onOpenChange={(open) => !open && setSelectedStation(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Manage Station: {selectedStation.name}</DialogTitle>
              <DialogDescription>
                {selectedStation.location} • ID: {selectedStation.id}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Station Details</TabsTrigger>
                <TabsTrigger value="ports">Charging Ports</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="station-name">Station Name</Label>
                    <Input id="station-name" defaultValue={selectedStation.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="station-location">Location</Label>
                    <Input id="station-location" defaultValue={selectedStation.location} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="station-status">Status</Label>
                  <Select defaultValue={selectedStation.status}>
                    <SelectTrigger id="station-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Methods</Label>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payment-${method.id}`}
                          checked={selectedStation.paymentMethods.includes(method.name)}
                        />
                        <Label htmlFor={`payment-${method.id}`} className="text-sm">
                          {method.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maintenance Schedule</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance-scheduled" checked={selectedStation.maintenanceScheduled} />
                    <Label htmlFor="maintenance-scheduled">Maintenance scheduled</Label>
                  </div>
                  {selectedStation.maintenanceScheduled && (
                    <div className="pl-6 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maintenance-date">Date</Label>
                          <Input id="maintenance-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maintenance-duration">Duration (hours)</Label>
                          <Input id="maintenance-duration" type="number" min="1" max="24" defaultValue="4" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ports" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Charging Ports</h3>
                  <Button variant="outline" size="sm" onClick={() => setEditingPorts(!editingPorts)}>
                    {editingPorts ? "Done" : "Edit Ports"}
                  </Button>
                </div>

                <div className="space-y-4">
                  {selectedStation.portTypes.map((port, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">
                          {port.type} - {port.power}
                        </h4>
                        {editingPorts && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {editingPorts ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`port-count-${index}`}>Total Ports</Label>
                            <Input id={`port-count-${index}`} type="number" min="1" defaultValue={port.count} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`port-operational-${index}`}>Operational</Label>
                            <Input
                              id={`port-operational-${index}`}
                              type="number"
                              min="0"
                              max={port.count}
                              defaultValue={port.operational}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Ports</p>
                            <p>{port.count}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Operational</p>
                            <p>
                              {port.operational} / {port.count}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {editingPorts && (
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Port Type
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${selectedStation.revenue.toLocaleString()}</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">Energy</p>
                    <p className="text-2xl font-bold">{selectedStation.energyDelivered.toLocaleString()} kWh</p>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">Sessions</p>
                    <p className="text-2xl font-bold">{selectedStation.sessions.toLocaleString()}</p>
                  </div>
                </div>

                <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Station analytics chart will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedStation(null)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

