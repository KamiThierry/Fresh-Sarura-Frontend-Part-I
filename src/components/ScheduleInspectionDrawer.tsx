import { useState } from 'react';
import { X, Calendar, User, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScheduleInspectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
}

const ScheduleInspectionDrawer = ({ isOpen, onClose, onSubmit }: ScheduleInspectionDrawerProps) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        batchId: '',
        type: 'Routine Intake',
        inspector: '',
        date: '',
        time: '',
        priority: 'Normal'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Data
    const pendingBatches = [
        { id: 'B-2026-001', name: 'Avocados (Hass) - Block KIN01' },
        { id: 'B-2026-004', name: 'Chili (Bird Eye) - Block SB04' },
        { id: 'B-2026-007', name: 'French Beans - Block IM05' },
    ];

    const inspectors = [
        'Sarah M.',
        'Jean Paul',
        'Dr. Kanimba',
        'Alice Uwase'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            if (onSubmit) {
                onSubmit(formData);
            } else {
                alert(`Inspection Scheduled for ${formData.batchId} with ${formData.inspector}`);
                onClose();
            }
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
            <div className="absolute inset-y-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="text-blue-600" size={20} />
                            Schedule Inspection
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Assign QC tasks to inspectors</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="inspection-form" onSubmit={handleSubmit} className="space-y-5">

                        {/* Batch Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Select Batch (QC Pending) *
                            </label>
                            <select
                                required
                                value={formData.batchId}
                                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">-- Select Batch --</option>
                                {pendingBatches.map((batch) => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Inspection Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Inspection Type *
                            </label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option>Routine Intake</option>
                                <option>Pre-Shipment Check</option>
                                <option>Lab Sample Collection</option>
                                <option>Cold Chain Audit</option>
                            </select>
                        </div>

                        {/* Assign Inspector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Assign Inspector *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <select
                                    required
                                    value={formData.inspector}
                                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">-- Select Inspector --</option>
                                    {inspectors.map((inspector) => (
                                        <option key={inspector} value={inspector}>{inspector}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Scheduled Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Time *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority Level
                            </label>
                            <div className="flex gap-3">
                                {['Normal', 'Urgent', 'Critical'].map((level) => (
                                    <label
                                        key={level}
                                        className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${formData.priority === level
                                            ? level === 'Critical' ? 'bg-red-50 border-red-500 text-red-700' :
                                                level === 'Urgent' ? 'bg-orange-50 border-orange-500 text-orange-700' :
                                                    'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={level}
                                            checked={formData.priority === level}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="hidden"
                                        />
                                        {level === 'Critical' && <AlertTriangle size={14} />}
                                        <span className="text-sm font-medium">{level}</span>
                                    </label>
                                ))}
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
                        form="inspection-form"
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? 'Scheduling...' : 'Assign Task'}
                        {!isSubmitting && <CheckCircle size={18} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ScheduleInspectionDrawer;
