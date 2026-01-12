'use client';

import { TemplateType } from '@/types/invoice';

interface TemplateSelectorProps {
    value: TemplateType;
    onChange: (value: TemplateType) => void;
}

const templates: { id: TemplateType; name: string; description: string }[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean design with emerald accents',
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional business style',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Ultra-clean simplicity',
    },
];

export default function TemplateSelector({
    value,
    onChange,
}: TemplateSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Template Style
            </label>
            <div className="grid grid-cols-3 gap-2">
                {templates.map((template) => {
                    const isSelected = value === template.id;

                    return (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => onChange(template.id)}
                            className={`relative p-3 rounded-lg border-2 text-left transition-all ${isSelected
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {/* Template preview icon */}
                            <div className={`w-full h-12 rounded mb-2 ${template.id === 'modern' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                                template.id === 'classic' ? 'bg-gradient-to-br from-slate-700 to-slate-900' :
                                    'bg-gradient-to-br from-gray-100 to-gray-300'
                                }`} />

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                    {template.name}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>

                            {/* Selected checkmark */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
