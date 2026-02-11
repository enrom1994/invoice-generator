'use client';

import { useRef, useState } from 'react';

interface DataManagerProps {
  canImportExport: boolean;
  onImport: (data: string) => void;
}

export default function DataManager({ canImportExport, onImport }: DataManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<string | null>(null);

  const handleExport = () => {
    if (!canImportExport) return;

    try {
      // Gather all data from localStorage
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          license: localStorage.getItem('invoice_gen_pro_license'),
          features: localStorage.getItem('invoice_gen_pro_features'),
          clients: localStorage.getItem('invoice_gen_clients'),
          drafts: localStorage.getItem('invoice_gen_drafts'),
          settings: localStorage.getItem('invoice_gen_settings'),
          autoSave: localStorage.getItem('invoice_gen_autosave'),
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-generator-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImportClick = () => {
    if (!canImportExport) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Validate the backup format
        if (!parsed.version || !parsed.data) {
          setImportError('Invalid backup file format');
          return;
        }

        setPendingImportData(content);
        setShowImportConfirm(true);
        setImportError(null);
      } catch {
        setImportError('Failed to parse backup file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    e.target.value = '';
  };

  const confirmImport = () => {
    if (pendingImportData) {
      onImport(pendingImportData);
      setShowImportConfirm(false);
      setPendingImportData(null);
    }
  };

  if (!canImportExport) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Data Backup</h3>
            <p className="text-sm text-gray-500">Export and import your data (PRO feature)</p>
          </div>
          <span className="ml-auto text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">PRO</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Data Backup</h3>
          <p className="text-sm text-gray-500">Export and import your data</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Backup
        </button>
        <button
          onClick={handleImportClick}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Backup
        </button>
      </div>

      {importError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{importError}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Import Confirmation Modal */}
      {showImportConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Import</h3>
                <p className="text-sm text-gray-500">This will replace all your current data</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Importing will overwrite your current settings, clients, and drafts. This action cannot be undone. Make sure you have exported a backup first if needed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImportConfirm(false);
                  setPendingImportData(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
