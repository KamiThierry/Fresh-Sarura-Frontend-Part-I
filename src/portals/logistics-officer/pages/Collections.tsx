import { useState } from 'react';
import { Truck, MapPin, Search, Filter, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import RoutePreviewMap from '../components/RoutePreviewMap';
import { X, Map as MapIcon } from 'lucide-react';

const HARVEST_DEMAND = [
    { id: '1', farm: 'Simbi Farm A', crop: 'Avocado (Hass)', weight: 2000, status: 'Harvested 4h ago', urgency: 'low', lat: -2.333, lng: 29.650 },
    { id: '2', farm: 'Simbi Farm B', crop: 'Avocado (Fuerte)', weight: 1500, status: 'Harvested 48h ago', urgency: 'high', lat: -2.350, lng: 29.660 },
    { id: '3', farm: 'Kigali Urban Farm', crop: 'Chili (Bird\u2019s Eye)', weight: 500, status: 'Harvested 2h ago', urgency: 'low', lat: -1.970, lng: 30.100 },
];

const FLEET_SUPPLY = [
    { id: 'T1', driver: 'John Mugisha', truck: 'RAC 123 A', type: '5 Ton', capacity: 5000, currentLoad: 0, status: 'Available', lat: -1.950, lng: 30.060 },
    { id: 'T2', driver: 'Peter Nioroge', truck: 'RAB 456 B', type: 'Pickup', capacity: 1000, currentLoad: 0, status: 'Available', lat: -2.300, lng: 29.600 },
    { id: 'T3', driver: 'Sarah Uwase', truck: 'RAC 789 C', type: '5 Ton', capacity: 5000, currentLoad: 2500, status: 'On Trip', lat: -1.500, lng: 30.000 },
];

const Collections = () => {
    const [selectedFarms, setSelectedFarms] = useState<string[]>([]);
    const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
    const [dispatched, setDispatched] = useState(false);

    const toggleFarmSelection = (id: string) => {
        setSelectedFarms(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const handleDiscard = () => {
        setSelectedFarms([]);
        setSelectedTruck(null);
    };

    const totalWeight = selectedFarms.reduce((sum, id) => {
        const farm = HARVEST_DEMAND.find(f => f.id === id);
        return sum + (farm?.weight || 0);
    }, 0);

    const selectedTruckData = FLEET_SUPPLY.find(t => t.id === selectedTruck);
    const isOverweight = selectedTruckData ? totalWeight > selectedTruckData.capacity : false;
    const canDispatch = selectedFarms.length > 0 && selectedTruck && !isOverweight;

    // Mock distance calculation
    const routeDistance = selectedFarms.length > 0 && selectedTruck ? Math.floor(Math.random() * 50) + 10 : 0;

    const handleDispatch = () => {
        setDispatched(true);
        setTimeout(() => {
            setDispatched(false);
            handleDiscard();
            alert(`Dispatch Link sent to ${selectedTruckData?.driver}`);
        }, 2000);
    };

    return (
        <div className="space-y-4 animate-fade-in pb-24 relative min-h-[calc(100vh-100px)] flex flex-col">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collection Dispatch Board</h1>
                    <p className="text-gray-500 dark:text-gray-400">Assign ready harvests to available trucks.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter size={16} />
                        Filter: All Regions
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Truck size={16} />
                        Filter: All Vehicles
                    </button>
                </div>
            </div>

            {/* Main Content Area (Split View) */}
            <div className="flex-1 flex flex-col gap-4 min-h-0">

                {/* Top Section: Lists (Kanban) - 60% Height approx */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[450px] shrink-0">

                    {/* Left Panel: Harvest Demand */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Harvest Demand
                                <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                                    {HARVEST_DEMAND.length}
                                </span>
                            </h2>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                            {HARVEST_DEMAND.map(farm => (
                                <div
                                    key={farm.id}
                                    onClick={() => toggleFarmSelection(farm.id)}
                                    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-2 cursor-pointer transition-all hover:shadow-md
                                        ${selectedFarms.includes(farm.id) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                ${selectedFarms.includes(farm.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                                {selectedFarms.includes(farm.id) && <CheckCircle2 size={14} className="text-white" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{farm.farm}</h3>
                                                <p className="text-sm text-gray-500">{farm.crop}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {(farm.weight).toLocaleString()} kg
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded flex items-center gap-1
                                                        ${farm.urgency === 'high' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                        {farm.urgency === 'high' && <AlertTriangle size={10} />}
                                                        {farm.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Fleet Supply */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Available Trucks
                                <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                                    {FLEET_SUPPLY.filter(t => t.status === 'Available').length}
                                </span>
                            </h2>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                            {FLEET_SUPPLY.map(truck => (
                                <div
                                    key={truck.id}
                                    onClick={() => truck.status === 'Available' && setSelectedTruck(truck.id)}
                                    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-2 transition-all group
                                        ${selectedTruck === truck.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-transparent'}
                                        ${truck.status === 'Available' ? 'cursor-pointer hover:border-gray-200' : 'opacity-60 cursor-not-allowed grayscale'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                                <Truck size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{truck.driver}</h3>
                                                <p className="text-xs text-gray-500">{truck.truck} • {truck.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded font-medium
                                                ${truck.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {truck.status}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Cap: {(truck.capacity).toLocaleString()} kg
                                            </p>
                                        </div>
                                    </div>
                                    {truck.status === 'On Trip' && (
                                        <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-1/2"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Map Preview - Fixed 350px Height */}
                <div className="h-[350px] shrink-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="h-full w-full relative">
                        <div className="absolute top-4 left-4 z-[999] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-bold text-gray-600 flex items-center gap-2">
                            <MapIcon size={14} />
                            Route Preview
                        </div>
                        <RoutePreviewMap
                            selectedFarms={selectedFarms}
                            selectedTruck={selectedTruck}
                            allFarms={HARVEST_DEMAND}
                            allTrucks={FLEET_SUPPLY}
                        />
                    </div>
                </div>

            </div>

            {/* Floating Dispatch Footer */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 transition-all duration-300 transform z-[1000]
                ${(selectedFarms.length > 0 || selectedTruck) ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-700 p-4 flex items-center justify-between">

                    <button
                        onClick={handleDiscard}
                        className="text-red-400 hover:text-red-300 font-bold px-4 py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 mr-4"
                    >
                        <X size={18} />
                        Discard
                    </button>

                    <div className="flex flex-col flex-1 border-l border-gray-700 pl-6 border-r pr-6 mr-4 justify-center">
                        <span className="text-sm font-medium text-gray-300">
                            Planning Trip: <span className="text-white font-bold">{selectedTruckData?.driver || 'Assign Truck...'}</span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span>{selectedFarms.length} Pickups</span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span className={`${isOverweight ? 'text-red-400' : 'text-blue-400'} font-bold`}>
                                Est. Load: {totalWeight.toLocaleString()} kg
                            </span>
                        </span>
                        {isOverweight && (
                            <span className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                <AlertTriangle size={12} />
                                Exceeds Truck Capacity ({(selectedTruckData?.capacity || 0).toLocaleString()} kg)
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleDispatch}
                        disabled={!canDispatch || dispatched}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2
                            ${!canDispatch ? 'bg-gray-700 text-gray-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'}`}
                    >
                        {dispatched ? 'Sending...' : '🚀 Dispatch & Send Link'}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Collections;
