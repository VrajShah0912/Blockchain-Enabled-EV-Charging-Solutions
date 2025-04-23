"use client"

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
  AlertCircle,
  CheckCircle2,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  Zap,
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
  },
]

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [complianceFilter, setComplianceFilter] = useState("all")

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your charging stations and monitor compliance</p>
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
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chargingStations.length}</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chargingStations.filter((s) => s.status === "operational").length}
            </div>
            <p className="text-xs text-muted-foreground">Stations ready for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chargingStations.filter((s) => s.status === "maintenance").length}
            </div>
            <p className="text-xs text-muted-foreground">Stations being serviced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chargingStations.filter((s) => s.compliance === "failed").length}</div>
            <p className="text-xs text-muted-foreground">Stations requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stations" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="stations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Charging Stations
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
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
                    <TableHead className="hidden md:table-cell">Compliance</TableHead>
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
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            station.compliance === "verified"
                              ? "outline"
                              : station.compliance === "pending"
                                ? "secondary"
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
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Compliance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Station
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

          <Card>
            <CardHeader>
              <CardTitle>Station Status Updates</CardTitle>
              <CardDescription>Update the status of your charging stations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {chargingStations.slice(0, 3).map((station) => (
                <div key={station.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{station.name}</h3>
                    <p className="text-sm text-muted-foreground">{station.location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`maintenance-${station.id}`}>Maintenance Mode</Label>
                      <Switch id={`maintenance-${station.id}`} checked={station.status === "maintenance"} />
                    </div>
                    <Select defaultValue={station.status}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Stations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Verification</CardTitle>
              <CardDescription>Verify and manage compliance for your charging stations</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Compliance management interface will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">User management interface will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

