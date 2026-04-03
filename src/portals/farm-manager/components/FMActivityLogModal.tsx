import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X, ScrollText, CheckCircle2, XCircle,
    Coins, MessageSquare, StickyNote, CalendarDays,
    MapPin, Inbox
} from 'lucide-react';
import type { Task } from '../../shared/types/activity';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'completed' | 'rejected';

interface FMActivityLogModalProps {
    cycleName: string;
    /** All tasks that have a terminal status: completed or rejected */
    tasks: Task[];
    onClose: () => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const fmtRwf = (n?: number) =>
    n != null ? `${n.toLocaleString()} Rwf` : '—';

// ─── Row Component ────────────────────────────────────────────────────────────

const ActivityRow = ({ task }: { task: Task }) => {
    const isCompleted = task.completed;
    const isRejected  = task.approvalStatus === 'Rejected';

    return (
        <div className={`rounded-xl border p-4 space-y-3 transition-all ${
            isCompleted
                ? 'bg-green-50/70 dark:bg-green-900/10 border-green-100 dark:border-green-900/20'
                : 'bg-red-50/60 dark:bg-red-900/10 border-red-100 dark:border-red-900/20'
        }`}>

            {/* Top row: date + badge */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <CalendarDays size={11} />
                    {task.statusDate ?? task.date}
                </div>
                {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">
                        <CheckCircle2 size={9} /> Completed
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                        <XCircle size={9} /> Rejected
                    </span>
                )}
            </div>

            {/* Activity name + block */}
            <div>
                <p className={`text-sm font-bold leading-snug ${
                    isRejected
                        ? 'text-gray-500 dark:text-gray-400 line-through'
                        : 'text-gray-900 dark:text-white'
                }`}>
                    {task.title}
                </p>
                {task.block && (
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={9} className="shrink-0" />
                        {task.block}
                    </p>
                )}
            </div>

            {/* Financial summary */}
            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t ${
                isCompleted
                    ? 'border-green-100 dark:border-green-900/20'
                    : 'border-red-100 dark:border-red-900/20'
            }`}>
                <Coins size={12} className="text-gray-400 shrink-0" />
                {isCompleted ? (
                    <>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                            Est:&nbsp;
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {fmtRwf(task.approvedBudgetRwf)}
                            </span>
                        </span>
                        <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                            Actual:&nbsp;
                            <span className={`font-bold ${
                                task.actualCostRwf != null && task.approvedBudgetRwf != null
                                    ? task.actualCostRwf > task.approvedBudgetRwf
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-green-600 dark:text-green-400'
                                    : 'text-gray-700 dark:text-gray-300'
                            }`}>
                                {fmtRwf(task.actualCostRwf)}
                            </span>
                        </span>
                    </>
                ) : (
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Requested:&nbsp;
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {fmtRwf(task.estimatedCostRwf ?? task.approvedBudgetRwf)}
                        </span>
                    </span>
                )}
            </div>

            {/* Notes block */}
            {(task.pmNote || task.fieldNote) && (
                <div className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
                    isRejected
                        ? 'bg-red-100/60 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'bg-gray-100/80 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400'
                }`}>
                    {isRejected ? (
                        <MessageSquare size={12} className="shrink-0 mt-0.5 text-red-500" />
                    ) : (
                        <StickyNote size={12} className="shrink-0 mt-0.5 text-gray-400" />
                    )}
                    <span className="leading-relaxed">
                        <span className="font-bold">
                            {isRejected ? 'PM Note: ' : 'Field Note: '}
                        </span>
                        {isRejected ? task.pmNote : task.fieldNote}
                    </span>
                </div>
            )}
        </div>
    );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const FMActivityLogModal = ({ cycleName, tasks, onClose }: FMActivityLogModalProps) => {
    const [filter, setFilter] = useState<FilterTab>('all');

    const completed = tasks.filter(t => t.completed);
    const rejected  = tasks.filter(t => !t.completed && t.approvalStatus === 'Rejected');
    const allHistory = [...completed, ...rejected];

    const displayed =
        filter === 'completed' ? completed :
        filter === 'rejected'  ? rejected  :
        allHistory;

    // Sort by statusDate descending (most recent first) — falls back to task.date
    const sorted = [...displayed].sort((a, b) => {
        const da = new Date(a.statusDate ?? a.date).getTime() || 0;
        const db = new Date(b.statusDate ?? b.date).getTime() || 0;
        return db - da;
    });

    const TABS: { key: FilterTab; label: string; count: number }[] = [
        { key: 'all',       label: 'All',       count: allHistory.length },
        { key: 'completed', label: 'Completed',  count: completed.length  },
        { key: 'rejected',  label: 'Rejected',   count: rejected.length   },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[88vh] overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <ScrollText size={17} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                                Activity Log
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[240px]">
                                {cycleName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Filter Tabs ── */}
                <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                filter === tab.key
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {tab.label}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                filter === tab.key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto p-5">
                    {sorted.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center py-8 px-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                                <Inbox size={28} className="text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                No activity history yet
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">
                                {filter === 'all'
                                    ? 'Your completed field reports and rejected requests will appear here.'
                                    : filter === 'completed'
                                    ? 'No completed field reports yet. Submit a field report to see it here.'
                                    : 'No rejected requests — great news!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sorted.map(task => (
                                <ActivityRow key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer summary strip ── */}
                {allHistory.length > 0 && (
                    <div className="shrink-0 px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 flex items-center gap-4 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-green-500" />
                            {completed.length} completed
                        </span>
                        <span className="flex items-center gap-1">
                            <XCircle size={10} className="text-red-400" />
                            {rejected.length} rejected
                        </span>
                        <span className="ml-auto font-medium">
                            {allHistory.length} total entries
                        </span>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default FMActivityLogModal;
