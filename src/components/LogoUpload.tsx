'use client';

import { useRef } from 'react';

interface LogoUploadProps {
    logoUrl: string | null;
    onLogoChange: (base64: string) => void;
    onLogoRemove: () => void;
}

export default function LogoUpload({ logoUrl, onLogoChange, onLogoRemove }: LogoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG or JPG)');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Logo must be smaller than 2MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            onLogoChange(base64);
        };
        reader.readAsDataURL(file);

        // Reset input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600">Company Logo</h3>
                    <p className="text-xs text-gray-400">Appears on your invoice (PNG or JPG)</p>
                </div>
            </div>

            {logoUrl ? (
                <div className="flex items-center gap-4">
                    {/* Logo preview */}
                    <div className="w-24 h-16 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2">
                        <img
                            src={logoUrl}
                            alt="Company logo"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={onLogoRemove}
                            className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Logo
                </button>
            )}

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
