import { Scale, Truck, Plane, FileWarning, Plus } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logistics Operations</h1>
                    <p className="text-gray-500 dark:text-gray-400">Overview of active collections, shipments, and fleet status.</p>
                </div>
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-green-900/20">
                    <Plus size={18} />
                    New Shipment
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Weekly Volume */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Volume</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">18.5 <span className="text-sm font-medium text-gray-500">Tons</span></h3>
                    </div>
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                        <Scale size={20} />
                    </div>
                </div>

                {/* Active Collections */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Collections</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4 Trucks</h3>
                        <p className="text-xs text-green-600 font-medium mt-1">En Route</p>
                    </div>
                    <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                        <Truck size={20} />
                    </div>
                </div>

                {/* Export Shipments */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Export Shipments</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3 Departed</h3>
                        <p className="text-xs text-orange-600 font-medium mt-1">2 Pending</p>
                    </div>
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                        <Plane size={20} />
                    </div>
                </div>

                {/* Pending Documents */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Docs</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5 Invoices</h3>
                        <p className="text-xs text-amber-600 font-medium mt-1">Action Required</p>
                    </div>
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                        <FileWarning size={20} />
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Active Operations Map) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 min-h-[400px] flex items-center justify-center">
                    <div className="text-center text-gray-400 dark:text-gray-500">
                        <Truck size={48} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Active Operations Map</p>
                        <p className="text-sm opacity-60">Coming Soon</p>
                    </div>
                </div>

                {/* Right Column (Recent Alerts) */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 min-h-[400px] flex items-center justify-center">
                    <div className="text-center text-gray-400 dark:text-gray-500">
                        <FileWarning size={48} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Recent Alerts</p>
                        <p className="text-sm opacity-60">Coming Soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
