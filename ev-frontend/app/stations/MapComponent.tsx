"use client"

import { useState, useEffect } from "react"
import { Icon } from 'leaflet'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Zap, X, MapPin } from "lucide-react"

// Fix for default marker icons
const DefaultIcon = new Icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

if (typeof window !== 'undefined') {
  L.Marker.prototype.options.icon = DefaultIcon
}

// Base64 encoded SVG icons
const userLocationIconSVG = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
    <circle cx="12" cy="12" r="10" />
  </svg>
`)}`

const chargingStationIconSVG = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981">
    <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
  </svg>
`)}`

const busyStationIconSVG = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444">
    <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
  </svg>
`)}`

const UserLocationIcon = new Icon({
  iconUrl: userLocationIconSVG,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

const AvailableStationIcon = new Icon({
  iconUrl: chargingStationIconSVG,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const BusyStationIcon = new Icon({
  iconUrl: busyStationIconSVG,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface Port {
  id: number
  type: string
  power: string
  available: number
  pricePerKwh: number
}

interface ChargingStation {
  station_id: number
  name: string
  location: string
  latitude: number
  longitude: number
  price: number
  available_ports: number
  total_ports: number
  ports: Port[]
  isFavorite?: boolean
  distance?: number
}

type LiveLocationMarkerProps = {
  currentLocation: [number, number] | null
}

const LiveLocationMarker = ({ currentLocation }: LiveLocationMarkerProps) => {
  const map = useMap()

  useEffect(() => {
    if (currentLocation && map) {
      map.setView(currentLocation, 16)
    }
  }, [currentLocation, map])

  if (!currentLocation) return null

  return (
    <Marker position={currentLocation} icon={UserLocationIcon}>
      <Popup>Your current location</Popup>
    </Marker>
  )
}

type MapComponentProps = {
  stations: ChargingStation[]
  setSelectedStation: (station: ChargingStation) => void
  currentLocation: [number, number] | null
  setCurrentLocation: (location: [number, number] | null) => void
}

export default function MapComponent({ 
  stations, 
  setSelectedStation,
  currentLocation,
  setCurrentLocation
}: MapComponentProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Pune coordinates as fallback
    const puneLocation: [number, number] = [18.5204, 73.8567]
    
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords
      setCurrentLocation([latitude, longitude])
      setMapLoaded(true)
      setGeoError(null)
    }

    const handleError = (error: GeolocationPositionError) => {
      console.error("Geolocation error:", error.message)
      setGeoError(error.message)
      setCurrentLocation(puneLocation)
      setMapLoaded(true)
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      )

      return () => {
        navigator.geolocation.clearWatch(watchId)
      }
    } else {
      setGeoError("Geolocation is not supported by your browser")
      setCurrentLocation(puneLocation)
      setMapLoaded(true)
    }
  }, [setCurrentLocation])

  return (
    <div className="h-[400px] bg-gray-100 relative">
      {!mapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {geoError && (
            <div className="absolute top-2 left-2 z-[1000] bg-yellow-100 text-yellow-800 p-2 rounded-md text-sm">
              Location error: Using default Pune location
            </div>
          )}
          <MapContainer 
            center={currentLocation || [18.5204, 73.8567]}
            zoom={16} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <LiveLocationMarker currentLocation={currentLocation} />
            
            {stations?.map((station) => (
              <Marker
                key={station.station_id}
                position={[station.latitude, station.longitude]}
                icon={station.available_ports > 0 ? AvailableStationIcon : BusyStationIcon}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup className="min-w-[200px]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {station.available_ports > 0 ? (
                        <Zap className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                      <h3 className="font-medium">{station.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{station.location}</span>
                    </div>
                    <div className="text-sm">
                      <p>Available: {station.available_ports}/{station.total_ports} ports</p>
                      <p>Price: ₹{station.price}/kWh</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {station.ports.map(port => (
                        <div key={port.id} className="flex items-center gap-1">
                          <span>{port.type}:</span>
                          <span className={port.available > 0 ? "text-green-600" : "text-red-600"}>
                            {port.available} available
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
    </div>
  )
}