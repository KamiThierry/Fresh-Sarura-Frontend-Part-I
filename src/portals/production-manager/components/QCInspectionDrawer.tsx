import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Activity, Upload, FileText, Image as ImageIcon, Calendar, User, Scale, Thermometer, Search, ArrowLeft, Clock, Bug, Trash2 } from 'lucide-react';

interface QCInspectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (result: string) => void;
    intakeId?: string; // Optional prop if we want to pre-select
    onConfirm: () => void; // Matches the usage in InventoryManagement
}

interface Intake {
    id: string;
    crop: string;
    farmer: string;
    arrival: string;
    weight: string;
    status: 'pending_qc';
}

const QCInspectionDrawer = ({ isOpen, onClose, onSubmit, intakeId, onConfirm }: QCInspectionDrawerProps) => {
    const [selectedIntake, setSelectedIntake] = useState<Intake | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        appearance: 'Good',
        maturity: 'Stage 1',
        pulpTemp: '',
        moisture: '',
        insectDamage: false,
        foreignMatter: false,
        comments: '',
        decision: '' // Pass, Conditional, Reject
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Pending Intakes (Data Source)
    const pendingIntakes: Intake[] = [
        { id: 'INT-2026-001', crop: 'Avocados', farmer: 'Kinvest Farm', arrival: 'Today, 08:30 AM', weight: '1,200 kg', status: 'pending_qc' },
        { id: 'INT-2026-002', crop: 'French Beans', farmer: 'Jean Claude', arrival: 'Today, 10:15 AM', weight: '350 kg', status: 'pending_qc' },
        { id: 'INT-2026-005', crop: 'Chili', farmer: 'Bugesera Co-op', arrival: 'Yesterday, 04:00 PM', weight: '400 kg', status: 'pending_qc' },
    ];

    // Filter Logic
    const filteredIntakes = pendingIntakes.filter(item =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle External Prop Selection (if passed from parent)
    useEffect(() => {
        if (intakeId) {
            const found = pendingIntakes.find(i => i.id === intakeId);
            if (found) setSelectedIntake(found);
        }
    }, [intakeId]);

    // Reset state when drawer closes
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setSelectedIntake(null);
                setFormData({
                    appearance: 'Good',
                    maturity: 'Stage 1',
                    pulpTemp: '',
                    moisture: '',
                    insectDamage: false,
                    foreignMatter: false,
                    comments: '',
                    decision: ''
                });
                setSearchTerm('');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const handleBack = () => {
        setSelectedIntake(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.decision) return;

        setIsSubmitting(true);
        setTimeout(() => {
            // Logic: Pass -> Unlocks Sorting, Reject -> Locks Stock
            // We just notify parent here
            onConfirm();
            onSubmit(formData.decision === 'Pass' ? 'QC Passed' : 'Rejected');
            setIsSubmitting(false);
            onClose();
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            ></div>

            {/* Drawer Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen md:w-[850px] transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-2xl h-full flex flex-col border-l border-gray-200 dark:border-gray-700">

                    {/* STEP 1: INTAKE SELECTION VIEW */}
                    {!selectedIntake && (
                        <>
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Intake for Inspection</h2>
                                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="mt-6 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Scan QR or Search Intake ID, Farmer..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 dark:bg-gray-900/50">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Pending QC ({filteredIntakes.length})</h3>
                                <div className="space-y-4">
                                    {filteredIntakes.map((intake) => (
                                        <div
                                            key={intake.id}
                                            onClick={() => setSelectedIntake(intake)}
                                            className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        <Activity size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{intake.id}</h4>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                                Waiting for Inspection
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            {intake.farmer} • {intake.crop} • {intake.arrival}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300">
                                                        <Scale size={16} className="text-gray-400" />
                                                        {intake.weight}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* STEP 2: INSPECTION FORM VIEW */}
                    {selectedIntake && (
                        <>
                            {/* Header */}
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <button
                                            onClick={handleBack}
                                            className="mt-1 p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                                    Raw Intake Inspection
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedIntake.id}</h2>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Activity size={16} className="text-green-600" />
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{selectedIntake.crop}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User size={16} />
                                                    <span>{selectedIntake.farmer}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={16} />
                                                    <span>Arrived: {selectedIntake.arrival}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Content - Two Column Grid */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {/* Left Column: Metrics & Decision */}
                                    <div className="space-y-6">
                                        <form id="qc-drawer-form" onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">Quality Metrics</h3>

                                            {/* Appearance & Maturity */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Appearance</label>
                                                    <select
                                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={formData.appearance}
                                                        onChange={e => setFormData({ ...formData, appearance: e.target.value })}
                                                    >
                                                        <option>Good</option>
                                                        <option>Fair</option>
                                                        <option>Poor</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Maturity / Color</label>
                                                    <select
                                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        value={formData.maturity}
                                                        onChange={e => setFormData({ ...formData, maturity: e.target.value })}
                                                    >
                                                        <option>Stage 1</option>
                                                        <option>Stage 2</option>
                                                        <option>Stage 3</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Pulp Temp & Moisture */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Pulp Temp (°C)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder="e.g. 5.0"
                                                            className="w-full pl-3 pr-8 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                            value={formData.pulpTemp}
                                                            onChange={e => setFormData({ ...formData, pulpTemp: e.target.value })}
                                                        />
                                                        <span className="absolute right-3 top-2 text-gray-400 text-xs font-medium">°C</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Moisture (%)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder="e.g. 12"
                                                            className="w-full pl-3 pr-8 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                            value={formData.moisture}
                                                            onChange={e => setFormData({ ...formData, moisture: e.target.value })}
                                                        />
                                                        <span className="absolute right-3 top-2 text-gray-400 text-xs font-medium">%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Critical Checks (Toggles) */}
                                            <div className="space-y-3 pt-2">
                                                <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${formData.insectDamage ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                                            <Bug size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900 dark:text-white text-sm">Insect Damage</span>
                                                            <p className="text-xs text-gray-500">Signs of pest infestation</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                        checked={formData.insectDamage}
                                                        onChange={(e) => setFormData({ ...formData, insectDamage: e.target.checked })}
                                                    />
                                                </label>

                                                <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${formData.foreignMatter ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                                            <Trash2 size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900 dark:text-white text-sm">Foreign Matter</span>
                                                            <p className="text-xs text-gray-500">Stones, dirt, or debris</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                        checked={formData.foreignMatter}
                                                        onChange={(e) => setFormData({ ...formData, foreignMatter: e.target.checked })}
                                                    />
                                                </label>
                                            </div>


                                            {/* Final Decision Segmented Control */}
                                            <div className="pt-4">
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Final Decision</label>
                                                <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl">
                                                    {[
                                                        { label: 'Pass', color: 'green', display: 'Pass' },
                                                        { label: 'Conditional', color: 'yellow', display: 'Conditional' },
                                                        { label: 'Reject', color: 'red', display: 'Reject' }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.label}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, decision: option.label })}
                                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.decision === option.label
                                                                ? `bg-white dark:bg-gray-700 text-${option.color}-600 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600`
                                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                                                }`}
                                                        >
                                                            {option.display}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Right Column: Attachments & Comments */}
                                    <div className="space-y-6">

                                        {/* Upload Zone */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Evidence & Comments</h3>

                                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group mb-6">
                                                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="text-gray-900 dark:text-white font-medium mb-1">Upload Photo or MRL Result</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Supported: JPG, PNG, PDF</p>
                                            </div>

                                            {/* Comments */}
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Inspection Notes</label>
                                                <textarea
                                                    rows={4}
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                    placeholder="Add detailed comments about the defect or quality..."
                                                    value={formData.comments}
                                                    onChange={e => setFormData({ ...formData, comments: e.target.value })}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        Save Draft
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            form="qc-drawer-form"
                                            disabled={!formData.decision || isSubmitting}
                                            className={`px-8 py-2.5 text-white font-medium rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 ${formData.decision === 'Reject'
                                                ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
                                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                                                }`}
                                        >
                                            {isSubmitting ? 'Processing...' : (
                                                <>
                                                    <CheckCircle size={18} />
                                                    {formData.decision === 'Reject' ? 'Reject Intake' : 'Submit Inspection'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default QCInspectionDrawer;
