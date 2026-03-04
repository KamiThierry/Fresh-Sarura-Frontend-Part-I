import { useState } from 'react';
import { Database, Leaf, CheckCircle, Archive, Clock, Search, Plus, MoreHorizontal, MapPin, Home, Truck, Plane, Shield, AlertCircle, Award } from 'lucide-react';

const MOCK_CROPS = [
    { id: 'CROP-001', name: 'Avocados (Hass)', category: 'Fruit', baseUnit: 'Kilograms (kg)', status: 'Active' },
    { id: 'CROP-002', name: 'French Beans', category: 'Vegetable', baseUnit: 'Kilograms (kg)', status: 'Active' },
    { id: 'CROP-003', name: 'Passion Fruit', category: 'Fruit', baseUnit: 'Kilograms (kg)', status: 'Inactive' },
];

const MOCK_LOCATIONS = [
    { id: 'LOC-001', name: 'Kigali Central Packhouse', type: 'Processing Hub', district: 'Gasabo', capacity: '50 Tons/Day', status: 'Active' },
    { id: 'LOC-002', name: 'Gahara Collection Center', type: 'Consolidation', district: 'Kirehe', capacity: '15 Tons/Day', status: 'Active' },
    { id: 'LOC-003', name: 'Kigali International (KGL)', type: 'Export Hub', district: 'Kicukiro', capacity: 'Logistics', status: 'Active' },
];

const MOCK_CERTIFICATIONS = [
    { id: 'CERT-001', name: 'GlobalG.A.P. IFA', issuingBody: 'FoodPLUS GmbH', cycle: 'Annual', requirement: 'Mandatory (EU)', status: 'Active' },
    { id: 'CERT-002', name: 'Organic (EU)', issuingBody: 'Ecocert', cycle: 'Annual', requirement: 'Voluntary', status: 'Active' },
    { id: 'CERT-003', name: 'RWB S-Mark', issuingBody: 'RSB Rwanda', cycle: 'Bi-Annual', requirement: 'Mandatory (Local)', status: 'Active' },
];

const MasterData = () => {
    const [activeTab, setActiveTab] = useState('crop_varieties');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCrops = MOCK_CROPS.filter(crop =>
        crop.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredLocations = MOCK_LOCATIONS.filter(loc =>
        loc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCerts = MOCK_CERTIFICATIONS.filter(cert =>
        cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuingBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.requirement.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const kpiCards = [
        { label: 'Total Crops', value: filteredCrops.length.toString(), icon: Leaf, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Active Varieties', value: filteredCrops.filter(c => c.status === 'Active').length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Archived/Inactive', value: filteredCrops.filter(c => c.status === 'Inactive').length.toString(), icon: Archive, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
        { label: 'Recent Updates', value: '3', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    ];

    const facilityKpis = [
        { label: 'Total Facilities', value: filteredLocations.length.toString(), icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Packhouses', value: filteredLocations.filter(l => l.type.includes('Processing') || l.type.includes('Packhouse')).length.toString(), icon: Home, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Collection Centers', value: filteredLocations.filter(l => l.type.includes('Consolidation') || l.type.includes('Collection')).length.toString(), icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Airports/Ports', value: filteredLocations.filter(l => l.type.includes('Export') || l.type.includes('Airport') || l.type.includes('Port')).length.toString(), icon: Plane, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    const certKpis = [
        { label: 'Total Standards', value: filteredCerts.length.toString(), icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Mandatory (Export)', value: filteredCerts.filter(c => c.requirement.includes('Mandatory')).length.toString(), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Voluntary', value: filteredCerts.filter(c => c.requirement.includes('Voluntary')).length.toString(), icon: Award, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Deprecated', value: filteredCerts.filter(c => c.status === 'Inactive' || c.status === 'Deprecated').length.toString(), icon: Archive, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
    ];

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                    <Database size={22} />
                </div>
                <div>
                    <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">Master Data</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage master entities, crops, and locations</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                {[
                    { id: 'crop_varieties', label: 'Crop Varieties' },
                    { id: 'locations_facilities', label: 'Locations & Facilities' },
                    { id: 'certifications', label: 'Certifications' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === tab.id
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-400 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* KPI Ribbon (Crops Tab) */}
            {activeTab === 'crop_varieties' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {kpiCards.map((card, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {card.value}
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Search & Action Row */}
            {activeTab === 'crop_varieties' && (
                <div className="flex justify-between items-center mb-4 gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Q Search crops..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                        <Plus size={16} />
                        Add Record
                    </button>
                </div>
            )}

            {/* Data Table */}
            {activeTab === 'crop_varieties' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-visible">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crop ID</th>
                                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crop Name</th>
                                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Unit</th>
                                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {filteredCrops.map(crop => (
                                <tr key={crop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-5 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">{crop.id}</td>
                                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{crop.name}</td>
                                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{crop.category}</td>
                                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{crop.baseUnit}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${crop.status === 'Active'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                            {crop.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="relative inline-block text-left group">
                                            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    Edit Record
                                                </button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
                                                    Deactivate/Archive
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- LOCATIONS & FACILITIES TAB --- */}
            {activeTab === 'locations_facilities' && (
                <>
                    {/* KPI Ribbon */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {facilityKpis.map((card, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {card.value}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <card.icon className={card.color} size={24} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search & Action Row */}
                    <div className="flex justify-between items-center mb-4 gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search facilities, districts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                            <Plus size={16} />
                            Add Facility
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-visible">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Facility ID</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">District</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity/Role</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {filteredLocations.map(loc => (
                                    <tr key={loc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-5 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">{loc.id}</td>
                                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{loc.name}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{loc.type}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{loc.district}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{loc.capacity}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${loc.status === 'Active'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {loc.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="relative inline-block text-left group">
                                                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                                    <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        Edit Record
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
                                                        Deactivate/Archive
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* --- CERTIFICATIONS TAB --- */}
            {activeTab === 'certifications' && (
                <>
                    {/* KPI Ribbon */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {certKpis.map((card, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {card.value}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <card.icon className={card.color} size={24} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search & Action Row */}
                    <div className="flex justify-between items-center mb-4 gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search compliance standards..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                            <Plus size={16} />
                            Add Standard
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-visible">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Standard ID</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issuing Body</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cycle</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requirement</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {filteredCerts.map(cert => (
                                    <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-5 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">{cert.id}</td>
                                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{cert.name}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{cert.issuingBody}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{cert.cycle}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${cert.requirement.includes('Mandatory')
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {cert.requirement}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${cert.status === 'Active'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {cert.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="relative inline-block text-left group">
                                                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                                    <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        Edit Record
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
                                                        Deactivate/Archive
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default MasterData;
