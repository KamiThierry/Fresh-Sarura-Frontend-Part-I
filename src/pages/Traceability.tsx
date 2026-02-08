import { useState } from 'react';
import { Search, MapPin, User, Calendar, ShieldCheck, Box, Thermometer, Plane, Anchor, Download, ArrowDown, ExternalLink, AlertTriangle, FileText, CheckCircle, XCircle, Clock, Printer, FileCheck } from 'lucide-react';

const Traceability = () => {
    const [activeTab, setActiveTab] = useState<'tracer' | 'compliance'>('tracer');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchActive, setSearchActive] = useState(false);

    // Mock Data for "B-2026-001"
    const mockData = {
        batchId: "B-2026-001",
        nodes: [
            {
                id: 'source',
                title: "Origin: Kayonza Farm",
                type: 'source',
                icon: User,
                color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                details: [
                    { label: "Farmer", value: "Jean-Claude" },
                    { label: "Harvest Date", value: "Oct 12, 2025" },
                    { label: "Location", value: "Kayonza Sector (-1.94, 30.65)" },
                ],
                // Enhancement 1: Compliance Badges
                badges: [
                    { label: "GlobalG.A.P. Valid", icon: CheckCircle, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
                    { label: "Rainforest Alliance Expired", icon: AlertTriangle, color: "text-red-600 bg-red-50 dark:bg-red-900/20" }
                ],
                action: { label: "View Farmer Profile", icon: ExternalLink }
            },
            {
                id: 'intake',
                title: "Intake #INT-2026-001 & QC",
                type: 'intake',
                icon: ShieldCheck,
                color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                details: [
                    { label: "Received", value: "Oct 13, 08:30 AM" },
                    { label: "QC Status", value: "Passed (Grade A)", highlight: "text-green-600 font-bold" },
                    { label: "Inspector", value: "Sarah M." },
                ],
                action: { label: "View QC Report", icon: ExternalLink }
            },
            {
                id: 'stock',
                title: "Stock #STK-AVO-26",
                type: 'stock',
                icon: Box,
                color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                details: [
                    { label: "Storage", value: "Cold Room A" },
                    { label: "Avg Temp", value: "4.5°C", icon: Thermometer },
                    { label: "Duration", value: "Held for 3 days" },
                ],
                action: null
            },
            {
                id: 'export',
                title: "Batch #B-2026-001",
                type: 'export',
                icon: Plane,
                color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
                details: [
                    { label: "Client", value: "Nature Pride (Amsterdam)" },
                    { label: "Flight", value: "WB300 (RwandAir)" },
                    { label: "Shipment Date", value: "Oct 16, 2025" },
                ],
                action: { label: "Download Packing List", icon: Download }
            }
        ]
    };

    // Mock Data for Compliance Manager
    const complianceData = {
        alerts: [
            { id: 1, message: "2 Farmer Certificates expiring this week (Jean-Claude, Marie)", type: "critical" },
            { id: 2, message: "Packhouse Hygiene Audit due in 5 days", type: "warning" }
        ],
        certificates: [
            { entity: "Farmer: Jean-Claude", type: "GlobalG.A.P", id: "GGN-12345", status: "Active", expiry: "2026-10-12" },
            { entity: "Packhouse: Kigali Central", type: "SMETA", id: "ZC-98765", status: "Active", expiry: "2025-12-01" },
            { entity: "Farmer: Marie", type: "Organic", id: "ORG-555", status: "Expiring", expiry: "2026-02-10" },
            { entity: "Farmer: Bosco", type: "RWB S-Mark", id: "RWB-999", status: "Pending", expiry: "-" },
        ],
        permits: [
            { name: "NAEB Export License 2026", renewal: "2026-06-30", status: "Active" },
            { name: "Phytosanitary Import Permit (EU)", renewal: "2026-03-15", status: "Active" }
        ]
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim().toUpperCase() === 'B-2026-001') {
            setSearchActive(true);
        } else {
            if (searchTerm.length > 3) setSearchActive(true);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Traceability & Compliance</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track product journeys and manage compliance safeguards.</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center">
                    <button
                        onClick={() => setActiveTab('tracer')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'tracer'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Product Tracer
                    </button>
                    <button
                        onClick={() => setActiveTab('compliance')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'compliance'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Compliance Manager
                    </button>
                </div>
            </div>

            {/* TAB 1: PRODUCT TRACER */}
            {activeTab === 'tracer' && (
                <div className="animate-fade-in">
                    {/* Global Search Hero */}
                    <div className="mb-12 sticky top-5 z-20">
                        <div className="relative max-w-2xl mx-auto shadow-2xl shadow-blue-900/20 rounded-2xl">
                            <form onSubmit={handleSearch} className="relative flex">
                                <div className="relative flex-1">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                                    <input
                                        type="text"
                                        placeholder="Enter Batch ID (e.g., B-2026-001)..."
                                        className="w-full pl-14 pr-4 py-5 rounded-l-2xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 text-lg shadow-sm outline-none dark:text-white transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    Search
                                </button>
                                {/* Enhancement 2: Audit Tools Button */}
                                <button
                                    type="button"
                                    className="hidden md:flex items-center gap-2 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-r-2xl border-l border-gray-200 dark:border-gray-600 transition-colors"
                                >
                                    <Printer size={20} />
                                    <span className="text-sm">Export<br />Audit Rpt</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Empty State */}
                    {!searchActive && (
                        <div className="text-center py-20 text-gray-400 dark:text-gray-600">
                            <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ready to Track</h3>
                            <p className="max-w-md mx-auto">Enter a Batch ID to visualize the complete product journey.</p>
                            <div className="mt-8 flex justify-center gap-3 text-sm">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition" onClick={() => { setSearchTerm('B-2026-001'); setSearchActive(true); }}>Try: B-2026-001</span>
                            </div>
                        </div>
                    )}

                    {/* Journey Visualization */}
                    {searchActive && (
                        <div className="relative max-w-3xl mx-auto animate-fade-in-up">
                            {/* Vertical Line Connector (Absolute centered) */}
                            <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-orange-500 opacity-30 dark:opacity-50 hidden md:block"></div>

                            <div className="space-y-8">
                                {mockData.nodes.map((node, index) => {
                                    const Icon = node.icon;
                                    return (
                                        <div key={node.id} className="relative flex flex-col md:flex-row gap-6 group">
                                            {/* Icon / Node Marker */}
                                            <div className="flex-shrink-0 relative z-10 flex flex-col items-center md:items-start">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300 ${node.color} border-4 border-white dark:border-gray-900`}>
                                                    <Icon size={32} />
                                                </div>
                                                {/* Mobile Connector */}
                                                {index !== mockData.nodes.length - 1 && (
                                                    <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 my-2 md:hidden"></div>
                                                )}
                                            </div>

                                            {/* Content Card */}
                                            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                            {node.title}
                                                        </h3>
                                                        <span className="text-xs font-mono text-gray-400">Step {index + 1}</span>
                                                    </div>

                                                    {/* Enhancement 1: Compliance Badges */}
                                                    {node.badges && (
                                                        <div className="flex flex-col gap-1 items-end">
                                                            {node.badges.map((badge, idx) => (
                                                                <span key={idx} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-current ${badge.color}`}>
                                                                    <badge.icon size={12} />
                                                                    {badge.label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm mb-5">
                                                    {node.details.map((detail, i) => (
                                                        <div key={i} className="flex flex-col">
                                                            <span className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{detail.label}</span>
                                                            <span className={`font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5 ${detail.highlight || ''}`}>
                                                                {detail.icon && <detail.icon size={14} />} {detail.value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {node.action && (
                                                    <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">
                                                        <node.action.icon size={16} />
                                                        {node.action.label}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* End Marker */}
                            <div className="flex items-center gap-3 mt-8 md:pl-20 text-gray-400 justify-center md:justify-start">
                                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <span className="text-xs font-semibold uppercase tracking-widest">Journey Complete</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: COMPLIANCE MANAGER */}
            {activeTab === 'compliance' && (
                <div className="space-y-8 animate-fade-in">

                    {/* Section A: Expiry Alerts */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-red-500 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <AlertTriangle size={120} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <AlertTriangle className="text-red-500" size={20} />
                                Critical ACTION REQUIRED
                            </h3>
                            <div className="space-y-3">
                                {complianceData.alerts.map((alert) => (
                                    <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${alert.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'}`}>
                                        {alert.type === 'critical' ? <XCircle size={18} className="mt-0.5" /> : <Clock size={18} className="mt-0.5" />}
                                        <span className="font-medium text-sm">{alert.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Section B: Certification Matrix */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Certification Matrix</h3>
                                    <p className="text-xs text-gray-500">Monitor active certificates across the supply chain.</p>
                                </div>
                                <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3">Entity</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">ID Number</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Expiry</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {complianceData.certificates.map((cert, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cert.entity}</td>
                                                <td className="px-6 py-4">{cert.type}</td>
                                                <td className="px-6 py-4 font-mono text-gray-500">{cert.id}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${cert.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        cert.status === 'Expiring' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                        {cert.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{cert.expiry}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section C: Export Permits */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileCheck size={18} className="text-blue-500" />
                                Export Permits
                            </h3>
                            <div className="space-y-4">
                                {complianceData.permits.map((permit, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{permit.name}</h4>
                                            <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock size={12} />
                                            <span>Renews: <span className="font-mono text-gray-700 dark:text-gray-300">{permit.renewal}</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                + Add New Permit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Traceability;
