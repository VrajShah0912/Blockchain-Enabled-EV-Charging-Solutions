"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Battery,
  Clock,
  CreditCard,
  Zap,
  TrendingUp,
  MapPin,
  Car,
  Plus,
  Navigation,
  Star,
  Leaf,
  Shield,
  AlertCircle,
  ChevronRight,
  Search,
} from "lucide-react"

// Mock data for vehicles
const userVehicles = [
  {
    id: 1,
    make: "Tesla",
    model: "Model 3",
    year: "2022",
    batteryCapacity: "75 kWh",
    chargingPortType: "Tesla",
    image: "/placeholder.svg?height=100&width=200",
  },
]

// Mock data for nearby charging stations
const nearbyStations = [
  {
    id: "CS001",
    name: "Downtown EV Hub",
    manufacturer: "ChargePoint",
    area: "Downtown",
    distance: "0.8 km",
    address: "123 Main St, Downtown",
    openTime: "24/7",
    rating: 4.5,
    reviews: 28,
    traffic: "Low",
    ports: [
      { type: "CCS", power: "150 kW", available: 2, total: 4 },
      { type: "CHAdeMO", power: "50 kW", available: 1, total: 2 },
    ],
    pricePerKwh: "$0.35",
    sessionsCompleted: 1245,
    energySource: "Solar",
    isoCertified: true,
    isFavorite: true,
    maintenanceSchedule: "Next maintenance: July 15, 2023",
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: "CS002",
    name: "Westside Charging Center",
    manufacturer: "EVgo",
    area: "Westside",
    distance: "1.2 km",
    address: "456 West Ave, Westside",
    openTime: "6:00 AM - 10:00 PM",
    rating: 4.2,
    reviews: 42,
    traffic: "Medium",
    ports: [
      { type: "CCS", power: "350 kW", available: 0, total: 2 },
      { type: "Type 2", power: "22 kW", available: 3, total: 6 },
    ],
    pricePerKwh: "$0.40",
    sessionsCompleted: 987,
    energySource: "Grid",
    isoCertified: true,
    isFavorite: false,
    maintenanceSchedule: null,
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: "CS003",
    name: "Northgate Power Station",
    manufacturer: "Tesla",
    area: "Northgate",
    distance: "2.5 km",
    address: "789 North Blvd, Northgate",
    openTime: "24/7",
    rating: 4.8,
    reviews: 56,
    traffic: "High",
    ports: [{ type: "Tesla", power: "250 kW", available: 4, total: 12 }],
    pricePerKwh: "$0.28",
    sessionsCompleted: 3456,
    energySource: "Wind",
    isoCertified: true,
    isFavorite: true,
    maintenanceSchedule: null,
    image: "/placeholder.svg?height=150&width=300",
  },
]

export default function DashboardPage() {
  const [currentLocation, setCurrentLocation] = useState("Detecting location...")
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(userVehicles.length === 0)

  // Simulate location detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLocation("San Francisco, CA")
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/stations">
            <Button>Find Stations</Button>
          </Link>
        </div>
      </div>

      {/* Vehicle Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Vehicles</CardTitle>
              <CardDescription>Manage your electric vehicles</CardDescription>
            </div>
            <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                  <DialogDescription>Enter your electric vehicle details.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vehicle-make" className="text-right">
                      Make
                    </Label>
                    <Select>
                      <SelectTrigger id="vehicle-make" className="col-span-3">
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tesla">Tesla</SelectItem>
                        <SelectItem value="nissan">Nissan</SelectItem>
                        <SelectItem value="chevrolet">Chevrolet</SelectItem>
                        <SelectItem value="ford">Ford</SelectItem>
                        <SelectItem value="bmw">BMW</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vehicle-model" className="text-right">
                      Model
                    </Label>
                    <Input id="vehicle-model" placeholder="e.g., Model 3" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vehicle-year" className="text-right">
                      Year
                    </Label>
                    <Input id="vehicle-year" placeholder="e.g., 2023" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="battery-capacity" className="text-right">
                      Battery
                    </Label>
                    <Input id="battery-capacity" placeholder="e.g., 75 kWh" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="charging-port" className="text-right">
                      Port Type
                    </Label>
                    <Select>
                      <SelectTrigger id="charging-port" className="col-span-3">
                        <SelectValue placeholder="Select port type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="type1">Type 1 (J1772)</SelectItem>
                        <SelectItem value="type2">Type 2 (Mennekes)</SelectItem>
                        <SelectItem value="ccs1">CCS Combo 1</SelectItem>
                        <SelectItem value="ccs2">CCS Combo 2</SelectItem>
                        <SelectItem value="chademo">CHAdeMO</SelectItem>
                        <SelectItem value="tesla">Tesla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Vehicle</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {userVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userVehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </h3>
                      </div>
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Battery:</p>
                          <p>{vehicle.batteryCapacity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Port Type:</p>
                          <p>{vehicle.chargingPortType}</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Vehicles Added</h3>
              <p className="text-muted-foreground mb-4">
                Add your electric vehicle details to get personalized charging recommendations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location and Nearby Stations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nearby Charging Stations</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {currentLocation}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search location..."
                  className="w-[200px] pl-8"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map will appear here</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyStations.map((station) => (
              <Card key={station.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={station.image || "/placeholder.svg"}
                    alt={station.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{station.name}</h3>
                      {station.isFavorite && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {station.distance} • {station.area}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-blue-600" />
                        <span>{station.openTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                        <span>
                          {station.rating} ({station.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {station.ports.map((port, index) => (
                        <Badge key={index} variant={port.available > 0 ? "outline" : "secondary"}>
                          {port.type} • {port.available}/{port.total} • {port.power}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Zap className="h-3.5 w-3.5 mr-1 text-green-600" />
                        <span>{station.pricePerKwh}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Leaf className="h-3.5 w-3.5 mr-1 text-green-600" />
                        <span>{station.energySource}</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedStation(station)}>
                        Details
                      </Button>
                      <Button size="sm">
                        Navigate
                        <Navigation className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Nearby Stations
          </Button>
        </CardFooter>
      </Card>

      {/* Station Details Dialog */}
      {selectedStation && (
        <Dialog open={!!selectedStation} onOpenChange={() => setSelectedStation(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {selectedStation.name}
                {selectedStation.isFavorite ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Star className="h-4 w-4 text-muted-foreground" />
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedStation.manufacturer} • {selectedStation.address}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <img
                src={selectedStation.image || "/placeholder.svg"}
                alt={selectedStation.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Distance</p>
                  <p className="text-sm">{selectedStation.distance}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm">{selectedStation.openTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm">{selectedStation.pricePerKwh}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Traffic</p>
                  <p className="text-sm">{selectedStation.traffic}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Charging Ports</h4>
                <div className="space-y-2">
                  {selectedStation.ports.map((port, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{port.type}</p>
                        <p className="text-sm text-muted-foreground">{port.power}</p>
                      </div>
                      <Badge variant={port.available > 0 ? "success" : "destructive"}>
                        {port.available}/{port.total} Available
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">ISO Certified</p>
                    <p className="text-xs text-muted-foreground">{selectedStation.isoCertified ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Energy Source</p>
                    <p className="text-xs text-muted-foreground">{selectedStation.energySource}</p>
                  </div>
                </div>
              </div>

              {selectedStation.maintenanceSchedule && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">{selectedStation.maintenanceSchedule}</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                {selectedStation.isFavorite ? "Remove Favorite" : "Add to Favorites"}
              </Button>
              <Button>
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dashboard Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Energy</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142.8 kWh</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charging Sessions</CardTitle>
            <Battery className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12 since last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234 EVT</div>
            <p className="text-xs text-muted-foreground">+256 tokens earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2 kg</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Trip Planning Section */}
      <Card>
        <CardHeader>
          <CardTitle>Plan a Trip</CardTitle>
          <CardDescription>Find charging stations along your route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-location">Start Location</Label>
                <Input id="start-location" placeholder="Enter start location" defaultValue={currentLocation} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Enter destination" />
              </div>
            </div>
            <Button className="w-full">Plan Route</Button>
            <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Route planning map will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-muted-foreground">john.doe@example.com</p>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>

            <Separator className="hidden md:block" orientation="vertical" />

            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Charging History</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">Station #{Math.floor(Math.random() * 100)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - i * 86400000 * 3).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(Math.random() * 20 + 10).toFixed(1)} kWh</p>
                        <p className="text-sm text-muted-foreground">${(Math.random() * 10 + 5).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" size="sm" className="mt-2 p-0">
                  View Full History
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Payment Methods</h4>
                <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <Button variant="link" size="sm" className="mt-2 p-0">
                  Manage Payment Methods
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

