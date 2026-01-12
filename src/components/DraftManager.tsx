'use client';

import { useState } from 'react';
import { InvoiceDraft } from '@/types/invoice';

interface DraftManagerProps {
    drafts: InvoiceDraft[];
    onLoad: (draft: InvoiceDraft) => void;
    onSave: () => void;
    onDelete: (id: string) => void;
    hasUnsavedChanges?: boolean;
}

export default function DraftManager({
    drafts,
    onLoad,
    onSave,
    onDelete,
    hasUnsavedChanges = false,
}: DraftManagerProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {/* Save Draft Button */}
            <button
                type="button"
                onClick={onSave}
                className="p-2 sm:px-3 sm:py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                title="Save Draft"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="hidden sm:inline">Save Draft</span>
            </button>

            {/* Load Draft Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={drafts.length === 0}
                    className={`p-2 sm:px-3 sm:py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${drafts.length > 0
                        ? 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                        }`}
                    title={`Load Draft (${drafts.length})`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="hidden sm:inline">Load ({drafts.length})</span>
                    <span className="hidden sm:inline text-gray-400">▼</span>
                </button>

                {showDropdown && drafts.length > 0 && (
                    <div className="absolute right-0 z-20 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        <div className="p-2 border-b border-gray-100 bg-gray-50">
                            <span className="text-xs font-medium text-gray-500 uppercase">Saved Drafts</span>
                        </div>
                        {drafts.map((draft) => (
                            <div
                                key={draft.id}
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onLoad(draft);
                                        setShowDropdown(false);
                                    }}
                                    className="flex-1 text-left"
                                >
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {draft.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatDate(draft.savedAt)}
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(draft.id);
                                    }}
                                    className="ml-2 p-1 text-gray-400 hover:text-red-500"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Auto-save indicator - only green dot on mobile */}
            <span className="text-xs text-gray-400 flex items-center gap-1" title="Auto-saving enabled">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="hidden sm:inline">Auto-saving</span>
            </span>
        </div>
    );
}
