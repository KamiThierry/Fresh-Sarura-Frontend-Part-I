import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix Leaflet's default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const truckIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md text-white">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const farmIconSelected = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md text-white animate-bounce-short">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const farmIconGray = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// Component to handle bounds
const MapBounds = ({ points }: { points: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points, map]);
    return null;
};

interface RoutePreviewMapProps {
    selectedFarms: string[];
    selectedTruck: string | null;
    allFarms: any[];
    allTrucks: any[];
}

const RoutePreviewMap = ({ selectedFarms, selectedTruck, allFarms, allTrucks }: RoutePreviewMapProps) => {

    // Calculate route points (Truck -> Farms)
    const truckData = allTrucks.find(t => t.id === selectedTruck);
    const selectedFarmData = allFarms.filter(f => selectedFarms.includes(f.id));

    const routePoints: [number, number][] = [];

    // HQ Location (Kigali)
    const HQ_LOCATION: [number, number] = [-1.9441, 30.0619];

    if (truckData && truckData.lat && truckData.lng) {
        routePoints.push([truckData.lat, truckData.lng]);
    }

    selectedFarmData.forEach(f => {
        if (f.lat && f.lng) routePoints.push([f.lat, f.lng]);
    });

    // Return to HQ if route exists
    if (routePoints.length > 0) {
        routePoints.push(HQ_LOCATION);
    }

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0">
            <MapContainer
                center={[-1.9403, 29.8739]}
                zoom={9}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Bounds Controller */}
                {routePoints.length > 0 && <MapBounds points={routePoints} />}

                {/* Route Line */}
                {routePoints.length > 1 && (
                    <Polyline
                        positions={routePoints}
                        color="#3b82f6"
                        weight={4}
                        opacity={0.8}
                        dashArray={[10, 10]}
                    />
                )}

                {/* Farms */}
                {allFarms.map(farm => (
                    <Marker
                        key={farm.id}
                        position={[farm.lat, farm.lng]}
                        icon={selectedFarms.includes(farm.id) ? farmIconSelected : farmIconGray}
                        opacity={selectedFarms.includes(farm.id) ? 1 : 0.6}
                    >
                        <Popup>{farm.farm}</Popup>
                    </Marker>
                ))}

                {/* Selected Truck */}
                {truckData && (
                    <Marker position={[truckData.lat, truckData.lng]} icon={truckIcon}>
                        <Popup>{truckData.driver}</Popup>
                    </Marker>
                )}

            </MapContainer>
        </div>
    );
};

export default RoutePreviewMap;
