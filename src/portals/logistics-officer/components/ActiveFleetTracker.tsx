import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Navigation, Truck, MapPin, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix Leaflet's default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Truck Icon (using a DivIcon for simplicity or a custom image)
const truckIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md text-white">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const farmIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md text-white">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});


const ActiveFleetTracker = () => {
    const TRIPS = [
        { id: '101', title: 'Simbi Farm Pickup', status: 'Loading', driver: 'John (Truck A)', color: 'bg-yellow-500', lat: -2.333, lng: 29.650 }, // Near Huye
        { id: '102', title: 'Kigali Transfer', status: 'En Route', driver: 'Peter (Truck B)', color: 'bg-blue-500', lat: -1.970, lng: 30.100 }, // Near Kigali
    ];

    const farmLocation = { lat: -2.333, lng: 29.650, title: 'Simbi Farm' };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden h-[450px] relative group flex flex-col">

            {/* Map Container */}
            <div className="flex-1 relative z-0">
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

                    {/* Truck Markers */}
                    {TRIPS.map(trip => (
                        <Marker key={trip.id} position={[trip.lat, trip.lng]} icon={truckIcon}>
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-sm">{trip.title}</h3>
                                    <p className="text-xs text-gray-600">Driver: {trip.driver}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trip.status === 'Loading' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {trip.status}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Farm Marker */}
                    <Marker position={[farmLocation.lat, farmLocation.lng]} icon={farmIcon}>
                        <Popup>{farmLocation.title}</Popup>
                    </Marker>

                </MapContainer>

                {/* Floating Top-Right Overlay Panel */}
                <div className="absolute top-4 right-4 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-[999]">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                        <Navigation size={16} className="text-blue-600" />
                        Active Trips
                    </h3>

                    <div className="space-y-3">
                        {TRIPS.map((trip) => (
                            <div key={trip.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer text-left">
                                <div className={`mt-1.5 w-2 h-2 rounded-full ${trip.color}`}></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{trip.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                        <span className={`font-medium ${trip.status === 'Loading' ? 'text-yellow-600' : 'text-blue-600'}`}>
                                            {trip.status}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Truck size={10} /> {trip.driver}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map Footer / Controls */}
            <div className="bg-white dark:bg-gray-800 p-3 border-t border-gray-100 dark:border-gray-700 flex justify-center sticky bottom-0 z-10">
                <Link to="/logistics/collections" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 px-4 py-2 rounded-lg transition-colors">
                    <ExternalLink size={16} />
                    Open Full Route Map
                </Link>
            </div>
        </div>
    );
};

export default ActiveFleetTracker;
