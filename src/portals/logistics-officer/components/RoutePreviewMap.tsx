import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker, ZoomControl, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// ── HQ Packhouse location (Kigali) ──────────────────────────────────────────
const HQ: [number, number] = [-1.9441, 30.0619];

// ── Custom HQ marker (blue pulsing div icon) ─────────────────────────────────
const hqIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `
        <div style="
            width:36px;height:36px;
            background:#2563eb;
            border-radius:50%;
            border:3px solid white;
            box-shadow:0 0 0 4px rgba(37,99,235,0.3), 0 2px 8px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
        ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
        </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

// ── Color + radius helpers ───────────────────────────────────────────────────
const getMarkerColor = (urgency: string): string => {
    if (urgency === 'high') return '#ef4444';   // red  — delayed
    if (urgency === 'medium') return '#f59e0b'; // yellow — en route
    return '#22c55e';                           // green — harvest ready
};

const getRadius = (weight: number): number => {
    // Scale between 10 and 28 px
    const min = 500, max = 5000;
    const clamped = Math.min(Math.max(weight, min), max);
    return 10 + ((clamped - min) / (max - min)) * 18;
};

// ── Auto-fit bounds to all visible points ────────────────────────────────────
const MapBounds = ({ points }: { points: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (points.length > 0) {
            map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
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

const LEGEND_ITEMS = [
    { color: '#22c55e', label: 'Harvest Ready' },
    { color: '#f59e0b', label: 'En Route' },
    { color: '#ef4444', label: 'Pickup Delayed' },
    { color: '#2563eb', label: 'Main Packhouse (HQ)' },
];

const RoutePreviewMap = ({ selectedFarms, selectedTruck, allFarms, allTrucks }: RoutePreviewMapProps) => {
    const truckData = allTrucks.find(t => t.id === selectedTruck);
    const selectedFarmData = allFarms.filter(f => selectedFarms.includes(f.id));

    // Build an ordered route: truck → each selected farm → HQ
    const routePoints: [number, number][] = [];
    if (truckData?.lat) routePoints.push([truckData.lat, truckData.lng]);
    selectedFarmData.forEach(f => { if (f.lat) routePoints.push([f.lat, f.lng]); });
    if (routePoints.length > 0) routePoints.push(HQ);

    // All map points for auto-fit (all farms + HQ)
    const allPoints: [number, number][] = [
        ...allFarms.filter(f => f.lat).map(f => [f.lat, f.lng] as [number, number]),
        HQ,
    ];

    return (
        <div className="h-full w-full rounded-xl overflow-hidden relative z-0">

            <MapContainer
                center={[-1.9403, 29.8739]}
                zoom={8}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                {/* Base tile — OpenStreetMap */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Zoom control — top-left */}
                <ZoomControl position="topleft" />

                {/* Auto-fit to all farm points */}
                <MapBounds points={allPoints} />

                {/* ── Dashed route polyline ───────────────────────────── */}
                {routePoints.length > 1 && (
                    <Polyline
                        positions={routePoints}
                        pathOptions={{
                            color: '#3b82f6',
                            weight: 3,
                            opacity: 0.75,
                            dashArray: '10 8',
                        }}
                    />
                )}

                {/* ── Farm circle markers ─────────────────────────────── */}
                {allFarms.map(farm => {
                    const color = getMarkerColor(farm.urgency ?? 'low');
                    const radius = getRadius(farm.weight ?? 1000);
                    const isSelected = selectedFarms.includes(farm.id);

                    return (
                        <CircleMarker
                            key={farm.id}
                            center={[farm.lat, farm.lng]}
                            radius={radius}
                            pathOptions={{
                                fillColor: color,
                                color: 'white',
                                weight: isSelected ? 3 : 2,
                                opacity: 1,
                                fillOpacity: isSelected ? 0.95 : 0.65,
                            }}
                        >
                            {/* Hover tooltip */}
                            <Tooltip direction="top" offset={[0, -radius]} sticky>
                                <span className="font-semibold">{farm.farm ?? farm.destination}</span>
                            </Tooltip>

                            {/* Click popup */}
                            <Popup>
                                <div style={{ minWidth: 180 }}>
                                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                                        {farm.farm ?? farm.destination}
                                    </p>
                                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
                                        🌾 {farm.crop ?? farm.flight ?? '—'}
                                    </p>
                                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                                        ⚖️ {(farm.weight ?? farm.weight ?? 0).toLocaleString()} kg
                                    </p>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 8px',
                                        borderRadius: 9999,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        backgroundColor: color + '22',
                                        color: color,
                                        border: `1px solid ${color}55`,
                                    }}>
                                        {farm.status ?? 'Waiting for assignment'}
                                    </span>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}

                {/* ── HQ Packhouse marker ─────────────────────────────── */}
                <Marker position={HQ} icon={hqIcon}>
                    <Tooltip direction="top" offset={[0, -20]} permanent={false}>
                        <span className="font-semibold">Kigali Packhouse (HQ)</span>
                    </Tooltip>
                    <Popup>
                        <div style={{ minWidth: 160 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🏭 Kigali Packhouse</p>
                            <p style={{ fontSize: 12, color: '#6b7280' }}>Main sorting &amp; cold storage facility</p>
                        </div>
                    </Popup>
                </Marker>

                {/* ── Selected truck marker ───────────────────────────── */}
                {truckData?.lat && (
                    <CircleMarker
                        center={[truckData.lat, truckData.lng]}
                        radius={14}
                        pathOptions={{
                            fillColor: '#0ea5e9',
                            color: 'white',
                            weight: 3,
                            fillOpacity: 0.95,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -16]} sticky>
                            <span className="font-semibold">🚛 {truckData.driver}</span>
                        </Tooltip>
                        <Popup>
                            <div style={{ minWidth: 160 }}>
                                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🚛 {truckData.driver}</p>
                                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>{truckData.truck} · {truckData.type}</p>
                                <p style={{ fontSize: 12, color: '#6b7280' }}>
                                    Cap: {(truckData.capacity).toLocaleString()} kg
                                </p>
                            </div>
                        </Popup>
                    </CircleMarker>
                )}

            </MapContainer>

            {/* ── Floating Legend (bottom-right) ──────────────────────── */}
            <div style={{
                position: 'absolute',
                bottom: 24,
                right: 12,
                zIndex: 1000,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 12,
                padding: '10px 14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                minWidth: 170,
            }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Route Status
                </p>
                {LEGEND_ITEMS.map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{
                            display: 'inline-block',
                            width: 12, height: 12,
                            borderRadius: '50%',
                            background: item.color,
                            flexShrink: 0,
                            border: '2px solid white',
                            boxShadow: `0 0 0 1px ${item.color}66`,
                        }} />
                        <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{item.label}</span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default RoutePreviewMap;
