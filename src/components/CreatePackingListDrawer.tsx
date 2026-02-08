import React, { useState } from 'react';
import { X, Plane, FileText, Scale, Package, Save, Printer, Trash2, CheckCircle, Search } from 'lucide-react';

interface CreatePackingListDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

interface StockItem {
    id: string;
    product: string;
    grade: string;
    location: string;
    availableWeight: number;
    allocatedWeight?: number; // Should be string in input but number for logic
}

const CreatePackingListDrawer: React.FC<CreatePackingListDrawerProps> = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        client: 'MWW Experts',
        flightNo: 'WB300',
        departureDate: '',
        plNumber: '',
        invNumber: '',
        grossWeight: '',
        totalBoxes: '',
        skids: '',
    });

    const [productFilter, setProductFilter] = useState('All');
    const [selectedStock, setSelectedStock] = useState<StockItem[]>([]);

    // Mock Available Stock
    const availableStock: StockItem[] = [
        { id: 'STK-AVO-26', product: 'Avocados (Hass)', grade: 'A', location: 'Cold Room A', availableWeight: 4200 },
        { id: 'STK-AVO-27', product: 'Avocados (Hass)', grade: 'A', location: 'Cold Room B', availableWeight: 1500 },
        { id: 'STK-CHI-12', product: 'Bird Eye Chili', grade: 'A', location: 'Ambient', availableWeight: 600 },
        { id: 'STK-MAN-05', product: 'Mangoes (Apple)', grade: 'A', location: 'Despatch', availableWeight: 2100 },
        { id: 'STK-FBN-08', product: 'Fine Beans', grade: 'A', location: 'Cold Room A', availableWeight: 850 },
    ];

    const filteredStock = productFilter === 'All'
        ? availableStock
        : availableStock.filter(item => item.product.includes(productFilter));

    const handleSelectStock = (item: StockItem) => {
        // If already selected, do nothing (user interacts with card directly)
        if (selectedStock.find(s => s.id === item.id)) return;

        // Add to selected with default allocation (e.g., all available)
        setSelectedStock([...selectedStock, { ...item, allocatedWeight: item.availableWeight }]);
    };

    const handleRemoveStock = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedStock(selectedStock.filter(s => s.id !== id));
    };

    const handleWeightChange = (id: string, weight: string) => {
        const numWeight = parseFloat(weight);
        setSelectedStock(prev => prev.map(s => s.id === id ? { ...s, allocatedWeight: isNaN(numWeight) ? 0 : numWeight } : s));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, items: selectedStock });
    };

    const totalNetWeight = selectedStock.reduce((sum, item) => sum + (item.allocatedWeight || 0), 0);

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 max-w-xl w-full h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-slide-in-right border-l border-gray-100 dark:border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-purple-50/50 dark:bg-purple-900/10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Plane className="text-purple-600" size={20} />
                            Create Packing List
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Build shipment & allocate stock</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="packing-list-form" onSubmit={handleSubmit}>

                        {/* 1. Logistics Section */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Client / Consignee</label>
                                    <select
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option>MWW Experts</option>
                                        <option>Nature Pride</option>
                                        <option>Carrefour Dubai</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Departure Date</label>
                                    <input
                                        type="date"
                                        name="departureDate"
                                        value={formData.departureDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Flight No</label>
                                    <input
                                        type="text"
                                        name="flightNo"
                                        value={formData.flightNo}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="WB300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">PL #</label>
                                    <input
                                        type="text"
                                        name="plNumber"
                                        value={formData.plNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                        placeholder="001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Inv #</label>
                                    <input
                                        type="text"
                                        name="invNumber"
                                        value={formData.invNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                        placeholder="INV-001"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-100 dark:border-gray-700" />

                        {/* 2. Allocation Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 dark:text-white">Add Items to Shipment</h3>
                                <div className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
                                    Total Weight: {totalNetWeight.toLocaleString()} kg
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex gap-2 pb-2 overflow-x-auto">
                                {['All', 'Avocados', 'Chili', 'Mangoes'].map(tab => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setProductFilter(tab)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${productFilter === tab
                                                ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Stock List */}
                            <div className="space-y-3">
                                {filteredStock.map(item => {
                                    const isSelected = selectedStock.find(s => s.id === item.id);
                                    const allocated = isSelected?.allocatedWeight ?? 0;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSelectStock(item)}
                                            className={`relative group p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                                                    ? 'border-purple-500 bg-purple-50/30 dark:bg-purple-900/10 shadow-sm'
                                                    : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-800'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 text-purple-600">
                                                    <CheckCircle size={20} className="fill-purple-100" />
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-xs font-mono text-gray-400 mb-0.5">{item.id}</div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{item.product}</h4>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">Grade {item.grade}</span>
                                                        <span>• {item.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-3">
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Available: </span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{item.availableWeight.toLocaleString()} kg</span>
                                                </div>

                                                {isSelected && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col items-end">
                                                            <label className="text-[10px] uppercase font-bold text-purple-600 mb-0.5">Allocated (kg)</label>
                                                            <input
                                                                type="number"
                                                                value={allocated}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => handleWeightChange(item.id, e.target.value)}
                                                                className="w-24 text-right px-2 py-1 bg-white dark:bg-gray-900 border border-purple-300 rounded font-bold text-purple-700 outline-none focus:ring-2 focus:ring-purple-500"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleRemoveStock(e, item.id)}
                                                            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <hr className="my-6 border-gray-100 dark:border-gray-700" />

                        {/* 3. Packing Details Footer */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
                                <Scale size={16} /> Final Details
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Gross Weight</label>
                                    <input
                                        type="number"
                                        name="grossWeight"
                                        value={formData.grossWeight}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Total Boxes</label>
                                    <input
                                        type="number"
                                        name="totalBoxes"
                                        value={formData.totalBoxes}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Skids</label>
                                    <input
                                        type="number"
                                        name="skids"
                                        value={formData.skids}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        Save Draft
                    </button>
                    <button
                        type="submit"
                        form="packing-list-form"
                        className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                    >
                        <Printer size={18} />
                        Generate List
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreatePackingListDrawer;
