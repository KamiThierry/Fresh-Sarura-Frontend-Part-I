import React, { useState } from 'react';
import {
    Sprout, Calendar, AlertTriangle, CheckCircle2,
    Plus, X, ChevronRight, Droplets, Leaf, Coins,
    Camera, AlertCircle
} from 'lucide-react';
import TaskExecutionModal from '../components/TaskExecutionModal';

// --- Types ---
interface Task {
    id: number;
    title: string;
    date: string;
    completed: boolean;
    proofRequired?: boolean;
    sop?: string;
}

interface CropCycle {
    id: number;
    crop: string;
    variety: string;
    season: string;
    stage: 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';
    budgetUsed: number; // Percentage
    targetYield: string;
    nextMilestone: string;
    tasks: Task[];
}

// --- Mock Data ---
const MOCK_CYCLES: CropCycle[] = [
    {
        id: 1,
        crop: 'Avocado',
        variety: 'Hass',
        season: 'Season A 2026',
        stage: 'Fruiting',
        budgetUsed: 65,
        targetYield: '5,000 kg',
        nextMilestone: 'Fertilizer Application (Due Oct 15)',
        tasks: [
            {
                id: 101,
                title: 'Pruning maintenance',
                date: 'Oct 10',
                completed: true,
                proofRequired: true,
                sop: "Remove all dead or diseased branches. Prune aimed at opening up the canopy to light. Ensure cuts are clean and angled."
            },
            {
                id: 102,
                title: 'Apply NPK Fertilizer',
                date: 'Oct 15',
                completed: false,
                proofRequired: true,
                sop: "Apply 2kg per tree. Spread evenly around the drip line, not against the trunk. Water immediately after application."
            },
            {
                id: 103,
                title: 'Pest Scouting',
                date: 'Oct 18',
                completed: false,
                proofRequired: false,
                sop: "Walk the perimeter and X-pattern through the block. Check 10 trees randomly for mites and thrips."
            },
        ]
    },
    {
        id: 2,
        crop: 'Chili',
        variety: 'Bird Eye',
        season: 'Season B 2026',
        stage: 'Flowering',
        budgetUsed: 92, // Over budget warning
        targetYield: '1,200 kg',
        nextMilestone: 'Pest Control Spray',
        tasks: [
            {
                id: 201,
                title: 'Weeding Channel A',
                date: 'Oct 12',
                completed: true,
                proofRequired: false
            },
            {
                id: 202,
                title: 'Irrigation Check',
                date: 'Oct 13',
                completed: true,
                proofRequired: true
            },
            {
                id: 203,
                title: 'Fungal Spray',
                date: 'Oct 14',
                completed: false,
                proofRequired: true,
                sop: "Mix Copper Fungicide at 50ml/20L. Spray till runoff, focusing on undersides of leaves. Wear full PPE."
            },
        ]
    }
];

const CropPlanning = () => {
    const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<CropCycle | null>(null);

    // Task Execution State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleRequestClick = (cycle: CropCycle) => {
        setSelectedCycle(cycle);
        setIsRequisitionModalOpen(true);
    };

    const handleTaskClick = (task: Task) => {
        if (!task.completed) {
            setSelectedTask(task);
        }
    };

    const handleTaskComplete = (taskId: number, notes: string, hasProof: boolean) => {
        // In a real app, you would make an API call here
        console.log(`Task ${taskId} completed with notes: ${notes} and proof: ${hasProof}`);
        alert("Task marked as complete!");
        setSelectedTask(null);
    };

    const closeRequisitionModal = () => {
        setIsRequisitionModalOpen(false);
        setSelectedCycle(null);
    };

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API Call
        alert(`Request sent for ${selectedCycle?.crop} to Production Manager.`);
        closeRequisitionModal();
    };

    return (
        <div className="p-4 md:p-6 pb-24 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Sprout className="text-green-600" />
                        My Active Crop Cycles
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your assigned crops, track budgets, and request inputs.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            {MOCK_CYCLES.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {MOCK_CYCLES.map(cycle => (
                        <CycleCard
                            key={cycle.id}
                            cycle={cycle}
                            onRequestInput={() => handleRequestClick(cycle)}
                            onTaskClick={handleTaskClick}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}

            {/* Requisition Modal */}
            {isRequisitionModalOpen && selectedCycle && (
                <RequisitionModal cycle={selectedCycle} onClose={closeRequisitionModal} onSubmit={handleSubmitRequest} />
            )}

            {/* Task Execution Modal */}
            {selectedTask && (
                <TaskExecutionModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onComplete={handleTaskComplete}
                />
            )}
        </div>
    );
};

// --- Sub-Components ---

const CycleCard = ({ cycle, onRequestInput, onTaskClick }: { cycle: CropCycle; onRequestInput: () => void; onTaskClick: (task: Task) => void }) => {
    const getBudgetColor = (percent: number) => {
        if (percent > 90) return 'bg-red-500';
        if (percent > 75) return 'bg-orange-400';
        return 'bg-green-500';
    };

    const getBudgetTextColor = (percent: number) => {
        if (percent > 90) return 'text-red-600';
        if (percent > 75) return 'text-orange-600';
        return 'text-gray-600 dark:text-gray-400';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
            {/* Card Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-700/20">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{cycle.crop}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-wide">
                            {cycle.stage}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {cycle.variety} • {cycle.season}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 flex items-center justify-center shadow-sm">
                    <Leaf size={20} className="text-green-600" />
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 flex-1">
                {/* 1. Budget Bar */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Coins size={14} className="text-gray-400" />
                            Budget Usage
                        </span>
                        <span className={`text-xs font-bold ${getBudgetTextColor(cycle.budgetUsed)}`}>
                            {cycle.budgetUsed}% Used
                        </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getBudgetColor(cycle.budgetUsed)}`}
                            style={{ width: `${cycle.budgetUsed}%` }}
                        ></div>
                    </div>
                    {cycle.budgetUsed > 90 && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertTriangle size={10} />
                            Critical: Budget nearly exhausted.
                        </p>
                    )}
                </div>

                {/* 2. Key Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Target Yield</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{cycle.targetYield}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Next Milestone</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{cycle.nextMilestone}</p>
                    </div>
                </div>

                {/* 3. Tasks */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Upcoming Tasks</h4>
                        <span className="text-[10px] text-gray-400">Tap to execute</span>
                    </div>
                    <div className="space-y-1">
                        {cycle.tasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => onTaskClick(task)}
                                className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-all border border-transparent ${task.completed
                                    ? 'opacity-60 cursor-default'
                                    : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-100 dark:hover:border-gray-600 active:scale-[0.99] group'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-emerald-500'}`}>
                                    {task.completed && <CheckCircle2 size={10} className="text-white" />}
                                </div>
                                <span className={`text-xs flex-1 truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400'}`}>
                                    {task.title}
                                </span>
                                {task.proofRequired && !task.completed && (
                                    <Camera size={12} className="text-gray-400 group-hover:text-emerald-500 shrink-0" />
                                )}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${task.completed
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-700'
                                    }`}>
                                    {task.date}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={onRequestInput}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Request Inputs / Funds
                </button>
            </div>
        </div>
    );
};

const RequisitionModal = ({ cycle, onClose, onSubmit }: { cycle: CropCycle; onClose: () => void; onSubmit: (e: React.FormEvent) => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Request Inputs</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">For {cycle.crop} ({cycle.variety})</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Fertilizer', 'Seeds', 'Labor', 'Chemicals'].map((cat) => (
                            <label key={cat} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group">
                                <input type="radio" name="category" className="accent-emerald-600" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Quantity / Amount</label>
                        <input type="text" placeholder="e.g. 50 kg" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Required By</label>
                        <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Reason for Request</label>
                    <textarea
                        rows={3}
                        placeholder="Why is this needed?"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                    ></textarea>
                </div>

                <div className="pt-2">
                    <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 transition-transform active:scale-[0.98]">
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Sprout size={40} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">No active crop cycles</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You don't have any assigned crops for this season. Contact HQ to start a new season plan.
        </p>
    </div>
);

export default CropPlanning;
