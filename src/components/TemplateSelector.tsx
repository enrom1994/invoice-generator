'use client';

import { useState } from 'react';
import { TemplateType } from '@/types/invoice';
import { TEMPLATES, getFreeTemplates, getProTemplates } from '@/lib/templates';
import TemplateBadge from './TemplateBadge';

interface TemplateSelectorProps {
    value: TemplateType;
    onChange: (value: TemplateType) => void;
    canUseProTemplates: boolean;
    mounted?: boolean;
}

export default function TemplateSelector({
    value,
    onChange,
    canUseProTemplates,
    mounted = false,
}: TemplateSelectorProps) {
    const [activeTab, setActiveTab] = useState<'free' | 'pro'>('free');

    const freeTemplates = getFreeTemplates();
    const proTemplates = getProTemplates();

    const handleTemplateClick = (templateId: TemplateType, isFree: boolean) => {
        if (!isFree && !canUseProTemplates) {
            return;
        }
        onChange(templateId);
    };

    const getPreviewGradient = (id: string): string => {
        switch (id) {
            case 'minimal':
                return 'bg-gradient-to-br from-gray-100 to-gray-300';
            case 'modern':
                return 'bg-gradient-to-br from-teal-400 to-teal-600';
            case 'compact':
                return 'bg-gradient-to-br from-slate-700 to-slate-900';
            case 'sidebar':
                return 'bg-gradient-to-br from-blue-500 to-blue-700';
            case 'letterhead':
                return 'bg-gradient-to-br from-indigo-500 to-indigo-700';
            case 'executive':
                return 'bg-gradient-to-br from-slate-600 to-slate-800';
            case 'split':
                return 'bg-gradient-to-br from-teal-400 to-teal-600';
            case 'card':
                return 'bg-gradient-to-br from-violet-500 to-violet-700';
            case 'luxury-minimal':
                return 'bg-gradient-to-br from-zinc-300 to-zinc-500';
            default:
                return 'bg-gradient-to-br from-gray-200 to-gray-400';
        }
    };

    const getTemplateIcon = (id: string): string => {
        switch (id) {
            case 'minimal':
                return '⊞';
            case 'modern':
                return '◈';
            case 'compact':
                return '▤';
            case 'sidebar':
                return '▧';
            case 'letterhead':
                return '▥';
            case 'executive':
                return '◉';
            case 'split':
                return '◫';
            case 'card':
                return '▦';
            case 'luxury-minimal':
                return '◇';
            default:
                return '▢';
        }
    };

    const renderTemplateCard = (template: typeof TEMPLATES[0]) => {
        const isSelected = value === template.id;
        const isLocked = !template.isFree && !canUseProTemplates;

        return (
            <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateClick(template.id, template.isFree)}
                disabled={mounted && isLocked}
                className={`relative group p-3 rounded-xl border-2 text-left transition-all duration-200 ${mounted && isSelected
                        ? 'border-teal-500 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                    } ${mounted && isLocked ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
            >
                {/* Preview Area */}
                <div className={`w-full h-16 rounded-lg mb-3 ${getPreviewGradient(template.id)} flex items-center justify-center relative overflow-hidden`}>
                    <span className="text-3xl text-white/90 font-light drop-shadow-md">
                        {getTemplateIcon(template.id)}
                    </span>

                    {/* Hover overlay */}
                    {!isLocked && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    )}
                </div>

                {/* Template Info */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                                {template.name}
                            </span>
                            {mounted && !template.isFree && (
                                <TemplateBadge size="sm" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{template.description}</p>
                    </div>

                    {/* Selection indicator */}
                    {mounted && isSelected && (
                        <div className="flex-shrink-0 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Lock overlay for pro templates when not subscribed */}
                {mounted && isLocked && (
                    <div className="absolute inset-0 bg-gray-50/60 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center">
                        <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
                            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-teal-600 mt-2">PRO</span>
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header with tabs */}
            <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                    Template Style
                </label>
                {mounted && !canUseProTemplates && (
                    <TemplateBadge size="sm" />
                )}
            </div>

            {/* Tab Buttons */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                    type="button"
                    onClick={() => setActiveTab('free')}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeTab === 'free'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Free ({freeTemplates.length})
                </button>
                <button
                    type="button"
                    onClick={() => canUseProTemplates && setActiveTab('pro')}
                    disabled={!canUseProTemplates}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === 'pro'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : canUseProTemplates
                                ? 'text-gray-600 hover:text-gray-900'
                                : 'text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Pro ({proTemplates.length})
                    {!canUseProTemplates && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-3">
                {activeTab === 'free'
                    ? freeTemplates.map(renderTemplateCard)
                    : proTemplates.map(renderTemplateCard)
                }
            </div>

            {/* Helper text */}
            {mounted && !canUseProTemplates && activeTab === 'free' && (
                <p className="text-xs text-gray-500 text-center">
                    Switch to the Pro tab to see premium templates
                </p>
            )}

            {mounted && !canUseProTemplates && activeTab === 'pro' && (
                <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-sm text-teal-800">
                        Unlock {proTemplates.length} premium templates with PRO
                    </p>
                    <p className="text-xs text-teal-600 mt-1">
                        Executive, Split, Card, Luxury Minimal, and more
                    </p>
                </div>
            )}
        </div>
    );
}
