"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Zap,
  Package,
  Truck,
  Factory,
  Clipboard,
  FileCheck,
} from "lucide-react"

// Mock data for raw materials
const rawMaterials = [
  {
    id: "RM001",
    name: "Copper Wire",
    type: "Electrical",
    quantity: 2500,
    unit: "meters",
    supplier: "MetalWorks Inc.",
    lastDelivery: "2023-06-10",
    status: "in-stock",
    isoCompliant: true,
    certifications: ["ISO 9001", "RoHS"],
  },
  {
    id: "RM002",
    name: "Charging Connectors",
    type: "Component",
    quantity: 350,
    unit: "pieces",
    supplier: "ElectroComp Ltd.",
    lastDelivery: "2023-06-05",
    status: "low-stock",
    isoCompliant: true,
    certifications: ["ISO 9001", "CE"],
  },
  {
    id: "RM003",
    name: "Power Modules",
    type: "Component",
    quantity: 120,
    unit: "pieces",
    supplier: "PowerTech Systems",
    lastDelivery: "2023-06-12",
    status: "in-stock",
    isoCompliant: true,
    certifications: ["ISO 9001", "UL Listed"],
  },
  {
    id: "RM004",
    name: "Aluminum Casing",
    type: "Structural",
    quantity: 75,
    unit: "pieces",
    supplier: "MetalWorks Inc.",
    lastDelivery: "2023-05-28",
    status: "low-stock",
    isoCompliant: true,
    certifications: ["ISO 9001"],
  },
  {
    id: "RM005",
    name: "Control PCBs",
    type: "Electronic",
    quantity: 200,
    unit: "pieces",
    supplier: "CircuitPro Manufacturing",
    lastDelivery: "2023-06-08",
    status: "in-stock",
    isoCompliant: false,
    certifications: ["RoHS"],
  },
]

// Mock data for vendors
const vendors = [
  {
    id: "V001",
    name: "MetalWorks Inc.",
    type: "Raw Materials",
    contactPerson: "John Smith",
    email: "john@metalworks.com",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    status: "active",
    materials: ["Copper Wire", "Aluminum Casing"],
  },
  {
    id: "V002",
    name: "ElectroComp Ltd.",
    type: "Components",
    contactPerson: "Sarah Johnson",
    email: "sarah@electrocomp.com",
    phone: "+1 (555) 234-5678",
    rating: 4.5,
    status: "active",
    materials: ["Charging Connectors"],
  },
  {
    id: "V003",
    name: "PowerTech Systems",
    type: "Components",
    contactPerson: "Michael Chen",
    email: "michael@powertech.com",
    phone: "+1 (555) 345-6789",
    rating: 4.7,
    status: "active",
    materials: ["Power Modules"],
  },
  {
    id: "V004",
    name: "CircuitPro Manufacturing",
    type: "Electronics",
    contactPerson: "Lisa Wong",
    email: "lisa@circuitpro.com",
    phone: "+1 (555) 456-7890",
    rating: 4.2,
    status: "probation",
    materials: ["Control PCBs"],
  },
  {
    id: "V005",
    name: "GreenPlastics Co.",
    type: "Raw Materials",
    contactPerson: "David Miller",
    email: "david@greenplastics.com",
    phone: "+1 (555) 567-8901",
    rating: 4.0,
    status: "inactive",
    materials: ["Plastic Housings"],
  },
]

// Mock data for deliveries
const deliveries = [
  {
    id: "D001",
    vendor: "MetalWorks Inc.",
    material: "Copper Wire",
    quantity: 1000,
    unit: "meters",
    orderDate: "2023-06-01",
    estimatedDelivery: "2023-06-10",
    actualDelivery: "2023-06-10",
    status: "delivered",
    trackingNumber: "MW10056782",
  },
  {
    id: "D002",
    vendor: "ElectroComp Ltd.",
    material: "Charging Connectors",
    quantity: 150,
    unit: "pieces",
    orderDate: "2023-05-28",
    estimatedDelivery: "2023-06-05",
    actualDelivery: "2023-06-05",
    status: "delivered",
    trackingNumber: "EC20034567",
  },
  {
    id: "D003",
    vendor: "PowerTech Systems",
    material: "Power Modules",
    quantity: 50,
    unit: "pieces",
    orderDate: "2023-06-05",
    estimatedDelivery: "2023-06-12",
    actualDelivery: "2023-06-12",
    status: "delivered",
    trackingNumber: "PT30078901",
  },
  {
    id: "D004",
    vendor: "MetalWorks Inc.",
    material: "Aluminum Casing",
    quantity: 25,
    unit: "pieces",
    orderDate: "2023-06-10",
    estimatedDelivery: "2023-06-20",
    actualDelivery: null,
    status: "in-transit",
    trackingNumber: "MW10056783",
  },
  {
    id: "D005",
    vendor: "CircuitPro Manufacturing",
    material: "Control PCBs",
    quantity: 100,
    unit: "pieces",
    orderDate: "2023-06-15",
    estimatedDelivery: "2023-06-25",
    actualDelivery: null,
    status: "processing",
    trackingNumber: "CP50012345",
  },
]

// Mock data for products
const products = [
  {
    id: "P001",
    name: "EV Charger Pro 150kW",
    type: "DC Fast Charger",
    stockQuantity: 45,
    monthlyProduction: 30,
    certifications: ["ISO 15118", "IEC 61851", "UL Listed"],
    status: "active",
  },
  {
    id: "P002",
    name: "EV Charger Standard 50kW",
    type: "DC Charger",
    stockQuantity: 60,
    monthlyProduction: 40,
    certifications: ["ISO 15118", "IEC 61851", "UL Listed"],
    status: "active",
  },
  {
    id: "P003",
    name: "EV Charger Home 22kW",
    type: "AC Charger",
    stockQuantity: 120,
    monthlyProduction: 100,
    certifications: ["IEC 61851", "UL Listed"],
    status: "active",
  },
  {
    id: "P004",
    name: "EV Charger Ultra 350kW",
    type: "DC Ultra-Fast Charger",
    stockQuantity: 15,
    monthlyProduction: 10,
    certifications: ["ISO 15118", "IEC 61851", "UL Listed"],
    status: "active",
  },
  {
    id: "P005",
    name: "EV Charger Mini 7kW",
    type: "AC Charger",
    stockQuantity: 200,
    monthlyProduction: 150,
    certifications: ["IEC 61851", "UL Listed"],
    status: "active",
  },
]

export default function ManufacturerDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [materialStatusFilter, setMaterialStatusFilter] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState<any>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)

  // Filter materials based on search and filters
  const filteredMaterials = rawMaterials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = materialStatusFilter === "all" || material.status === materialStatusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate total stats
  const totalMaterials = rawMaterials.length
  const lowStockMaterials = rawMaterials.filter((m) => m.status === "low-stock").length
  const activeVendors = vendors.filter((v) => v.status === "active").length
  const pendingDeliveries = deliveries.filter((d) => d.status !== "delivered").length

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manufacturer Dashboard</h1>
            <p className="text-muted-foreground">Manage your EV charging station manufacturing</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Place New Material Order</DialogTitle>
                  <DialogDescription>Order raw materials from your vendors.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-vendor">Vendor</Label>
                    <Select>
                      <SelectTrigger id="order-vendor">
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order-material">Material</Label>
                    <Select>
                      <SelectTrigger id="order-material">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {rawMaterials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order-quantity">Quantity</Label>
                      <Input id="order-quantity" type="number" min="1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order-unit">Unit</Label>
                      <Input id="order-unit" defaultValue="pieces" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order-notes">Notes</Label>
                    <Input id="order-notes" placeholder="Additional order notes" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Place Order</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Raw Materials</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">{lowStockMaterials} low stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Factory className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVendors}</div>
            <p className="text-xs text-muted-foreground">Out of {vendors.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">Expected this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Active product lines</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="deliveries" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Deliveries
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>Raw Materials Inventory</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search materials..."
                      className="w-full sm:w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={materialStatusFilter} onValueChange={setMaterialStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
                    <TableHead>Material</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Supplier</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">ISO Compliant</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.id}</TableCell>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{material.supplier}</TableCell>
                      <TableCell>
                        {material.quantity} {material.unit}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            material.status === "in-stock"
                              ? "success"
                              : material.status === "low-stock"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {material.status === "in-stock"
                            ? "In Stock"
                            : material.status === "low-stock"
                              ? "Low Stock"
                              : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {material.isoCompliant ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
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
                              <FileCheck className="mr-2 h-4 w-4" />
                              View Certifications
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Order More
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
              <CardTitle>Material Usage Trends</CardTitle>
              <CardDescription>Monthly consumption of key materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Material usage chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vendor Management</CardTitle>
                  <CardDescription>Manage your material suppliers</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vendor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Vendor</DialogTitle>
                      <DialogDescription>Add a new material supplier to your network.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vendor-name">Vendor Name</Label>
                          <Input id="vendor-name" placeholder="Company name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor-type">Vendor Type</Label>
                          <Select>
                            <SelectTrigger id="vendor-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="raw-materials">Raw Materials</SelectItem>
                              <SelectItem value="components">Components</SelectItem>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-person">Contact Person</Label>
                        <Input id="contact-person" placeholder="Full name" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email</Label>
                          <Input id="contact-email" type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone</Label>
                          <Input id="contact-phone" placeholder="+1 (555) 123-4567" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vendor-materials">Materials Provided</Label>
                        <Input id="vendor-materials" placeholder="List of materials" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Vendor</Button>
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
                    <TableHead>Vendor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.id}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{vendor.contactPerson}</TableCell>
                      <TableCell className="hidden md:table-cell">{vendor.rating}/5.0</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vendor.status === "active"
                              ? "success"
                              : vendor.status === "probation"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {vendor.status === "active"
                            ? "Active"
                            : vendor.status === "probation"
                              ? "Probation"
                              : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(vendor)}>
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Delivery Tracking</CardTitle>
                  <CardDescription>Track incoming material deliveries</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Est. Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>{delivery.material}</TableCell>
                      <TableCell>{delivery.vendor}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {delivery.quantity} {delivery.unit}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{delivery.estimatedDelivery}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            delivery.status === "delivered"
                              ? "success"
                              : delivery.status === "in-transit"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {delivery.status === "delivered"
                            ? "Delivered"
                            : delivery.status === "in-transit"
                              ? "In Transit"
                              : "Processing"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDelivery(delivery)}>
                          Track
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
              <CardTitle>Delivery Timeline</CardTitle>
              <CardDescription>Upcoming and recent deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Delivery timeline chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Manage your EV charging station products</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>Add a new EV charging station product to your catalog.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input id="product-name" placeholder="e.g., EV Charger Pro 150kW" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-type">Product Type</Label>
                        <Select>
                          <SelectTrigger id="product-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dc-fast">DC Fast Charger</SelectItem>
                            <SelectItem value="dc-standard">DC Charger</SelectItem>
                            <SelectItem value="ac">AC Charger</SelectItem>
                            <SelectItem value="dc-ultra">DC Ultra-Fast Charger</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-stock">Initial Stock</Label>
                          <Input id="product-stock" type="number" min="0" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-monthly">Monthly Production</Label>
                          <Input id="product-monthly" type="number" min="0" defaultValue="0" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-certifications">Certifications</Label>
                        <Input id="product-certifications" placeholder="e.g., ISO 15118, IEC 61851" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Product</Button>
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
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Stock</TableHead>
                    <TableHead className="hidden md:table-cell">Monthly Production</TableHead>
                    <TableHead className="hidden md:table-cell">Certifications</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{product.stockQuantity}</TableCell>
                      <TableCell className="hidden md:table-cell">{product.monthlyProduction}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {product.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
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
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clipboard className="mr-2 h-4 w-4" />
                              View BOM
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileCheck className="mr-2 h-4 w-4" />
                              Certifications
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
              <CardTitle>Production Analytics</CardTitle>
              <CardDescription>Monthly production and inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Production analytics chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vendor Details Dialog */}
      {selectedVendor && (
        <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Vendor Details: {selectedVendor.name}</DialogTitle>
              <DialogDescription>
                {selectedVendor.type} • ID: {selectedVendor.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Contact Person</h3>
                  <p>{selectedVendor.contactPerson}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <Badge
                    variant={
                      selectedVendor.status === "active"
                        ? "success"
                        : selectedVendor.status === "probation"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {selectedVendor.status === "active"
                      ? "Active"
                      : selectedVendor.status === "probation"
                        ? "Probation"
                        : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Email</h3>
                  <p>{selectedVendor.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Phone</h3>
                  <p>{selectedVendor.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Materials Provided</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Performance Rating</h3>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= selectedVendor.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2">{selectedVendor.rating}/5.0</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Recent Deliveries</h3>
                <div className="space-y-2">
                  {deliveries
                    .filter((d) => d.vendor === selectedVendor.name)
                    .slice(0, 3)
                    .map((delivery) => (
                      <div key={delivery.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">{delivery.material}</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.quantity} {delivery.unit} • {delivery.estimatedDelivery}
                          </p>
                        </div>
                        <Badge
                          variant={
                            delivery.status === "delivered"
                              ? "success"
                              : delivery.status === "in-transit"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {delivery.status === "delivered"
                            ? "Delivered"
                            : delivery.status === "in-transit"
                              ? "In Transit"
                              : "Processing"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedVendor(null)}>
                Close
              </Button>
              <Button>Place Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delivery Tracking Dialog */}
      {selectedDelivery && (
        <Dialog open={!!selectedDelivery} onOpenChange={(open) => !open && setSelectedDelivery(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Delivery Tracking: {selectedDelivery.id}</DialogTitle>
              <DialogDescription>
                {selectedDelivery.material} from {selectedDelivery.vendor}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Order Date</h3>
                  <p>{selectedDelivery.orderDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <Badge
                    variant={
                      selectedDelivery.status === "delivered"
                        ? "success"
                        : selectedDelivery.status === "in-transit"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {selectedDelivery.status === "delivered"
                      ? "Delivered"
                      : selectedDelivery.status === "in-transit"
                        ? "In Transit"
                        : "Processing"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Quantity</h3>
                  <p>
                    {selectedDelivery.quantity} {selectedDelivery.unit}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Tracking Number</h3>
                  <p>{selectedDelivery.trackingNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Estimated Delivery</h3>
                  <p>{selectedDelivery.estimatedDelivery}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Actual Delivery</h3>
                  <p>{selectedDelivery.actualDelivery || "Pending"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Delivery Timeline</h3>
                <div className="space-y-4 mt-2">
                  <div className="relative">
                    <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>

                    <div className="relative pl-8 pb-4">
                      <div className="absolute left-0 rounded-full w-5 h-5 bg-green-600 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-muted-foreground">{selectedDelivery.orderDate}</p>
                    </div>

                    {selectedDelivery.status !== "processing" && (
                      <div className="relative pl-8 pb-4">
                        <div className="absolute left-0 rounded-full w-5 h-5 bg-green-600 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                        <p className="font-medium">Shipment Prepared</p>
                        <p className="text-sm text-muted-foreground">
                          {
                            new Date(new Date(selectedDelivery.orderDate).getTime() + 2 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0]
                          }
                        </p>
                      </div>
                    )}

                    {selectedDelivery.status === "in-transit" && (
                      <div className="relative pl-8 pb-4">
                        <div className="absolute left-0 rounded-full w-5 h-5 bg-yellow-600 flex items-center justify-center">
                          <Truck className="h-3 w-3 text-white" />
                        </div>
                        <p className="font-medium">In Transit</p>
                        <p className="text-sm text-muted-foreground">
                          Estimated arrival: {selectedDelivery.estimatedDelivery}
                        </p>
                      </div>
                    )}

                    {selectedDelivery.status === "delivered" && (
                      <div className="relative pl-8">
                        <div className="absolute left-0 rounded-full w-5 h-5 bg-green-600 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-muted-foreground">{selectedDelivery.actualDelivery}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedDelivery.status !== "delivered" && (
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Live Tracking</h3>
                  <div className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Delivery tracking map will appear here</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDelivery(null)}>
                Close
              </Button>
              {selectedDelivery.status === "delivered" ? (
                <Button>View Receipt</Button>
              ) : (
                <Button>Contact Vendor</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

