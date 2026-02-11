'use client';

import { useRef, useState } from 'react';
import TemplateBadge from './TemplateBadge';

interface LogoUploadProps {
    logoUrl: string | null;
    onLogoChange: (base64: string) => void;
    onLogoRemove: () => void;
    disabled?: boolean;
    isProFeature?: boolean;
}

export default function LogoUpload({
    logoUrl,
    onLogoChange,
    onLogoRemove,
    disabled = false,
    isProFeature = false,
}: LogoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (PNG or JPG)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Logo must be smaller than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            onLogoChange(base64);
        };
        reader.readAsDataURL(file);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        if (isProFeature && disabled) {
            return;
        }
        inputRef.current?.click();
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-600">Company Logo</h3>
                        {isProFeature && <TemplateBadge size="sm" />}
                    </div>
                    <p className="text-xs text-gray-400">Appears on your invoice (PNG or JPG, max 2MB)</p>
                </div>
            </div>

            {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}

            {logoUrl ? (
                <div className="flex items-center gap-3">
                    <div className="w-20 h-14 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element -- User-uploaded data URL, Next.js Image not beneficial */}
                        <img
                            src={logoUrl}
                            alt="Company logo"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={handleClick}
                            disabled={disabled}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={onLogoRemove}
                            disabled={disabled}
                            className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled}
                    className={`w-full py-4 border-2 border-dashed rounded-lg transition-colors flex items-center justify-center gap-2 ${disabled
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-300 text-gray-500 hover:border-teal-400 hover:text-teal-600'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isProFeature ? 'Upload Logo (PRO)' : 'Upload Logo'}
                </button>
            )}

            {isProFeature && disabled && (
                <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <p className="text-xs text-teal-800">
                        <strong>PRO Feature:</strong> Upload your company logo to appear on invoices.
                        Upgrade to PRO to unlock this feature.
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
                aria-label="Logo file input"
            />
        </div>
    );
}
