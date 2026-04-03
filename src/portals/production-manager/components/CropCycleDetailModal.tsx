import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Wallet, ClipboardList, FileText,
    CheckCircle2, Clock, AlertCircle,
    TrendingUp, FileBarChart, ShieldCheck,
    Target, Coins, Activity, Sprout,
    ThumbsUp, ThumbsDown, ListChecks,
    Lock, Plus
} from 'lucide-react';
import EvidenceViewModal from './EvidenceViewModal';
import BudgetLedgerModal from './BudgetLedgerModal';
import type { BudgetRequest } from '../../shared/types/activity';

interface CropCycleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    cycle: any;
}

// Mock Pending Budget Requests (from FM)
const MOCK_BUDGET_REQUESTS: BudgetRequest[] = [
    {
        id: 1001,
        cycleId: 1,
        cycleName: 'Avocado (Hass) — Season A 2026',
        submittedBy: 'Jean Claude (Site Manager)',
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
        lineItems: [
            { id: 1, activityName: 'Weeding Block B1', startDate: '2026-04-10', endDate: '2026-04-12', estimatedCostRwf: 150000 },
            { id: 2, activityName: 'Apply NPK Fertilizer', startDate: '2026-04-15', endDate: '2026-04-15', estimatedCostRwf: 320000 },
            { id: 3, activityName: 'Pest Scouting & Spray', startDate: '2026-04-18', endDate: '2026-04-20', estimatedCostRwf: 220000 },
        ],
        totalRequestedRwf: 690000,
        approvalStatus: 'Pending',
    },
];

const CropCycleDetailModal = ({ isOpen, onClose, cycle }: CropCycleDetailModalProps) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'requests'>('overview');
    const [isLedgerOpen, setIsLedgerOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [selectedEvidenceTask, setSelectedEvidenceTask] = useState<any>(null);
    const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>(MOCK_BUDGET_REQUESTS);
    
    // New States for Financials Loop
    const [cycleStatus, setCycleStatus] = useState(cycle?.status || 'Active');
    const [isAdjustBudgetOpen, setIsAdjustBudgetOpen] = useState(false);
    const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);

    if (!isOpen || !cycle) return null;

    const [ledgerDataState, setLedgerDataState] = useState({
        categories: [
            { name: 'Seeds & Seedlings', allocated: 250000, spent: 242500, variance: 7500, status: 'on_track' },
            { name: 'Fertilizers', allocated: 400000, spent: 435000, variance: -35000, status: 'over_budget' },
            { name: 'Labor (Planting)', allocated: 500000, spent: 468000, variance: 32000, status: 'on_track' },
            { name: 'Pest Control', allocated: 180000, spent: 124000, variance: 56000, status: 'under_budget' },
        ],
        recentTransactions: [
            { id: 'TX-001', date: 'Feb 10', desc: 'Field Report: NPK Fertilizer Application', amount: 72000, category: 'Fertilizers' },
            { id: 'TX-002', date: 'Feb 08', desc: 'Field Report: Weeding Labor — Block B1', amount: 45000, category: 'Labor' },
        ]
    });
    
    // Derived values for Global Summary Banner
    const totalAllocatedBudget = ledgerDataState.categories.reduce((acc, cat) => acc + cat.allocated, 0);
    const totalProductionCost = ledgerDataState.categories.reduce((acc, cat) => acc + cat.spent, 0);
    const globalVariance = totalAllocatedBudget - totalProductionCost;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Planned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
            case 'Harvesting': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getVarianceColor = (variance: number) => {
        if (variance < 0) return 'text-red-600 dark:text-red-400';
        if (variance > 0) return 'text-green-600 dark:text-green-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const handleApproveRequest = (requestId: number) => {
        setBudgetRequests(prev =>
            prev.map(r => r.id === requestId ? { ...r, approvalStatus: 'Approved' } : r)
        );
        console.log(`Budget request #${requestId} approved. Tasks would now appear in FM checklist.`);
    };

    const handleRejectRequest = (requestId: number) => {
        setBudgetRequests(prev =>
            prev.map(r => r.id === requestId ? { ...r, approvalStatus: 'Rejected' } : r)
        );
    };

    const handleEvidenceAction = (taskId: number) => {
        setSelectedEvidenceTask(null);
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
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(cycleStatus)}`}>
                                    {cycleStatus}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {cycle.crop} • {cycle.landSize} • {cycle.startDate} - {cycle.endDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {cycleStatus === 'Completed' ? (
                            <button disabled className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm font-bold flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 cursor-not-allowed">
                                <Lock size={16} /> Cycle Closed
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsConfirmCloseOpen(true)}
                                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-bold transition-colors flex items-center gap-1.5 border border-red-100 dark:border-red-800/50"
                            >
                                Close Crop Cycle
                            </button>
                        )}
                        <span className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></span>
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
                        {(['overview', 'financials', 'requests'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 text-sm font-medium border-b-2 transition-all capitalize ${activeTab === tab
                                    ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab === 'requests' ? 'Budget Requests' : tab}
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
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Coins size={18} /></div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Used</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {Math.round((cycle.spent / cycle.budget) * 100)}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{cycle.spent.toLocaleString()} Rwf / {cycle.budget.toLocaleString()} Rwf</p>
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
                            {/* Global Summary Banner */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Global Financial Summary</h3>
                                        <div className="flex flex-wrap items-end gap-6 sm:gap-8">
                                            <div>
                                                <p className="text-gray-400 text-xs mb-1">Total Allocated</p>
                                                <p className="text-2xl font-bold text-white">{totalAllocatedBudget.toLocaleString()} Rwf</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs mb-1">Total Cost</p>
                                                <p className="text-2xl font-bold text-white">{totalProductionCost.toLocaleString()} Rwf</p>
                                            </div>
                                            <div className="border-l border-gray-600 pl-6 sm:pl-8">
                                                <p className="text-gray-400 text-xs mb-1">Global Variance</p>
                                                <p className={`text-2xl font-bold ${globalVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {globalVariance > 0 ? '+' : ''}{globalVariance.toLocaleString()} Rwf
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {cycleStatus !== 'Completed' && (
                                        <button
                                            onClick={() => setIsAdjustBudgetOpen(true)}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 border border-white/10 backdrop-blur-sm shadow-sm"
                                        >
                                            <Plus size={16} /> Adjust Budget
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Budget Overview Cards -- Simplified for modal */}
                            <div className="grid grid-cols-2 gap-4">
                                {ledgerDataState.categories.map((cat, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                                            <span className={`text-xs font-bold ${getVarianceColor(cat.variance)}`}>
                                                {cat.variance > 0 ? '+' : ''}{cat.variance.toLocaleString()} Rwf
                                            </span>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>{cat.spent.toLocaleString()} actual</span>
                                                <span>{cat.allocated.toLocaleString()} allocated</span>
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
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Recently Logged Expenses</h3>
                                    <button
                                        onClick={() => setIsLedgerOpen(true)}
                                        className="text-xs text-blue-600 font-medium hover:underline"
                                    >
                                        View Full Ledger
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {ledgerDataState.recentTransactions.map((tx) => (
                                        <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-dashed border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                                    <Coins size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.desc}</p>
                                                    <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-200">
                                                -{tx.amount.toLocaleString()} Rwf
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Section header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ListChecks size={18} className="text-gray-500" />
                                    <h3 className="font-bold text-gray-900 dark:text-white">Pending Budget Requests</h3>
                                    {budgetRequests.filter(r => r.approvalStatus === 'Pending').length > 0 && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            {budgetRequests.filter(r => r.approvalStatus === 'Pending').length} pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            {budgetRequests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                                        <ClipboardList size={24} className="text-gray-400" />
                                    </div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">No Pending Requests</p>
                                    <p className="text-xs text-gray-400 mt-1">Farm managers haven't submitted any activity requests yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {budgetRequests.map(req => {
                                        const unallocatedBudget = (cycle?.budget ?? 0) - (cycle?.spent ?? 0);
                                        const isApproved = req.approvalStatus === 'Approved';
                                        const isRejected = req.approvalStatus === 'Rejected';
                                        const isPending = req.approvalStatus === 'Pending';

                                        return (
                                            <div
                                                key={req.id}
                                                className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden transition-all ${
                                                    isApproved ? 'border-green-300 dark:border-green-700' :
                                                    isRejected ? 'border-red-200 dark:border-red-800 opacity-70' :
                                                    'border-gray-200 dark:border-gray-700'
                                                }`}
                                            >
                                                {/* Request card header */}
                                                <div className="flex items-start justify-between px-5 py-4 bg-gray-50/60 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{req.submittedBy}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                                isApproved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                isRejected ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                            }`}>
                                                                {req.approvalStatus}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {req.cycleName} &nbsp;•&nbsp;
                                                            {new Date(req.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Line items table */}
                                                <div className="px-5 py-3">
                                                    <table className="w-full text-left text-xs">
                                                        <thead>
                                                            <tr className="text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-700">
                                                                <th className="pb-2 pr-4">Activity</th>
                                                                <th className="pb-2 pr-4">Start</th>
                                                                <th className="pb-2 pr-4">End</th>
                                                                <th className="pb-2 text-right">Est. Cost</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                                            {req.lineItems.map(item => (
                                                                <tr key={item.id} className="py-1">
                                                                    <td className="py-2 pr-4 font-medium text-gray-800 dark:text-gray-200">{item.activityName}</td>
                                                                    <td className="py-2 pr-4 text-gray-500">{item.startDate}</td>
                                                                    <td className="py-2 pr-4 text-gray-500">{item.endDate}</td>
                                                                    <td className="py-2 text-right font-mono text-gray-700 dark:text-gray-300">
                                                                        {item.estimatedCostRwf.toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Budget comparison footer */}
                                                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/40 dark:bg-gray-900/20">
                                                    <div className="flex items-center gap-4 text-xs font-mono">
                                                        <div>
                                                            <span className="block text-[10px] uppercase text-gray-400 mb-0.5">Total Requested</span>
                                                            <span className="font-bold text-gray-800 dark:text-gray-200">{req.totalRequestedRwf.toLocaleString()} Rwf</span>
                                                        </div>
                                                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                                                        <div>
                                                            <span className="block text-[10px] uppercase text-gray-400 mb-0.5">Unallocated Remaining</span>
                                                            <span className={`font-bold ${unallocatedBudget < req.totalRequestedRwf ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                                {unallocatedBudget.toLocaleString()} Rwf
                                                            </span>
                                                        </div>
                                                        {unallocatedBudget < req.totalRequestedRwf && (
                                                            <span className="flex items-center gap-1 text-red-500 text-[10px] font-semibold">
                                                                <AlertCircle size={11} /> Exceeds budget!
                                                            </span>
                                                        )}
                                                    </div>

                                                    {isPending && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleRejectRequest(req.id)}
                                                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400 transition-all"
                                                            >
                                                                <ThumbsDown size={13} /> Reject
                                                            </button>
                                                            <button
                                                                onClick={() => handleApproveRequest(req.id)}
                                                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-md shadow-green-900/10 transition-all active:scale-[0.98]"
                                                            >
                                                                <ThumbsUp size={13} /> Approve
                                                            </button>
                                                        </div>
                                                    )}

                                                    {isApproved && (
                                                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold">
                                                            <CheckCircle2 size={14} /> Approved — tasks added to FM checklist
                                                        </div>
                                                    )}
                                                    {isRejected && (
                                                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                                            <AlertCircle size={14} /> Rejected
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
            />

            {/* Evidence View Modal */}
            <EvidenceViewModal
                isOpen={!!selectedEvidenceTask}
                onClose={() => setSelectedEvidenceTask(null)}
                task={selectedEvidenceTask}
                onApprove={() => handleEvidenceAction(selectedEvidenceTask?.id)}
                onReject={() => handleEvidenceAction(selectedEvidenceTask?.id)}
            />

            {/* Adjust Budget Modal */}
            <AdjustBudgetModal
                isOpen={isAdjustBudgetOpen}
                onClose={() => setIsAdjustBudgetOpen(false)}
                categories={ledgerDataState.categories}
                onAdjust={(categoryName, newAllocated) => {
                    setLedgerDataState(prev => {
                        const newCategories = prev.categories.map(cat => {
                            if (cat.name === categoryName) {
                                const newVariance = newAllocated - cat.spent;
                                const newStatus = newVariance >= 0 ? 'on_track' : 'over_budget';
                                return { ...cat, allocated: newAllocated, variance: newVariance, status: newStatus };
                            }
                            return cat;
                        });
                        return { ...prev, categories: newCategories };
                    });
                    setIsAdjustBudgetOpen(false);
                }}
            />

            {/* Confirm Close Modal */}
            <ConfirmCloseModal
                isOpen={isConfirmCloseOpen}
                onClose={() => setIsConfirmCloseOpen(false)}
                onConfirm={() => {
                    setCycleStatus('Completed');
                    setIsConfirmCloseOpen(false);
                    // Also switch back to overview tab to show updated status visually
                    setActiveTab('overview');
                }}
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

function AdjustBudgetModal({ isOpen, onClose, categories, onAdjust }: { isOpen: boolean; onClose: () => void; categories: any[]; onAdjust: (cat: string, amt: number) => void }) {
    const [selectedCat, setSelectedCat] = useState(categories[0]?.name || '');
    const [amount, setAmount] = useState<number | string>('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (!isNaN(numberAmount) && selectedCat) {
            onAdjust(selectedCat, numberAmount);
            setAmount('');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Adjust Category Budget</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Category</label>
                        <select
                            value={selectedCat}
                            onChange={(e) => setSelectedCat(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                        >
                            {categories.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name} (Current: {cat.allocated.toLocaleString()} Rwf)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Total Allocation (Rwf)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none dark:text-white"
                            placeholder="Enter new total allocated budget..."
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-lg transition-colors">Apply Adjustment</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function ConfirmCloseModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Activity size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white text-center mb-2">Close Crop Cycle?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    Are you sure you want to close this cycle? This will lock the financial ledger and prevent the Farm Manager from submitting further budget requests or field reports.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-2 font-bold text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                        Confirm Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CropCycleDetailModal;
