import { useState } from 'react';
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

    // Determines if the "Complete" button should be enabled
    const canComplete = !task.proofRequired || (task.proofRequired && proofImage);

    const handleUpload = () => {
        // Simulate upload
        setProofImage('https://images.unsplash.com/photo-1625246333195-58197bd47d26?auto=format&fit=crop&q=80&w=300&h=200');
    };

    const handleRemoveProof = () => {
        setProofImage(null);
    };

    const isOverdue = true; // In a real app, check date vs today

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {isOverdue ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                                    <Clock size={10} /> Due Today
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    Due {task.date}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                            {task.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 group"
                    >
                        <X size={24} className="group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto space-y-6">

                    {/* Instructions / SOP */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText size={18} className="text-emerald-600" />
                            Standard Operating Procedure
                        </h3>
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {task.sop || "Follow standard farm protocols for this activity. Ensure all safety equipment is worn."}
                        </div>

                        {task.proofRequired && (
                            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <p>Photo evidence is required to mark this task as complete. Please upload a clear photo of the work done.</p>
                            </div>
                        )}
                    </div>

                    {/* Evidence Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Camera size={18} className="text-emerald-600" />
                            Evidence
                        </label>

                        {!proofImage ? (
                            <button
                                onClick={handleUpload}
                                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all bg-gray-50 dark:bg-gray-800"
                            >
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center">
                                    <UploadCloud size={20} />
                                </div>
                                <span className="font-bold text-sm">Tap to Take Photo / Upload</span>
                            </button>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                <img src={proofImage} alt="Evidence" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={handleRemoveProof}
                                        className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/20 flex items-center gap-2"
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <CheckCircle2 size={10} /> Uploaded
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                            Notes / Comments (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any issues encountered? e.g., Delayed due to rain..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                            rows={3}
                        />
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
                    {task.proofRequired && !proofImage && (
                        <p className="text-xs text-center text-red-500 font-medium animate-pulse">
                            * Please upload photo evidence to complete
                        </p>
                    )}
                    <button
                        onClick={() => onComplete(task.id, notes, !!proofImage)}
                        disabled={!canComplete}
                        className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${canComplete
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        <CheckCircle2 size={18} />
                        Mark as Complete
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TaskExecutionModal;
