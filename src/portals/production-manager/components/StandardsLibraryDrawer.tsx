import { useState } from 'react';
import { X, Search, FileText, Download, Globe, ShieldCheck, AlertTriangle } from 'lucide-react';

interface StandardsLibraryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const StandardsLibraryDrawer = ({ isOpen, onClose }: StandardsLibraryDrawerProps) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('eu');
    const [searchQuery, setSearchQuery] = useState('');

    const standards = {
        eu: [
            {
                id: 'EU-001',
                crop: 'French Beans',
                market: 'EU Class 1',
                requirements: [
                    { label: 'Max Curvature', value: '10mm (1cm per 10cm length)' },
                    { label: 'Diameter', value: '6mm - 9mm (Fine)' },
                    { label: 'Pesticide MRL', value: 'Strict < 0.01 mg/kg' },
                ],
                alert: 'Zero tolerance for Thrips'
            },
            {
                id: 'EU-002',
                crop: 'Bird Eye Chili',
                market: 'EU Standard',
                requirements: [
                    { label: 'Coloration', value: 'Uniform Red (90% min)' },
                    { label: 'Stem', value: 'Must be attached & green' },
                    { label: 'MRL Details', value: 'Check "Dimethoate" Limits' },
                ]
            }
        ],
        me: [
            {
                id: 'ME-001',
                crop: 'Avocados (Hass)',
                market: 'Dubai / UAE',
                requirements: [
                    { label: 'Dry Matter', value: 'Min 23%' },
                    { label: 'Size Count', value: '18 - 22 (Preferred)' },
                    { label: 'Handling', value: 'Cold Chain 5.5°C' },
                ],
                alert: 'Cosmetic defects tolerated up to 15%'
            },
            {
                id: 'ME-002',
                crop: 'Mangoes (Apple)',
                market: 'Middle East',
                requirements: [
                    { label: 'Color', value: 'Red Blush Required' },
                    { label: 'Brix Level', value: '> 12%' },
                ]
            }
        ],
        uk: [
            {
                id: 'UK-001',
                crop: 'Fine Beans',
                market: 'Tesco / Retail',
                requirements: [
                    { label: 'Packaging', value: '150g Flow Pack' },
                    { label: 'Labeling', value: 'Traceability Code Compulsory' },
                    { label: 'Defects', value: '< 2% Scaring allowed' },
                ],
                alert: 'Plastic packaging tax applies'
            }
        ]
    };

    const downloads = [
        { name: 'GlobalG.A.P Checklist v5.2', size: '2.4 MB' },
        { name: 'EU MRL Database 2025', size: '1.8 MB' },
        { name: 'Tesco Supplier Guidelines', size: '4.1 MB' },
    ];

    const activeStandards = standards[activeTab as keyof typeof standards] || [];

    const filteredStandards = activeStandards.filter(item =>
        item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requirements.some(r => r.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="text-blue-600" size={20} />
                            Standards Library
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Export compliance & quality specs</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* content */}
                <div className="flex-1 overflow-y-auto">

                    {/* Search */}
                    <div className="p-6 pb-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search standards (e.g., MRL, Sizing)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Market Tabs */}
                    <div className="px-6 flex gap-4 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('eu')}
                            className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'eu' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            🇪🇺 EU Market
                        </button>
                        <button
                            onClick={() => setActiveTab('me')}
                            className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'me' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            🇦🇪 Middle East
                        </button>
                        <button
                            onClick={() => setActiveTab('uk')}
                            className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'uk' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            🇬🇧 UK Retail
                        </button>
                    </div>

                    {/* Standards List */}
                    <div className="p-6 space-y-4">
                        {filteredStandards.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{item.crop}</h3>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                                            {item.market}
                                        </span>
                                    </div>
                                    {item.alert && (
                                        <div className="text-orange-600" title={item.alert}>
                                            <AlertTriangle size={16} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 mb-3">
                                    {item.requirements.map((req, idx) => (
                                        <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                                            <span className="text-gray-500 dark:text-gray-400">{req.label}</span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 text-right">{req.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {item.alert && (
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-xs text-orange-700 dark:text-orange-300 flex gap-1.5 items-start mt-2">
                                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                                        {item.alert}
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredStandards.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No standards found for this filter.
                            </div>
                        )}
                    </div>

                    {/* Resources Section */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Downloadable Resources</h3>
                        <div className="space-y-2">
                            {downloads.map((doc, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 transition-all group">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-gray-400 group-hover:text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700">{doc.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{doc.size}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default StandardsLibraryDrawer;
