import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Camera, UploadCloud, AlertCircle,
    CheckCircle2, Clock, FileText, Trash2
} from 'lucide-react';

interface Task {
    id: number;
    title: string;
    date: string;
    completed: boolean;
    proofRequired?: boolean;
    sop?: string;
}

interface TaskExecutionModalProps {
    task: Task;
    onClose: () => void;
    onComplete: (taskId: number, notes: string, hasProof: boolean) => void;
}

const TaskExecutionModal = ({ task, onClose, onComplete }: TaskExecutionModalProps) => {
    const [notes, setNotes] = useState('');
    const [proofImage, setProofImage] = useState<string | null>(null);

    const canComplete = !task.proofRequired || (task.proofRequired && proofImage);

    const handleUpload = () => {
        setProofImage('https://images.unsplash.com/photo-1625246333195-58197bd47d26?auto=format&fit=crop&q=80&w=300&h=200');
    };

    const handleRemoveProof = () => {
        setProofImage(null);
    };

    const isOverdue = true;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 max-h-[90vh]">

                {/* Header */}
                <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {isOverdue ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <Clock size={10} /> Due Today
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    Due {task.date}
                                </span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {task.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0 mt-0.5"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Standard Operating Procedure */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
                            Standard Operating Procedure
                        </h3>
                        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {task.sop || 'Follow standard farm protocols for this activity. Ensure all safety equipment is worn.'}
                        </div>

                        {task.proofRequired && (
                            <div className="flex items-start gap-2.5 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-medium">
                                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                                <p>Photo evidence is required to mark this task as complete. Please upload a clear photo of the work done.</p>
                            </div>
                        )}
                    </div>

                    {/* Evidence Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Camera size={16} className="text-emerald-600 dark:text-emerald-400" />
                            Evidence
                        </label>

                        {!proofImage ? (
                            <button
                                onClick={handleUpload}
                                className="w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all bg-gray-50/60 dark:bg-gray-700/30"
                            >
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center justify-center">
                                    <UploadCloud size={18} />
                                </div>
                                <span className="text-sm font-semibold">Tap to Take Photo / Upload</span>
                            </button>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                <img src={proofImage} alt="Evidence" className="w-full h-44 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={handleRemoveProof}
                                        className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/20 flex items-center gap-2 border border-white/20"
                                    >
                                        <Trash2 size={15} /> Remove
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <CheckCircle2 size={10} /> Uploaded
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Notes / Comments <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any issues encountered? e.g., Delayed due to rain..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition resize-none"
                            rows={3}
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 space-y-2.5">
                    {task.proofRequired && !proofImage && (
                        <p className="text-xs text-center text-red-500 font-medium">
                            * Please upload photo evidence to complete
                        </p>
                    )}
                    <button
                        onClick={() => onComplete(task.id, notes, !!proofImage)}
                        disabled={!canComplete}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${canComplete
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/25 active:scale-[0.98]'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <CheckCircle2 size={17} />
                        Mark as Complete
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default TaskExecutionModal;
