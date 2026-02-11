'use client';

import { AppSettings, DEFAULT_SETTINGS } from '@/types/invoice';

interface WhatsAppSettingsProps {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
}

export default function WhatsAppSettings({ settings, onChange }: WhatsAppSettingsProps) {
  const handleTemplateChange = (whatsappMessageTemplate: string) => {
    onChange({
      ...settings,
      whatsappMessageTemplate,
    });
  };

  const handleReset = () => {
    onChange({
      ...settings,
      whatsappMessageTemplate: DEFAULT_SETTINGS.whatsappMessageTemplate,
    });
  };

  const variables = [
    { name: '{{clientName}}', description: 'Client\'s name' },
    { name: '{{documentType}}', description: 'Invoice or Quotation' },
    { name: '{{invoiceNumber}}', description: 'Document number' },
    { name: '{{currency}}', description: 'Currency symbol' },
    { name: '{{totalAmount}}', description: 'Total amount' },
  ];

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">WhatsApp Message</h3>
          <p className="text-sm text-gray-500">Customize the message sent with invoices</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Template Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message Template
          </label>
          <textarea
            value={settings.whatsappMessageTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm resize-none"
            placeholder={DEFAULT_SETTINGS.whatsappMessageTemplate}
          />
          <p className="text-xs text-gray-500 mt-1">
            Use variables below to personalize the message
          </p>
        </div>

        {/* Available Variables */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Available Variables
          </label>
          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <button
                key={variable.name}
                onClick={() => {
                  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = settings.whatsappMessageTemplate;
                    const newText = text.substring(0, start) + variable.name + text.substring(end);
                    handleTemplateChange(newText);
                    // Focus back and set cursor position
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + variable.name.length, start + variable.name.length);
                    }, 0);
                  }
                }}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
                title={variable.description}
              >
                {variable.name}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
            Preview
          </label>
          <p className="text-sm text-gray-700">
            {settings.whatsappMessageTemplate
              .replace(/{{clientName}}/g, 'John Smith')
              .replace(/{{documentType}}/g, 'invoice')
              .replace(/{{invoiceNumber}}/g, 'INV-001')
              .replace(/{{currency}}/g, '$')
              .replace(/{{totalAmount}}/g, '1,250.00')}
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}
