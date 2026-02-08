import { useState } from 'react';
import {
    Search, Filter, Download, Plus, MoreHorizontal,
    Package, DollarSign, Layers,
    Leaf, ArrowRight, Printer
} from 'lucide-react';
import LogIntakeForm from '../components/LogIntakeForm';
import QCSortingDrawer from '../components/QCSortingDrawer';
import CreateExportBatchDrawer from '../components/CreateExportBatchDrawer';

const InventoryManagement = () => {
    // Tab State: 'intake' | 'inventory' | 'export'
    const [activeTab, setActiveTab] = useState('active_inventory');

    // Drawer States
    const [isIntakeOpen, setIsIntakeOpen] = useState(false);
    const [isQCOpen, setIsQCOpen] = useState(false);
    const [isExportBatchOpen, setIsExportBatchOpen] = useState(false);

    // Selected Item States
    const [selectedIntakeId, setSelectedIntakeId] = useState('');

    const summaryStats = [
        { label: 'Total Stock', value: '14.2 Tons', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Raw Intake (Today)', value: '1,550 kg', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Value in Stock', value: '$28,900', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Active Exports', value: '3 Batches', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
    ];

    // --- MOCK DATA ---

    // Tab 1: Intake (Receiving)
    const intakeItems = [
        { id: 'INT-2026-001', arrival: 'Today, 08:30 AM', farmer: 'Kinvest Farm', produce: 'Avocados', weight: '1,200 kg', status: 'Pending QC' },
        { id: 'INT-2026-002', arrival: 'Today, 10:15 AM', farmer: 'Jean Claude', produce: 'French Beans', weight: '350 kg', status: 'Pending QC' },
        { id: 'INT-2026-003', arrival: 'Yesterday, 04:00 PM', farmer: 'Cooperative A', produce: 'Chili', weight: '400 kg', status: 'Approved' },
    ];

    // Tab 2: Inventory (Stock)
    const inventoryItems = [
        { id: 'STK-AVO-26', produce: 'Avocados (Hass)', grade: 'A', weight: '4,200 kg', location: 'Cold Room A', temp: '4.2°C', status: 'Available', freshness: 95 },
        { id: 'STK-AVO-27', produce: 'Avocados (Hass)', grade: 'B', weight: '1,500 kg', location: 'Cold Room B', temp: '4.5°C', status: 'Reserved', freshness: 88 },
        { id: 'STK-CHI-12', produce: 'Bird Eye Chili', grade: 'A', weight: '600 kg', location: 'Ambient', temp: '18°C', status: 'Available', freshness: 92 },
        { id: 'STK-MAN-05', produce: 'Mangoes (Apple)', grade: 'A', weight: '2,100 kg', location: 'Cold Room A', temp: '5.0°C', status: 'Allocated', freshness: 75 },
    ];

    // Tab 3: Export Batches
    const exportBatches = [
        { id: 'B-2026-001', client: 'Nature Pride', dest: 'Rotterdam, NL', composition: 'Avocado (Grade A) - 1.2T', date: 'Jan 29', status: 'Planned' },
        { id: 'B-2026-002', client: 'Carrefour UAE', dest: 'Dubai, UAE', composition: 'Mangoes - 800kg', date: 'Feb 02', status: 'Packing' },
    ];

    // Tab 4: Recent Activity
    const activityItems = [
        { id: 'ACT-001', time: '10:45 AM', type: 'Stock Adjustment', description: 'Removed spoiled avocados from Cold Room A', impact: '- 12kg', impactType: 'negative', user: 'John (Manager)' },
        { id: 'ACT-002', time: '10:30 AM', type: 'QC Inspection', description: 'Graded Intake #INT-2026-001', impact: '+ 1,200kg Stock', impactType: 'positive', user: 'Sarah M. (QC)' },
        { id: 'ACT-003', time: '09:15 AM', type: 'Intake Logged', description: 'Received Raw Beans from Kinvest', impact: '+ 1,250kg Raw', impactType: 'positive', user: 'Gate Clerk' },
        { id: 'ACT-004', time: 'Yesterday', type: 'Export Batch', description: 'Allocated stock to Order #ORD-005', impact: '- 500kg Stock', impactType: 'negative', user: 'System (Auto)' },
    ];

    // --- HANDLERS ---

    const handlePerformQC = (intakeId: string) => {
        setSelectedIntakeId(intakeId);
        setIsQCOpen(true);
    };

    return (
        <div className="space-y-6 pb-20">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory & Batch Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track intake, stock, and export allocation.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Download size={18} />
                        Export Report
                    </button>
                    <button
                        onClick={() => setIsIntakeOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Log Raw Intake
                    </button>
                    <button
                        onClick={() => setIsExportBatchOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Create Export Batch
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6">
                {summaryStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <div className={`text-2xl font-bold mt-1 ${stat.color.replace('text-', 'text-gray-900 dark:text-white ')}`}>
                                    {stat.value}
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[400px]">

                {/* Table Header & Controls */}
                <div className="border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between p-4">

                        {/* 3-Lifecycle Tabs */}
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('intake')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'intake'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                Intake (Receiving)
                            </button>
                            <button
                                onClick={() => setActiveTab('active_inventory')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'active_inventory'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                Inventory (Stock)
                            </button>
                            <button
                                onClick={() => setActiveTab('export_batches')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'export_batches'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                Export Batches
                            </button>
                            <button
                                onClick={() => setActiveTab('recent_activity')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'recent_activity'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                Recent Activity
                            </button>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- TAB 1: INTAKE VIEW --- */}
                {activeTab === 'intake' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <th className="px-6 py-4">Intake ID</th>
                                    <th className="px-6 py-4">Arrival Time</th>
                                    <th className="px-6 py-4">Farmer / Source</th>
                                    <th className="px-6 py-4">Crop</th>
                                    <th className="px-6 py-4">Gross Weight</th>
                                    <th className="px-6 py-4">QC Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {intakeItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-gray-700 dark:text-gray-300">{item.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.arrival}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.farmer}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.produce}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">{item.weight}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Pending QC' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'Pending QC' && (
                                                <button
                                                    onClick={() => handlePerformQC(item.id)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                                >
                                                    Perform QC <ArrowRight size={12} className="ml-1" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- TAB 2: INVENTORY VIEW --- */}
                {activeTab === 'active_inventory' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <th className="px-6 py-4">Stock ID</th>
                                    <th className="px-6 py-4">Produce</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Available Weight</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Avg Temp</th>
                                    <th className="px-6 py-4">Freshness</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {inventoryItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-gray-700 dark:text-gray-300">{item.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.produce}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${item.grade === 'A' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                Grade {item.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">{item.weight}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.temp}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1" title={`${item.freshness}% Freshness`}>
                                                {[1, 2, 3, 4, 5].map((dot) => (
                                                    <div
                                                        key={dot}
                                                        className={`w-2 h-2 rounded-full ${(item.freshness / 20) >= dot
                                                            ? 'bg-green-500'
                                                            : 'bg-gray-200 dark:bg-gray-700'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Available' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                item.status === 'Reserved' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                    'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- TAB 3: EXPORT BATCHES VIEW --- */}
                {activeTab === 'export_batches' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <th className="px-6 py-4">Batch ID</th>
                                    <th className="px-6 py-4">Client / Destination</th>
                                    <th className="px-6 py-4">Composition</th>
                                    <th className="px-6 py-4">Shipment Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {exportBatches.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-gray-700 dark:text-gray-300">{item.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.client}</span>
                                                <span className="text-xs text-gray-500">{item.dest}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.composition}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                                <Printer size={16} /> Print Labels
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- TAB 4: RECENT ACTIVITY VIEW --- */}
                {activeTab === 'recent_activity' && (
                    <div className="flex flex-col">
                        {/* Search Bar for Activity */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Activities..."
                                    className="pl-9 pr-4 py-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Activity</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Impact</th>
                                        <th className="px-6 py-4">Performed By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {activityItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                {item.time}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.type === 'Intake Logged' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                        item.type === 'QC Inspection' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            item.type === 'Stock Adjustment' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                                                'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                {item.description}
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-bold ${item.impactType === 'positive'
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-500 dark:text-red-400'
                                                }`}>
                                                {item.impact}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {item.user}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* --- DRAWERS --- */}

            {/* Drawer 1: Log Intake */}
            <LogIntakeForm
                isOpen={isIntakeOpen}
                onClose={() => setIsIntakeOpen(false)}
                onSubmit={() => setIsIntakeOpen(false)}
            />

            {/* Drawer 2: QC & Sorting */}
            <QCSortingDrawer
                isOpen={isQCOpen}
                onClose={() => setIsQCOpen(false)}
                intakeId={selectedIntakeId}
                onConfirm={() => {
                    // Logic to move item from Intake -> Inventory
                    setIsQCOpen(false);
                }}
            />

            {/* Drawer 3: Create Export Batch */}
            <CreateExportBatchDrawer
                isOpen={isExportBatchOpen}
                onClose={() => setIsExportBatchOpen(false)}
                onSuccess={() => {
                    // Logic to create batch from Inventory
                    setActiveTab('export_batches'); // Switch to exports tab
                }}
            />

        </div>
    );
};

export default InventoryManagement;
