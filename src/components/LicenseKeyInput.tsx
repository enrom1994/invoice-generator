'use client';

import { useState } from 'react';

interface LicenseKeyInputProps {
  onActivate: (key: string) => boolean;
  onCancel?: () => void;
  compact?: boolean;
}

export default function LicenseKeyInput({ onActivate, onCancel, compact = false }: LicenseKeyInputProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!key.trim()) {
      setError('Please enter your license key');
      return;
    }

    setIsActivating(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const success = onActivate(key.trim().toUpperCase());

    if (success) {
      setSuccess(true);
      setKey('');
    } else {
      setError('Invalid license key. Please check and try again.');
    }

    setIsActivating(false);
  };

  const formatKey = (value: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Handle the INV-PRO prefix separately
    let prefix = '';
    let remaining = cleaned;

    if (cleaned.startsWith('INVPRO')) {
      // If user types INVPRO, format it as INV-PRO
      prefix = 'INV-PRO';
      remaining = cleaned.slice(6); // Remove INVPRO
    } else if (cleaned.startsWith('INV')) {
      // Partial prefix typed
      prefix = cleaned.slice(0, Math.min(6, cleaned.length));
      remaining = cleaned.slice(6);
    }

    // Split remaining into groups of 4 characters
    const parts = [];
    for (let i = 0; i < remaining.length; i += 4) {
      parts.push(remaining.slice(i, i + 4));
    }

    // Combine prefix with grouped parts
    const result = prefix ? `${prefix}-${parts.join('-')}` : parts.join('-');

    // Limit to 27 characters (INV-PRO-XXXX-XXXX-XXXX-XXXX)
    return result.replace(/-+$/, '').slice(0, 27);
  };

  if (success) {
    return (
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium text-teal-800">PRO Activated Successfully!</p>
            <p className="text-sm text-teal-600">All PRO features are now unlocked.</p>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Key
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(formatKey(e.target.value))}
            placeholder="INV-PRO-XXXX-XXXX-XXXX-XXXX"
            maxLength={27}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isActivating}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActivating ? 'Activating...' : 'Activate'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Activate PRO</h2>
        <p className="text-gray-600">Enter your license key to unlock all PRO features</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Key
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(formatKey(e.target.value))}
            placeholder="INV-PRO-XXXX-XXXX-XXXX-XXXX"
            maxLength={27}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center text-lg tracking-wider"
          />
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Format: <code className="bg-gray-100 px-1 py-0.5 rounded">INV-PRO-XXXX-XXXX-XXXX-XXXX</code></span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-red-600 whitespace-pre-line">{error}</div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isActivating}
          className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isActivating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Activating...
            </span>
          ) : (
            'Activate License'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-teal-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-teal-800">Personal Use Only</p>
            <p className="text-xs text-teal-700 mt-1">
              License keys are for personal use only. Sharing your key violates our terms of service.
              Please respect the honor system - we trust you. 🙏
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Do not have a license key?{' '}
          <a
            href="#"
            className="text-teal-600 hover:text-teal-700 font-medium"
            onClick={(e) => {
              e.preventDefault();
              alert('This would link to your Gumroad product page');
            }}
          >
            Purchase PRO - $12
          </a>
        </p>
      </div>
    </div>
  );
}
