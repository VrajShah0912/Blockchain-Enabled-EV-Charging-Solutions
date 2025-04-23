"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Filter,
  MapPin,
  Zap,
  Clock,
  Star,
  CalendarIcon,
  CreditCard,
  Wallet,
  Navigation,
  X,
  Check,
  Info,
} from "lucide-react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const MapComponent = dynamic(
  () => import('./MapComponent').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-gray-100 flex items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-2 text-sm">Loading map...</p>
      </div>
    )
  }
)

interface ChargingStation {
  id: string
  name: string
  manufacturer: string
  area: string
  distance: number
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  openTime: string
  rating: number
  reviews: number
  traffic: string
  ports: {
    type: string
    power: string
    available: number
    total: number
    pricePerKwh: number
  }[]
  sessionsCompleted: number
  energySource: string
  isoCertified: boolean
  isFavorite: boolean
  maintenanceSchedule: string | null
  image: string
  amenities: string[]
  paymentMethods: string[]
}

const chargingStations: ChargingStation[] = [
  {
    id: "CS001",
    name: "Downtown EV Hub",
    manufacturer: "ChargePoint",
    area: "Downtown",
    distance: 0.8,
    address: "123 Main St, Downtown",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    openTime: "24/7",
    rating: 4.5,
    reviews: 28,
    traffic: "Low",
    ports: [
      { type: "CCS", power: "150 kW", available: 2, total: 4, pricePerKwh: 0.35 },
      { type: "CHAdeMO", power: "50 kW", available: 1, total: 2, pricePerKwh: 0.32 },
    ],
    sessionsCompleted: 1245,
    energySource: "Solar",
    isoCertified: true,
    isFavorite: true,
    maintenanceSchedule: "Next maintenance: July 15, 2023",
    image: "/placeholder.svg?height=150&width=300",
    amenities: ["Restrooms", "Cafe", "WiFi"],
    paymentMethods: ["Credit Card", "EVT Token", "Mobile Pay"],
  },
  {
    id: "CS002",
    name: "Midtown Charging",
    manufacturer: "Tesla",
    area: "Midtown",
    distance: 1.5,
    address: "456 Center Ave, Midtown",
    coordinates: { lat: 37.7812, lng: -122.4127 },
    openTime: "6:00 AM - 10:00 PM",
    rating: 4.2,
    reviews: 42,
    traffic: "Medium",
    ports: [
      { type: "Tesla", power: "250 kW", available: 0, total: 6, pricePerKwh: 0.45 },
    ],
    sessionsCompleted: 3421,
    energySource: "Grid",
    isoCertified: false,
    isFavorite: false,
    maintenanceSchedule: null,
    image: "/placeholder.svg?height=150&width=300",
    amenities: ["Restrooms", "Vending Machines"],
    paymentMethods: ["Credit Card", "Tesla Account"],
  },
]

type Station = ChargingStation

export default function StationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [maxDistance, setMaxDistance] = useState(10)
  const [selectedPortTypes, setSelectedPortTypes] = useState<string[]>([])
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [bookingStation, setBookingStation] = useState<Station | null>(null)
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date())
  const [bookingTime, setBookingTime] = useState("12:00")
  const [bookingDuration, setBookingDuration] = useState(30)
  const [paymentMethod, setPaymentMethod] = useState("token")
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)

  // Debug effect
  useEffect(() => {
    console.log("Current state:", {
      searchTerm,
      maxDistance,
      selectedPortTypes,
      onlyAvailable,
      currentLocation,
      filteredCount: filteredStations.length
    })
  }, [searchTerm, maxDistance, selectedPortTypes, onlyAvailable, currentLocation])

  const filteredStations = chargingStations.filter((station) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = searchTerm === "" || 
      station.name.toLowerCase().includes(searchLower) ||
      station.address.toLowerCase().includes(searchLower) ||
      station.area.toLowerCase().includes(searchLower)

    const matchesDistance = station.distance <= maxDistance
    const matchesPorts = selectedPortTypes.length === 0 || 
      station.ports.some((port) => selectedPortTypes.includes(port.type))
    const matchesAvailability = !onlyAvailable || 
      station.ports.some((port) => port.available > 0)

    return matchesSearch && matchesDistance && matchesPorts && matchesAvailability
  })

  const sortedStations = [...filteredStations].sort((a, b) => a.distance - b.distance)

  const togglePortType = (type: string) => {
    setSelectedPortTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleBookingSubmit = () => {
    console.log("Booking submitted:", {
      station: bookingStation,
      date: bookingDate,
      time: bookingTime,
      duration: bookingDuration,
      paymentMethod,
    })
    setBookingConfirmed(true)
  }

  const resetBookingForm = () => {
    setBookingStation(null)
    setBookingDate(new Date())
    setBookingTime("12:00")
    setBookingDuration(30)
    setPaymentMethod("token")
    setBookingConfirmed(false)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setMaxDistance(10)
    setSelectedPortTypes([])
    setOnlyAvailable(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Debug Panel - Remove in production */}
      <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg z-50 border border-gray-200">
        <h3 className="font-bold mb-2 text-sm">Debug Info</h3>
        <div className="text-xs space-y-1">
          <p>Stations: {filteredStations.length}/{chargingStations.length}</p>
          <p>Filters: {searchTerm ? `"${searchTerm}"` : 'None'}</p>
          <p>Distance: ≤{maxDistance}km</p>
          <p>Ports: {selectedPortTypes.join(", ") || "All"}</p>
          <p>Only Available: {onlyAvailable ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Find Charging Stations</h1>
        <p className="text-muted-foreground">Locate available charging stations near you</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
              <CardDescription>Refine your station search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Search */}
              <div className="space-y-2">
                <Label htmlFor="location-search">Location</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location-search"
                    placeholder="Enter address or city"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button size="icon" variant="outline">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Maximum Distance</Label>
                  <span className="text-sm text-muted-foreground">{maxDistance} km</span>
                </div>
                <Slider
                  value={[maxDistance]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setMaxDistance(value[0])}
                />
              </div>

              {/* Port Types */}
              <div className="space-y-2">
                <Label>Charging Port Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["CCS", "CHAdeMO", "Type 2", "Tesla"].map((type) => (
                    <Button
                      key={type}
                      variant={selectedPortTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePortType(type)}
                      className={selectedPortTypes.includes(type) ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="available-only" 
                  checked={onlyAvailable} 
                  onCheckedChange={setOnlyAvailable} 
                />
                <Label htmlFor="available-only">Show available stations only</Label>
              </div>

              <Button className="w-full" onClick={resetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          {/* Saved Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Locations</CardTitle>
              <CardDescription>Your favorite charging spots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {chargingStations
                .filter((station) => station.isFavorite)
                .map((station) => (
                  <div key={station.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{station.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedStation(station)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              {chargingStations.filter((station) => station.isFavorite).length === 0 && (
                <p className="text-sm text-muted-foreground text-center">No saved locations yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map and Results */}
        <div className="md:col-span-2 space-y-4">
          {/* Map Component */}
          <Card>
            <CardContent className="p-0">
              <MapComponent 
                sortedStations={sortedStations} 
                setSelectedStation={setSelectedStation}
                currentLocation={currentLocation}
                setCurrentLocation={setCurrentLocation}
              />
            </CardContent>
          </Card>

          {/* Results Tabs */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>

            {/* List View */}
            <TabsContent value="list" className="space-y-4 mt-4">
              {sortedStations.length > 0 ? (
                sortedStations.map((station) => (
                  <Card key={station.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{station.name}</h3>
                            {station.isFavorite && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                            {station.ports.some((p) => p.available > 0) ? (
                              <Badge 
                                variant="default" 
                                className="bg-green-100 text-green-800 hover:bg-green-100"
                              >
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                Busy
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {station.distance} km away · {station.area}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Zap className="h-4 w-4 text-green-600" />
                              <span className="text-xs">
                                {station.ports.map((p) => p.type).join(", ")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-xs">{station.openTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-xs">
                                {station.rating} ({station.reviews})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button onClick={() => setSelectedStation(station)}>
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setBookingStation(station)
                              setBookingConfirmed(false)
                            }}
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No stations match your filters</p>
                  <Button
                    variant="link"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Grid View */}
            <TabsContent value="grid" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sortedStations.length > 0 ? (
                  sortedStations.map((station) => (
                    <Card key={station.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{station.name}</h3>
                            {station.isFavorite ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <Star className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              {station.distance} km away
                            </p>
                            {station.ports.some((p) => p.available > 0) ? (
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800 hover:bg-green-100"
                              >
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                Busy
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Zap className="h-4 w-4 text-green-600" />
                              <span className="text-xs">{station.ports.length} ports</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-xs">{station.rating}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button 
                              size="sm" 
                              className="flex-1" 
                              onClick={() => setSelectedStation(station)}
                            >
                              Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setBookingStation(station)
                                setBookingConfirmed(false)
                              }}
                            >
                              Book
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">No stations match your filters</p>
                    <Button
                      variant="link"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Station Details Dialog */}
      {selectedStation && (
        <Dialog open={!!selectedStation} onOpenChange={(open) => !open && setSelectedStation(null)}>
          <DialogContent className="sm:max-w-[600px] z-[1000]">
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
                  <p className="text-sm">{selectedStation.distance} km</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm">{selectedStation.openTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Traffic</p>
                  <p className="text-sm">{selectedStation.traffic}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Sessions</p>
                  <p className="text-sm">{selectedStation.sessionsCompleted.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Charging Ports</h4>
                <div className="space-y-2">
                  {selectedStation.ports.map((port, index) => (
                    <div key={`${selectedStation.id}-port-${index}`} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{port.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {port.power} • ${port.pricePerKwh}/kWh
                        </p>
                      </div>
                      {port.available > 0 ? (
                        <Badge 
                          variant="default" 
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          {port.available}/{port.total} Available
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          {port.available}/{port.total} Available
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Payment Methods</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.paymentMethods.map((method, index) => (
                    <Badge key={index} variant="outline">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-600"></div>
                  <div>
                    <p className="text-sm font-medium">Energy Source</p>
                    <p className="text-xs text-muted-foreground">{selectedStation.energySource}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full ${selectedStation.isoCertified ? "bg-green-600" : "bg-red-600"}`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">ISO Certified</p>
                    <p className="text-xs text-muted-foreground">{selectedStation.isoCertified ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              {selectedStation.maintenanceSchedule && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 rounded-md">
                  <Info className="h-5 w-5" />
                  <p className="text-sm">{selectedStation.maintenanceSchedule}</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                {selectedStation.isFavorite ? "Remove Favorite" : "Add to Favorites"}
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBookingStation(selectedStation)
                    setSelectedStation(null)
                    setBookingConfirmed(false)
                  }}
                >
                  Book Now
                </Button>
                <Button
                  onClick={() => {
                    window.open(`https://maps.google.com/?q=${selectedStation.address}`, "_blank")
                  }}
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Navigate
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Booking Dialog */}
      {bookingStation && (
        <Dialog open={!!bookingStation} onOpenChange={(open) => !open && resetBookingForm()}>
          <DialogContent className="sm:max-w-[500px] z-[1000]">
            <DialogHeader>
              <DialogTitle>Book Charging Session</DialogTitle>
              <DialogDescription>
                {bookingStation.name} • {bookingStation.address}
              </DialogDescription>
            </DialogHeader>

            {!bookingConfirmed ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingDate ? format(bookingDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar 
                          mode="single" 
                          selected={bookingDate} 
                          onSelect={setBookingDate} 
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-time">Time</Label>
                    <Select value={bookingTime} onValueChange={setBookingTime}>
                      <SelectTrigger id="booking-time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem 
                            key={i} 
                            value={`${i.toString().padStart(2, "0")}:00`}
                          >
                            {i.toString().padStart(2, "0")}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="booking-duration">Duration (minutes)</Label>
                    <span className="text-sm text-muted-foreground">{bookingDuration} min</span>
                  </div>
                  <Slider
                    id="booking-duration"
                    value={[bookingDuration]}
                    min={15}
                    max={120}
                    step={15}
                    onValueChange={(value) => setBookingDuration(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charging-port">Charging Port</Label>
                  <Select defaultValue={bookingStation.ports[0].type}>
                    <SelectTrigger id="charging-port">
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingStation.ports.map((port, index) => (
                        <SelectItem 
                          key={index} 
                          value={port.type} 
                          disabled={port.available === 0}
                        >
                          {port.type} ({port.power}) - ${port.pricePerKwh}/kWh
                          {port.available === 0 ? " - Unavailable" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={paymentMethod === "token" ? "default" : "outline"}
                      className={paymentMethod === "token" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => setPaymentMethod("token")}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      EVT Token
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      className={paymentMethod === "card" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === "mobile" ? "default" : "outline"}
                      className={paymentMethod === "mobile" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => setPaymentMethod("mobile")}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Mobile Pay
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Estimated Cost:</span>
                    <span className="font-bold">${((bookingDuration / 60) * 15 * 0.35).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated Energy:</span>
                    <span>~{((bookingDuration / 60) * 15).toFixed(1)} kWh</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium">Booking Confirmed!</h3>
                <p className="text-center text-muted-foreground">
                  Your charging session has been booked for {bookingDate && format(bookingDate, "PPP")} at {bookingTime}
                  .
                </p>
                <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                  <div className="flex justify-between">
                    <span>Station:</span>
                    <span className="font-medium">{bookingStation.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{bookingDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span>
                      {paymentMethod === "token"
                        ? "EVT Token"
                        : paymentMethod === "card"
                          ? "Credit Card"
                          : "Mobile Pay"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  A confirmation has been sent to your email and is available in your account.
                </p>
              </div>
            )}

            <DialogFooter>
              {!bookingConfirmed ? (
                <>
                  <Button variant="outline" onClick={resetBookingForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleBookingSubmit}>Confirm Booking</Button>
                </>
              ) : (
                <Button onClick={resetBookingForm}>Done</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}