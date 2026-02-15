import { useState } from 'react';
import {
    X, Wallet, ClipboardList, Plus, FileText,
    CheckCircle2, Clock, AlertCircle, Image as ImageIcon,
    TrendingDown, TrendingUp, FileBarChart, ShieldCheck
} from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';
import EvidenceViewModal from './EvidenceViewModal';

interface CropCycleDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cycle: any; // We'll use 'any' for now to be flexible with the mock data structure
}

// Mock Tasks Data
const MOCK_TASKS = [
    {
        id: 1,
        activity: 'Pruning Maintenance',
        dueDate: 'Oct 10, 2024',
        status: 'Done',
        assignedTo: 'JP', // Initials for Avatar
        subtext: 'Completed by Jean Pierre',
        proof: true // Uses the mock image in EvidenceViewModal
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

const CropCycleDetailDrawer = ({ isOpen, onClose, cycle }: CropCycleDetailDrawerProps) => {
    const [activeTab, setActiveTab] = useState<'financials' | 'tasks'>('financials');
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [selectedEvidenceTask, setSelectedEvidenceTask] = useState<any>(null);
    const [tasks, setTasks] = useState(MOCK_TASKS);

    const handleCreateTask = (newTask: any) => {
        setTasks((prev) => [newTask, ...prev]);
        setIsCreateTaskOpen(false);
    };

    const handleEvidenceAction = (_taskId: number) => {
        // In a real app, we'd update the status via API
        // For now, let's just close the modal.
        // We could also simulate a status change here if desired.
        setSelectedEvidenceTask(null);
    };

    if (!isOpen || !cycle) return null;

    // --- Mock Data Helpers (Ported/Adapted from BudgetLedgerDrawer) ---
    // In a real app, these would come from the 'cycle' prop or an API
    const ledgerData = {
        categories: [
            { name: 'Seeds & Seedlings', allocated: 250000, spent: 245000 },
            { name: 'Fertilizers', allocated: 400000, spent: 380000 },
            { name: 'Chemicals', allocated: 350000, spent: 403000 }, // Over budget example
            { name: 'Labor', allocated: 500000, spent: 480000 }
        ],
        transactions: [
            { id: 1, item: 'Urea Fertilizer (50kg)', amount: 45000, date: 'Today', category: 'Fertilizers', user: 'Jean Pierre' },
            { id: 2, item: 'Fungicide Spray', amount: 32000, date: 'Yesterday', category: 'Chemicals', user: 'Jean Pierre' },
            { id: 3, item: 'Weeding Labor', amount: 45000, date: 'Oct 24', category: 'Labor', user: 'Sarah M.' },
        ]
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Container */}
            <div className="relative w-full md:w-[600px] bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col animate-slide-in-right">

                {/* --- Header Section --- */}
                <div className="flex-none bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
                    <div className="p-6 pb-0">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cycle.variance === 'over'
                                        ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                        : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                        }`}>
                                        {cycle.variance === 'over' ? 'Attention Needed' : 'On Track'}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {cycle.season} • {cycle.farm}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {cycle.crop} Cycle
                                </h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsReportOpen(true)}
                                    className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FileText size={14} />
                                    Export Report
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-6 mt-6">
                            <button
                                onClick={() => setActiveTab('financials')}
                                className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'financials'
                                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}>
                                <Wallet size={18} />
                                Financials
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'tasks'
                                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}>
                                <ClipboardList size={18} />
                                Tasks & Schedule
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Scrollable Body --- */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-6 space-y-6">

                    {/* TAB A: FINANCIALS */}
                    {activeTab === 'financials' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Budget summary cards or charts could go here */}

                            {/* Category Performance Table */}
                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                    <TrendingDown size={18} className="text-blue-500" />
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Budget Performance</h3>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3 text-right">Allocated</th>
                                            <th className="px-4 py-3 text-right">Spent</th>
                                            <th className="px-4 py-3 text-right">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {ledgerData.categories.map((cat, idx) => {
                                            const variance = cat.allocated - cat.spent;
                                            const isNegative = variance < 0;
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                                                    <td className="px-4 py-3 text-right text-gray-500">{cat.allocated.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-200">{cat.spent.toLocaleString()}</td>
                                                    <td className={`px-4 py-3 text-right font-bold ${isNegative ? 'text-red-500' : 'text-emerald-600'}`}>
                                                        {isNegative ? '' : '+'}{variance.toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </section>

                            {/* Recent Transactions */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-purple-500" />
                                    Recent Transactions
                                </h3>
                                <div className="space-y-3">
                                    {ledgerData.transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                                                    🧾
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{tx.item}</p>
                                                    <p className="text-xs text-gray-500">{tx.category} • {tx.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">-{tx.amount.toLocaleString()}</p>
                                                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Approved</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* TAB B: TASKS */}
                    {activeTab === 'tasks' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Action Bar */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsCreateTaskOpen(true)}
                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    Add Task
                                </button>
                                <button className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                                    <FileText size={18} />
                                    Import SOP
                                </button>
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
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
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
        </div>
    );
};

function ReportModal({ isOpen, onClose, cycleName }: { isOpen: boolean; onClose: () => void; cycleName: string }) {
    if (!isOpen) return null;

    const handleDownload = (type: string) => {
        alert(`Generating ${type} Report for ${cycleName}... Download started.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
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
        </div>
    );
}

export default CropCycleDetailDrawer;
