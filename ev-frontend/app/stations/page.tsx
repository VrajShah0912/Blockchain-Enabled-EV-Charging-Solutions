"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { getFavorites, addFavorite, removeFavorite } from "@/lib/stations"
import { createReservation } from "@/lib/reservations"

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
  station_id: number
  name: string
  location: string
  latitude: number
  longitude: number
  price: number
  available_ports: number
  total_ports: number
  ports: {
    id: number
    type: string
    power: string
    available: number
    pricePerKwh: number
  }[]
  isFavorite?: boolean
  distance?: number
}

interface Transaction {
  id: string
  timestamp: string
  hash: string
  type: 'charging' | 'payment' | 'reward'
  stationId: string
  stationName: string
  amount: number
  energy: number
  status: 'pending' | 'confirmed' | 'failed'
}

// Complete Pune charging stations data
const puneChargingStations: ChargingStation[] = [
  {
    station_id: 1001,
    name: "EV Power Hub Koregaon Park",
    location: "North Main Road, Koregaon Park, Pune",
    latitude: 18.5362,
    longitude: 73.8939,
    price: 12.50,
    available_ports: 0,
    total_ports: 6,
    ports: [
      {
        id: 10011,
        type: "CCS",
        power: "150 kW",
        available: 2,
        pricePerKwh: 12.50
      },
      {
        id: 10012,
        type: "Type 2",
        power: "22 kW",
        available: 2,
        pricePerKwh: 10.00
      },
      {
        id: 10013,
        type: "CHAdeMO",
        power: "50 kW",
        available: 0,
        pricePerKwh: 11.00
      }
    ]
  },
  {
    station_id: 1002,
    name: "TataEV Charge Aundh",
    location: "ITI Road, Aundh, Pune",
    latitude: 18.5584,
    longitude: 73.8077,
    price: 11.75,
    available_ports: 3,
    total_ports: 4,
    ports: [
      {
        id: 10021,
        type: "CCS",
        power: "120 kW",
        available: 2,
        pricePerKwh: 11.75
      },
      {
        id: 10022,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 9.50
      }
    ]
  },
  {
    station_id: 1003,
    name: "ElectroCharge Viman Nagar",
    location: "Phoenix Mall, Viman Nagar, Pune",
    latitude: 18.5679,
    longitude: 73.9143,
    price: 13.00,
    available_ports: 0,
    total_ports: 8,
    ports: [
      {
        id: 10031,
        type: "CCS",
        power: "180 kW",
        available: 0,
        pricePerKwh: 13.00
      },
      {
        id: 10032,
        type: "Type 2",
        power: "22 kW",
        available: 0,
        pricePerKwh: 10.50
      },
      {
        id: 10033,
        type: "Tesla",
        power: "250 kW",
        available: 0,
        pricePerKwh: 14.00
      }
    ]
  },
  {
    station_id: 1004,
    name: "GreenCharge Kothrud",
    location: "Paud Road, Kothrud, Pune",
    latitude: 18.5074,
    longitude: 73.8077,
    price: 10.50,
    available_ports: 5,
    total_ports: 6,
    ports: [
      {
        id: 10041,
        type: "CCS",
        power: "100 kW",
        available: 3,
        pricePerKwh: 10.50
      },
      {
        id: 10042,
        type: "Type 2",
        power: "22 kW",
        available: 2,
        pricePerKwh: 8.00
      }
    ]
  },
  {
    station_id: 1005,
    name: "Ather Grid Hinjewadi",
    location: "Phase 1, Hinjewadi IT Park, Pune",
    latitude: 18.5894,
    longitude: 73.7379,
    price: 12.00,
    available_ports: 2,
    total_ports: 4,
    ports: [
      {
        id: 10051,
        type: "CCS",
        power: "150 kW",
        available: 1,
        pricePerKwh: 12.00
      },
      {
        id: 10052,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 9.00
      }
    ]
  },
  {
    station_id: 1006,
    name: "IOCL EV Station Shivajinagar",
    location: "FC Road, Shivajinagar, Pune",
    latitude: 18.5314,
    longitude: 73.8446,
    price: 11.25,
    available_ports: 4,
    total_ports: 6,
    ports: [
      {
        id: 10061,
        type: "CCS",
        power: "120 kW",
        available: 2,
        pricePerKwh: 11.25
      },
      {
        id: 10062,
        type: "CHAdeMO",
        power: "50 kW",
        available: 1,
        pricePerKwh: 10.00
      },
      {
        id: 10063,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 9.00
      }
    ]
  },
  {
    station_id: 1007,
    name: "HPCL Fast Charge Hadapsar",
    location: "Magarpatta Road, Hadapsar, Pune",
    latitude: 18.5089,
    longitude: 73.9260,
    price: 11.00,
    available_ports: 2,
    total_ports: 4,
    ports: [
      {
        id: 10071,
        type: "CCS",
        power: "100 kW",
        available: 1,
        pricePerKwh: 11.00
      },
      {
        id: 10072,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 8.50
      }
    ]
  },
  {
    station_id: 1008,
    name: "BatteryZone Baner",
    location: "Baner Road, Baner, Pune",
    latitude: 18.5590,
    longitude: 73.7868,
    price: 12.75,
    available_ports: 3,
    total_ports: 6,
    ports: [
      {
        id: 10081,
        type: "CCS",
        power: "150 kW",
        available: 1,
        pricePerKwh: 12.75
      },
      {
        id: 10082,
        type: "CHAdeMO",
        power: "50 kW",
        available: 1,
        pricePerKwh: 11.50
      },
      {
        id: 10083,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 10.00
      }
    ]
  },
  {
    station_id: 1009,
    name: "VoltHub Sinhagad Road",
    location: "Sinhagad Road, Pune",
    latitude: 18.4574,
    longitude: 73.8183,
    price: 10.00,
    available_ports: 6,
    total_ports: 8,
    ports: [
      {
        id: 10091,
        type: "CCS",
        power: "100 kW",
        available: 3,
        pricePerKwh: 10.00
      },
      {
        id: 10092,
        type: "Type 2",
        power: "22 kW",
        available: 3,
        pricePerKwh: 8.00
      }
    ]
  },
  {
    station_id: 1010,
    name: "ChargeZone Kalyani Nagar",
    location: "Kalyani Nagar, Pune",
    latitude: 18.5450,
    longitude: 73.8911,
    price: 13.50,
    available_ports: 1,
    total_ports: 8,
    ports: [
      {
        id: 10101,
        type: "CCS",
        power: "180 kW",
        available: 0,
        pricePerKwh: 13.50
      },
      {
        id: 10102,
        type: "Tesla",
        power: "250 kW",
        available: 1,
        pricePerKwh: 14.50
      },
      {
        id: 10103,
        type: "Type 2",
        power: "22 kW",
        available: 0,
        pricePerKwh: 11.00
      }
    ]
  },
  {
    station_id: 1011,
    name: "EcoCharge Wakad",
    location: "Hinjewadi Road, Wakad, Pune",
    latitude: 18.5902,
    longitude: 73.7605,
    price: 11.50,
    available_ports: 3,
    total_ports: 4,
    ports: [
      {
        id: 10111,
        type: "CCS",
        power: "120 kW",
        available: 2,
        pricePerKwh: 11.50
      },
      {
        id: 10112,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 9.00
      }
    ]
  },
  {
    station_id: 1012,
    name: "PowerPlug Warje",
    location: "Mumbai-Bangalore Highway, Warje, Pune",
    latitude: 18.4846,
    longitude: 73.7872,
    price: 10.75,
    available_ports: 4,
    total_ports: 4,
    ports: [
      {
        id: 10121,
        type: "CCS",
        power: "100 kW",
        available: 2,
        pricePerKwh: 10.75
      },
      {
        id: 10122,
        type: "CHAdeMO",
        power: "50 kW",
        available: 1,
        pricePerKwh: 9.75
      },
      {
        id: 10123,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 8.25
      }
    ]
  },
  {
    station_id: 1013,
    name: "SparkEV Camp",
    location: "Pashan-Sus Road, Pashan, Pune",
    latitude: 18.5407,
    longitude: 73.7928,
    price: 12.25,
    available_ports: 5,
    total_ports: 8,
    ports: [
      {
        id: 10131,
        type: "CCS",
        power: "150 kW",
        available: 2,
        pricePerKwh: 12.25
      },
      {
        id: 10132,
        type: "Type 2",
        power: "22 kW",
        available: 2,
        pricePerKwh: 9.75
      },
      {
        id: 10133,
        type: "Tesla",
        power: "250 kW",
        available: 1,
        pricePerKwh: 13.50
      }
    ]
  },
  {
    station_id: 1014,
    name: "BluSmart Kharadi",
    location: "EON IT Park, Kharadi, Pune",
    latitude: 18.5519,
    longitude: 73.9490,
    price: 11.80,
    available_ports: 3,
    total_ports: 6,
    ports: [
      {
        id: 10141,
        type: "CCS",
        power: "120 kW",
        available: 2,
        pricePerKwh: 11.80
      },
      {
        id: 10142,
        type: "CHAdeMO",
        power: "50 kW",
        available: 0,
        pricePerKwh: 10.80
      },
      {
        id: 10143,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 9.30
      }
    ]
  },
  {
    station_id: 1015,
    name: "ZipCharge Kondhwa",
    location: "NIBM Road, Kondhwa, Pune",
    latitude: 18.4675,
    longitude: 73.8908,
    price: 10.25,
    available_ports: 2,
    total_ports: 4,
    ports: [
      {
        id: 10151,
        type: "CCS",
        power: "100 kW",
        available: 1,
        pricePerKwh: 10.25
      },
      {
        id: 10152,
        type: "Type 2",
        power: "22 kW",
        available: 1,
        pricePerKwh: 8.75
      }
    ]
  }
];
export default function StationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, token } = useAuth()

  // State declarations
  const [searchTerm, setSearchTerm] = useState("")
  const [maxDistance, setMaxDistance] = useState(10)
  const [selectedPortTypes, setSelectedPortTypes] = useState<string[]>([])
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [stations, setStations] = useState<ChargingStation[]>(puneChargingStations)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null)
  const [bookingStation, setBookingStation] = useState<ChargingStation | null>(null)
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date())
  const [bookingTime, setBookingTime] = useState("12:00")
  const [bookingDuration, setBookingDuration] = useState(30)
  const [paymentMethod, setPaymentMethod] = useState("token")
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load favorites and transactions
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (token) {
          const favoritesData = await getFavorites()
          setFavorites(new Set(favoritesData.map((s: any) => s.station_id)))
        }

        // Load transactions from localStorage
        const storedTransactions = localStorage.getItem('evTransactions')
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions))
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        })
      }
    }

    loadInitialData()
  }, [token, toast])

  // Calculate distances when current location changes
  useEffect(() => {
    if (currentLocation) {
      setStations(prevStations =>
        prevStations.map(station => {
          const distance = calculateDistance(
            currentLocation[0],
            currentLocation[1],
            station.latitude,
            station.longitude
          )
          return { ...station, distance }
        })
      )
    }
  }, [currentLocation])

  // Helper functions
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  const deg2rad = (deg: number) => deg * (Math.PI / 180)

  const togglePortType = (type: string) => {
    setSelectedPortTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }
  const handleBookingSubmit = async () => {
    if (!bookingStation) return;
  
    try {
      setIsLoading(true);
      
      // Calculate energy used and token reward
      const hours = bookingDuration / 60; // Convert minutes to hours
      const energyUsed = hours * 15; // Assuming 15 kWh per hour charging rate
      const amountSpent = bookingStation.price * energyUsed;
      const tokenReward = Math.floor(energyUsed * 2); // 2 tokens per kWh
  
      // Generate transaction data
      const txHash = `0x${Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
      // Get or create user data
      let user = JSON.parse(localStorage.getItem('evUser') || {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        name: "Guest User",
        tokenBalance: 100, // Default starting balance
        transactions: []
      });
  
      const newTransaction = {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString(),
        hash: txHash,
        type: 'charging' as const,
        stationId: bookingStation.station_id.toString(),
        stationName: bookingStation.name,
        amount: parseFloat(amountSpent.toFixed(2)),
        energy: parseFloat(energyUsed.toFixed(1)),
        duration: bookingDuration,
        status: 'confirmed' as const,
        tokenAmount: tokenReward
      };
  
      // Update user data
      user.tokenBalance = (user.tokenBalance || 0) + tokenReward;
      user.transactions = [newTransaction, ...(user.transactions || [])];
      localStorage.setItem('evUser', JSON.stringify(user));
  
      // Fix: Ensure the path is a string and properly formatted
      const redirectPath = `/transactions?${new URLSearchParams({
        newTx: txHash,
        reward: tokenReward.toString(),
        amount: amountSpent.toFixed(2),
        energy: energyUsed.toFixed(1),
        duration: bookingDuration.toString(),
        station: bookingStation.name
      }).toString()}`;
  
      router.push(redirectPath);
  
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      resetBookingForm();
    }
  };

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

  const toggleFavorite = async (stationId: number) => {
    if (!token) {
      router.push("/login")
      return
    }

    try {
      if (favorites.has(stationId)) {
        await removeFavorite(stationId)
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          newFavorites.delete(stationId)
          return newFavorites
        })
        toast({
          title: "Removed from favorites",
          description: "Station removed from your favorites",
        })
      } else {
        await addFavorite(stationId)
        setFavorites(prev => new Set(prev).add(stationId))
        toast({
          title: "Added to favorites",
          description: "Station added to your favorites",
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

  // Filter and sort stations
  const filteredStations = stations.filter((station) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = searchTerm === "" ||
      station.name.toLowerCase().includes(searchLower) ||
      station.location.toLowerCase().includes(searchLower)

    const matchesPorts = selectedPortTypes.length === 0 ||
      station.ports.some((port) => selectedPortTypes.includes(port.type))
    const matchesAvailability = !onlyAvailable ||
      station.available_ports > 0
    const matchesDistance = !currentLocation ||
      (station.distance && station.distance <= maxDistance)

    return matchesSearch && matchesPorts && matchesAvailability && matchesDistance
  })

  const sortedStations = [...filteredStations].sort((a, b) =>
    (a.distance || Infinity) - (b.distance || Infinity)
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Find Charging Stations in Pune</h1>
        <p className="text-muted-foreground">Locate available charging stations in Pune</p>
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
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setCurrentLocation([pos.coords.latitude, pos.coords.longitude])
                          toast({
                            title: "Location updated",
                            description: "Using your current location",
                          })
                        },
                        (err) => {
                          toast({
                            title: "Location error",
                            description: err.message,
                            variant: "destructive",
                          })
                        }
                      )
                    }}
                  >
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
              {stations
                .filter((station) => favorites.has(station.station_id))
                .map((station) => (
                  <div key={station.station_id} className="flex items-center justify-between">
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
              {stations.filter((station) => favorites.has(station.station_id)).length === 0 && (
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
                stations={sortedStations}
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
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading stations...</p>
                </div>
              ) : sortedStations.length > 0 ? (
                sortedStations.map((station) => (
                  <Card key={station.station_id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{station.name}</h3>
                            {favorites.has(station.station_id) && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                            {station.available_ports > 0 ? (
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
                            {station.distance ? `${station.distance.toFixed(1)} km away` : ''} • {station.location}
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
                              <span className="text-xs">24/7</span>
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
                            disabled={station.available_ports === 0}
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
                {isLoading ? (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">Loading stations...</p>
                  </div>
                ) : sortedStations.length > 0 ? (
                  sortedStations.map((station) => (
                    <Card key={station.station_id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{station.name}</h3>
                            {favorites.has(station.station_id) ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <Star className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              {station.distance ? `${station.distance.toFixed(1)} km away` : ''}
                            </p>
                            {station.available_ports > 0 ? (
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
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-xs">24/7</span>
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
                                if (!token) {
                                  router.push("/login")
                                  return
                                }
                                setBookingStation(station)
                                setBookingConfirmed(false)
                              }}
                              disabled={station.available_ports === 0}
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
                {favorites.has(selectedStation.station_id) ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Star className="h-4 w-4 text-muted-foreground" />
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedStation.location}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Distance</p>
                  <p className="text-sm">{selectedStation.distance ? `${selectedStation.distance.toFixed(1)} km` : 'Unknown'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm">24/7</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm">₹{selectedStation.price}/kWh</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Availability</p>
                  <p className="text-sm">{selectedStation.available_ports}/{selectedStation.total_ports} ports</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Charging Ports</h4>
                <div className="space-y-2">
                  {selectedStation.ports.map((port, index) => (
                    <div key={`${selectedStation.station_id}-port-${index}`} className="flex justify-between items-center p-2 bg-muted rounded-md">
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
                          {port.available} Available
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => toggleFavorite(selectedStation.station_id)}
              >
                <Star className="mr-2 h-4 w-4" />
                {favorites.has(selectedStation.station_id) ? "Remove Favorite" : "Add to Favorites"}
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!token) {
                      router.push("/login")
                      return
                    }
                    setBookingStation(selectedStation)
                    setSelectedStation(null)
                    setBookingConfirmed(false)
                  }}
                  disabled={selectedStation.available_ports === 0}
                >
                  Book Now
                </Button>
                <Button
                  onClick={() => {
                    window.open(`https://maps.google.com/?q=${selectedStation.latitude},${selectedStation.longitude}`, "_blank")
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
                {bookingStation.name} • {bookingStation.location}
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
                  <Label>Port Type</Label>
                  <Select defaultValue={bookingStation.ports[0].type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select port type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingStation.ports.map((port, index) => (
                        <SelectItem
                          key={index}
                          value={port.type}
                          disabled={port.available === 0}
                        >
                          {port.type} ({port.power})
                          {port.available === 0 ? " - Unavailable" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Estimated Cost:</span>
                    <span className="font-bold">₹{((bookingDuration / 60) * 15 * bookingStation.price).toFixed(2)}</span>
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
                    <span>Price:</span>
                    <span>${bookingStation.price}/kWh</span>
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