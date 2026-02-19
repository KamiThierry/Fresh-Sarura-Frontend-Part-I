import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Wallet, ClipboardList, Plus, FileText,
    CheckCircle2, Clock, AlertCircle, Image as ImageIcon,
    TrendingDown, TrendingUp, FileBarChart, ShieldCheck,
    Target, DollarSign, Activity, Sprout
} from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';
import EvidenceViewModal from './EvidenceViewModal';

import BudgetLedgerModal from './BudgetLedgerModal';

interface CropCycleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    cycle: any;
}

// Mock Tasks Data
const MOCK_TASKS = [
    {
        id: 1,
        activity: 'Pruning Maintenance',
        dueDate: 'Oct 10, 2024',
        status: 'Done',
        assignedTo: 'JP',
        subtext: 'Completed by Jean Pierre',
        proof: true
    },
    {
        id: 2,
        activity: 'Copper Fungicide Spray',
        dueDate: 'Oct 15, 2024',
        status: 'Pending',
        assignedTo: 'SM',
        subtext: 'Assigned to Sarah M.',
        proof: false
    },
    {
        id: 3,
        activity: 'PHI Inspection',
        dueDate: 'Oct 20, 2024',
        status: 'Overdue',
        assignedTo: 'RW',
        subtext: 'Assigned to Robert W.',
        proof: false
    }
];

const CropCycleDetailModal = ({ isOpen, onClose, cycle }: CropCycleDetailModalProps) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'tasks'>('overview');
    const [isLedgerOpen, setIsLedgerOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [selectedEvidenceTask, setSelectedEvidenceTask] = useState<any>(null);
    const [tasks, setTasks] = useState(MOCK_TASKS);

    if (!isOpen || !cycle) return null;

    const ledgerData = {
        categories: [
            { name: 'Seeds & Seedlings', allocated: 2500, spent: 2450, variance: 50, status: 'on_track' },
            { name: 'Fertilizers', allocated: 1800, spent: 2100, variance: -300, status: 'over_budget' },
            { name: 'Labor (Planting)', allocated: 3000, spent: 2800, variance: 200, status: 'on_track' },
            { name: 'Pest Control', allocated: 1200, spent: 800, variance: 400, status: 'under_budget' },
        ],
        recentTransactions: [
            { id: 'TX-001', date: 'Feb 10', desc: 'Purchase: NPK Fertilizer', amount: 1200, category: 'Fertilizers' },
            { id: 'TX-002', date: 'Feb 08', desc: 'Labor: Week 1 Planting', amount: 850, category: 'Labor' },
        ]
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Planned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Harvesting': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getVarianceColor = (variance: number) => {
        if (variance < 0) return 'text-red-600 dark:text-red-400';
        if (variance > 0) return 'text-green-600 dark:text-green-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const handleCreateTask = (task: any) => {
        setTasks([...tasks, { ...task, id: tasks.length + 1, status: 'Pending', proof: false }]);
        setIsCreateTaskOpen(false);
    };

    const handleEvidenceAction = (taskId: number) => {
        setSelectedEvidenceTask(null);
        // logic to update task status
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700 max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-xl text-green-600 dark:text-green-400">
                            <Sprout size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {cycle.cycleId}
                                </h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(cycle.status)}`}>
                                    {cycle.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {cycle.crop} • {cycle.landSize} • {cycle.startDate} - {cycle.endDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsReportOpen(true)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                            title="Generate Report"
                        >
                            <FileText size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
                    <div className="flex gap-6">
                        {['overview', 'financials', 'tasks'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`py-4 text-sm font-medium border-b-2 transition-all capitalize ${activeTab === tab
                                    ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 dark:bg-gray-900/10">

                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Key Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Target size={18} /></div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Yield Goal</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{cycle.yieldGoal}</p>
                                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><TrendingUp size={12} /> On track</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><DollarSign size={18} /></div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Used</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {Math.round((cycle.spent / cycle.budget) * 100)}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">${cycle.spent.toLocaleString()} / ${cycle.budget.toLocaleString()}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Activity size={18} /></div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Health Score</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">92/100</p>
                                    <p className="text-xs text-gray-500 mt-1">Excellent condition</p>
                                </div>
                            </div>

                            {/* Timeline / Progress */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cycle Progress</h3>
                                <div className="relative pt-6 pb-2">
                                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[65%] rounded-full relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-green-500 rounded-full shadow-md"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        <div className="text-center">
                                            <span className="block text-green-600">Started</span>
                                            {cycle.startDate}
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-gray-900 dark:text-white">Current Stage</span>
                                            Vegetative Growth
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-gray-400">Harvest</span>
                                            {cycle.endDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeTab === 'financials' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Budget Overview Cards -- Simplified for modal */}
                            <div className="grid grid-cols-2 gap-4">
                                {ledgerData.categories.map((cat, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                                            <span className={`text-xs font-bold ${getVarianceColor(cat.variance)}`}>
                                                {cat.variance > 0 ? '+' : ''}{cat.variance} RWF
                                            </span>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>{cat.spent} used</span>
                                                <span>{cat.allocated} allocated</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${cat.variance < 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(100, (cat.spent / cat.allocated) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Transactions */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Recent Transactions</h3>
                                    <button
                                        onClick={() => setIsLedgerOpen(true)}
                                        className="text-xs text-blue-600 font-medium hover:underline"
                                    >
                                        View Full Ledger
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {ledgerData.recentTransactions.map((tx) => (
                                        <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-dashed border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                                    <DollarSign size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.desc}</p>
                                                    <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-200">
                                                -${tx.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Action Bar */}
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-white">Scheduled Tasks</h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                                        <FileText size={16} />
                                        Import SOP
                                    </button>
                                    <button
                                        onClick={() => setIsCreateTaskOpen(true)}
                                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs shadow-md shadow-green-900/10 transition-all flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Task
                                    </button>
                                </div>
                            </div>

                            {/* Task List */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-semibold border-b border-gray-100 dark:border-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 w-8"></th> {/* Status Icon */}
                                            <th className="px-4 py-3">Activity</th>
                                            <th className="px-4 py-3">Due Date</th>
                                            <th className="px-4 py-3 text-center">Assigned</th>
                                            <th className="px-4 py-3 text-center">Proof</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {tasks.map((task) => {
                                            const isOverdue = task.status === 'Overdue';
                                            const isDone = task.status === 'Done';

                                            return (
                                                <tr key={task.id} className={`group transition-colors ${isOverdue ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                                                    <td className="px-4 py-4">
                                                        {isDone ? (
                                                            <CheckCircle2 size={20} className="text-emerald-500" />
                                                        ) : isOverdue ? (
                                                            <AlertCircle size={20} className="text-red-500" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className={`font-bold ${isDone ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                                            {task.activity}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{task.subtext}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                                                            <Clock size={14} />
                                                            {task.dueDate}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 mx-auto">
                                                            {task.assignedTo}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {task.proof ? (
                                                            <button
                                                                onClick={() => setSelectedEvidenceTask(task)}
                                                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-emerald-600 transition-colors"
                                                            >
                                                                <ImageIcon size={18} />
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-300 dark:text-gray-700">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Footer --- */}
                <div className="flex-none p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Last updated: Just now</span>
                        <span>ID: #{cycle.id}8832</span>
                    </div>
                </div>

            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                cycleName={cycle.crop + ' ' + cycle.season}
            />

            {/* Budget Ledger Modal */}
            <BudgetLedgerModal
                isOpen={isLedgerOpen}
                onClose={() => setIsLedgerOpen(false)}
            // data={cycle} // Assuming BudgetLedgerModal handles data fetching or mocks internally for now based on previous refactor
            />

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                onSubmit={handleCreateTask}
            />

            {/* Evidence View Modal */}
            <EvidenceViewModal
                isOpen={!!selectedEvidenceTask}
                onClose={() => setSelectedEvidenceTask(null)}
                task={selectedEvidenceTask}
                onApprove={() => handleEvidenceAction(selectedEvidenceTask?.id)}
                onReject={() => handleEvidenceAction(selectedEvidenceTask?.id)}
            />
        </div>,
        document.body
    );
};

function ReportModal({ isOpen, onClose, cycleName }: { isOpen: boolean; onClose: () => void; cycleName: string }) {
    if (!isOpen) return null;

    const handleDownload = (type: string) => {
        alert(`Generating ${type} Report for ${cycleName}... Download started.`);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Generate Report</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Option A: Financial Summary */}
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                                <Wallet size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Financial Summary</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Budget variance, expense breakdown, and ROI analysis.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 pl-14">
                            <button
                                onClick={() => handleDownload('Financial (PDF)')}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5"
                            >
                                <FileText size={12} /> PDF
                            </button>
                            <button
                                onClick={() => handleDownload('Financial (CSV)')}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5"
                            >
                                <FileBarChart size={12} /> CSV
                            </button>
                        </div>
                    </div>

                    {/* Option B: Compliance Audit */}
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">Compliance Audit Log</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Full task history, chemical applications, and photo evidence.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 pl-14">
                            <button
                                onClick={() => handleDownload('Compliance Audit')}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5"
                            >
                                <FileText size={12} /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CropCycleDetailModal;
