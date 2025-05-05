"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { getStations, getFavorites, addFavorite, removeFavorite } from "@/lib/stations"
import { getCurrentUser } from "@/lib/auth"
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
import { useToast } from "@/components/ui/use-toast"
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

// Interface for vehicle data
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: string;
  batteryCapacity: string;
  chargingPortType: string;
  image: string;
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [currentLocation, setCurrentLocation] = useState("Detecting location...")
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [stations, setStations] = useState<any[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([])
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false)
  
  // Form state for new vehicle
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    make: "",
    model: "",
    year: "",
    batteryCapacity: "",
    chargingPortType: "type1",
    image: "/img/downloads.jpeg" // Default image
  })

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Get user data from localStorage
        const storedUser = localStorage.getItem('evUser')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUserData(userData)
          
          // If user has a vehicle from registration, add it to vehicles list
          if (userData.vehicle) {
            setUserVehicles([{
              id: 1, // First vehicle gets ID 1
              make: userData.vehicle.make,
              model: userData.vehicle.model,
              year: userData.vehicle.year,
              batteryCapacity: userData.vehicle.batteryCapacity,
              chargingPortType: userData.vehicle.chargingPortType,
              image: userData.vehicle.image || "/img/downloads.jpeg"
            }])
          }
        }
        
        // Get stations and favorites
        const [stationsData, favoritesData] = await Promise.all([
          getStations(),
          getFavorites()
        ])
        
        setStations(stationsData)
        setFavorites(new Set(favoritesData.map((s: any) => s.station_id)))
        
        // Simulate location detection
        setCurrentLocation("San Francisco, CA")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token, toast])

  
  const toggleFavorite = async (stationId: number) => {
    if (!token) return

    try {
      if (favorites.has(stationId)) {
        await removeFavorite(stationId)
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          newFavorites.delete(stationId)
          return newFavorites
        })
        toast({
          title: "Success",
          description: "Station removed from favorites",
        })
      } else {
        await addFavorite(stationId)
        setFavorites(prev => new Set(prev).add(stationId))
        toast({
          title: "Success",
          description: "Station added to favorites",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    }
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate a simple ID (in a real app, this would come from your backend)
    const newId = userVehicles.length > 0 
      ? Math.max(...userVehicles.map(v => v.id)) + 1 
      : 1
    
    const vehicleToAdd: Vehicle = {
      id: newId,
      ...newVehicle
    }
    
    setUserVehicles([...userVehicles, vehicleToAdd])
    
    toast({
      title: "Vehicle Added",
      description: "Your vehicle has been added successfully",
    })
    
    // Reset form and close dialog
    setNewVehicle({
      make: "",
      model: "",
      year: "",
      batteryCapacity: "",
      chargingPortType: "type1",
      image: "/img/downloads.jpeg"
    })
    setShowAddVehicleDialog(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* ... (previous code remains the same until the Vehicle Management Section) ... */}

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
                <form onSubmit={handleAddVehicle}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vehicle-make" className="text-right">
                        Make
                      </Label>
                      <Select 
                        value={newVehicle.make}
                        onValueChange={(value) => handleSelectChange("make", value)}
                      >
                        <SelectTrigger id="vehicle-make" className="col-span-3">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tesla">Tesla</SelectItem>
                          <SelectItem value="Nissan">Nissan</SelectItem>
                          <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="Ford">Ford</SelectItem>
                          <SelectItem value="BMW">BMW</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vehicle-model" className="text-right">
                        Model
                      </Label>
                      <Input 
                        id="vehicle-model" 
                        name="model"
                        placeholder="e.g., Model 3" 
                        className="col-span-3" 
                        value={newVehicle.model}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vehicle-year" className="text-right">
                        Year
                      </Label>
                      <Input 
                        id="vehicle-year" 
                        name="year"
                        placeholder="e.g., 2023" 
                        className="col-span-3" 
                        value={newVehicle.year}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="battery-capacity" className="text-right">
                        Battery
                      </Label>
                      <Input 
                        id="battery-capacity" 
                        name="batteryCapacity"
                        placeholder="e.g., 75 kWh" 
                        className="col-span-3" 
                        value={newVehicle.batteryCapacity}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="charging-port" className="text-right">
                        Port Type
                      </Label>
                      <Select
                        value={newVehicle.chargingPortType}
                        onValueChange={(value) => handleSelectChange("chargingPortType", value)}
                      >
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
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading vehicles...</div>
          ) : userVehicles.length > 0 ? (
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
                    
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Battery:</p>
                          <p>{vehicle.batteryCapacity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Port Type:</p>
                          <p>
                            {vehicle.chargingPortType === "type1" && "Type 1 (J1772)"}
                            {vehicle.chargingPortType === "type2" && "Type 2 (Mennekes)"}
                            {vehicle.chargingPortType === "ccs1" && "CCS Combo 1"}
                            {vehicle.chargingPortType === "ccs2" && "CCS Combo 2"}
                            {vehicle.chargingPortType === "chademo" && "CHAdeMO"}
                            {vehicle.chargingPortType === "tesla" && "Tesla"}
                          </p>
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
              <Button 
                variant="outline" 
                onClick={() => setShowAddVehicleDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Vehicle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ... (rest of the code remains the same) ... */}
    </div>
  )
}