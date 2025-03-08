import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const chargingStations = [
    { id: 1, lat: 18.5204, lng: 73.8567, name: "Station 1" },
    { id: 2, lat: 18.5314, lng: 73.8446, name: "Station 2" },
    { id: 3, lat: 18.5029, lng: 73.8217, name: "Station 3" }
];

const Map = () => {
    return (
        <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ height: "100vh", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {chargingStations.map(station => (
                <Marker key={station.id} position={[station.lat, station.lng]}>
                    <Popup>{station.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
