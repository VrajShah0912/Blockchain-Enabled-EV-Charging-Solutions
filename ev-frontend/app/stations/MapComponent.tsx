"use client"

import { useState, useEffect } from "react"
import { Icon } from 'leaflet'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Zap, X } from "lucide-react"

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

const UserLocationIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

type Station = {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  ports: {
    available: number
    type: string
  }[]
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
  sortedStations: Station[]
  setSelectedStation: (station: Station) => void
  currentLocation: [number, number] | null
  setCurrentLocation: (location: [number, number] | null) => void
}

export default function MapComponent({ 
  sortedStations, 
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
      // Use Pune as fallback location
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
      // Browser doesn't support Geolocation
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
            center={currentLocation || [18.5204, 73.8567]} // Pune coordinates as fallback
            zoom={16} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <LiveLocationMarker currentLocation={currentLocation} />
            
            {sortedStations.map((station) => (
              <Marker
                key={station.id}
                position={[station.coordinates.lat, station.coordinates.lng]}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup>
                  <div className="flex items-center gap-1">
                    {station.ports.some(port => port.available > 0) ? (
                      <Zap className="inline-block h-4 w-4 text-green-600" />
                    ) : (
                      <X className="inline-block h-4 w-4 text-red-600" />
                    )}
                    <span>{station.name}</span>
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