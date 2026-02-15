import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Scale, Thermometer, Layers, Save } from 'lucide-react';

interface QCSortingDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    intakeId: string; // The ID of the intake being processed
    onConfirm: () => void;
}

const QCSortingDrawer = ({ isOpen, onClose, intakeId, onConfirm }: QCSortingDrawerProps) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        gradeA_weight: '',
        gradeB_weight: '',
        rejected_weight: '',
        waste_reason: '',
        cold_room: 'Cold Room A',
        avg_temp: '4.5' // Default mock temp
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Intake Data (In a real app, fetch based on intakeId)
    const intakeData = {
        id: intakeId || 'INT-2026-001',
        produce: 'Avocados (Hass)',
        total_weight: 1200,
        supplier: 'Kinvest Farm'
    };

    const calculatedTotal = (
        (parseFloat(formData.gradeA_weight) || 0) +
        (parseFloat(formData.gradeB_weight) || 0) +
        (parseFloat(formData.rejected_weight) || 0)
    );

    const isWeightMatching = Math.abs(calculatedTotal - intakeData.total_weight) < 1; // 1kg tolerance

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onConfirm();
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 w-full max-w-lg h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-purple-50/50 dark:bg-purple-900/10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Layers className="text-purple-600" size={20} />
                            QC & Sorting Process
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Processing Intake: {intakeId}</p>
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

                    {/* Source Info Card */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Produce Source</span>
                            <div className="font-bold text-gray-900 dark:text-white">{intakeData.supplier}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{intakeData.produce}</div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Total Weight</span>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{intakeData.total_weight} kg</div>
                        </div>
                    </div>

                    <form id="sorting-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Grading Inputs */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Scale size={16} className="text-gray-500" />
                                Sorting Results (Weight in kg)
                            </label>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-1/3 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900/30">
                                        Grade A (Export)
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.gradeA_weight}
                                        onChange={(e) => setFormData({ ...formData, gradeA_weight: e.target.value })}
                                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-1/3 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                        Grade B (Local)
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.gradeB_weight}
                                        onChange={(e) => setFormData({ ...formData, gradeB_weight: e.target.value })}
                                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-1/3 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
                                        Rejected / Waste
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.rejected_weight}
                                        onChange={(e) => setFormData({ ...formData, rejected_weight: e.target.value })}
                                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Weight Validation Message */}
                        <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${isWeightMatching
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                            }`}>
                            {isWeightMatching ? (
                                <CheckCircle size={16} />
                            ) : (
                                <AlertTriangle size={16} />
                            )}
                            <span className="font-medium">
                                Total Recorded: {calculatedTotal.toFixed(1)} kg / {intakeData.total_weight} kg
                            </span>
                        </div>

                        <hr className="border-gray-100 dark:border-gray-700" />

                        {/* Storage Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Assign Location
                                </label>
                                <select
                                    value={formData.cold_room}
                                    onChange={(e) => setFormData({ ...formData, cold_room: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                >
                                    <option>Cold Room A</option>
                                    <option>Cold Room B</option>
                                    <option>Ambient Storage</option>
                                    <option>Despatch Area</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Avg. Pulp Temp (°C)
                                </label>
                                <div className="relative">
                                    <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.avg_temp}
                                        onChange={(e) => setFormData({ ...formData, avg_temp: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="sorting-form"
                        disabled={!isWeightMatching || isSubmitting}
                        className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Stock Info'}
                        {!isSubmitting && <Save size={18} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default QCSortingDrawer;
