'use client';

import { PaymentQRCode } from '@/types/invoice';

interface PaymentQRSettingsProps {
  paymentQR: PaymentQRCode;
  onChange: (qr: PaymentQRCode) => void;
}

export default function PaymentQRSettings({ paymentQR, onChange }: PaymentQRSettingsProps) {
  const handleToggle = () => {
    onChange({
      ...paymentQR,
      enabled: !paymentQR.enabled,
    });
  };

  const handleTypeChange = (type: PaymentQRCode['type']) => {
    onChange({
      ...paymentQR,
      type,
    });
  };

  const handleValueChange = (value: string) => {
    onChange({
      ...paymentQR,
      value,
    });
  };

  const handleLabelChange = (label: string) => {
    onChange({
      ...paymentQR,
      label,
    });
  };

  const getPlaceholder = () => {
    switch (paymentQR.type) {
      case 'paypal':
        return 'https://paypal.me/yourname/100';
      case 'venmo':
        return '@yourusername or venmo://paycharge?txn=pay&recipients=yourname';
      case 'crypto':
        return 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001';
      case 'custom':
        return 'https://your-payment-link.com/pay';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: PaymentQRCode['type']) => {
    switch (type) {
      case 'paypal':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.724c2.838 0 4.908.647 5.83 1.925.52.724.766 1.634.737 2.736-.048 1.954-.866 3.65-2.364 4.896-1.654 1.373-3.858 2.072-6.549 2.072H9.93l-.982 6.318a.641.641 0 0 1-.633.74H7.076zM21.927 9.383c-.033.206-.07.418-.112.635-.68 3.624-2.99 4.87-5.947 4.87h-1.62a.755.755 0 0 0-.745.632l-.499 3.18-.154.988a.418.418 0 0 0 .412.486h2.89a.703.703 0 0 0 .692-.587l.03-.143.551-3.51.036-.195a.703.703 0 0 1 .692-.587h.436c2.82 0 5.028-1.146 5.673-4.206.27-1.383.132-2.539-.464-3.368a2.02 2.02 0 0 0-.597-.592z"/>
          </svg>
        );
      case 'venmo':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.94 8.08c.57-.47 1.41-.71 2.5-.71 1.5 0 2.65.53 3.43 1.58.78 1.05 1.18 2.55 1.18 4.49 0 1.78-.37 3.46-1.1 5.05-.74 1.58-1.75 2.97-3.04 4.16l-2.57-1.35c.78-.78 1.44-1.68 1.97-2.71.53-1.03.85-2.08.96-3.15-.33.37-.73.67-1.2.89-.47.22-.97.33-1.49.33-1.21 0-2.18-.39-2.9-1.16-.73-.78-1.09-1.81-1.09-3.1 0-1.36.35-2.46 1.05-3.32zM17.72.91l2.75 1.14c-.38 1.21-.88 2.55-1.5 4.02-.62 1.47-1.3 2.93-2.04 4.38.26-.12.53-.21.81-.27.28-.06.56-.09.84-.09 1.37 0 2.43.46 3.17 1.38.74.92 1.11 2.15 1.11 3.7 0 1.78-.4 3.44-1.2 4.96-.8 1.53-1.87 2.74-3.21 3.64l-2.14-1.42c1.21-.8 2.17-1.81 2.87-3.02.7-1.21 1.06-2.5 1.06-3.86 0-.86-.19-1.52-.56-1.97-.38-.46-.92-.68-1.63-.68-.61 0-1.17.18-1.68.53-.51.35-.95.82-1.32 1.4l-2.06-1.28c.64-1.37 1.41-2.79 2.31-4.26.9-1.47 1.86-2.89 2.87-4.26.38-.53.76-1.03 1.14-1.51.38-.48.74-.91 1.08-1.29z"/>
          </svg>
        );
      case 'crypto':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'custom':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Payment QR Code</h3>
              <p className="text-sm text-gray-500">Add a scannable QR code for instant payments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={paymentQR.enabled}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>
      </div>

      {paymentQR.enabled && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {/* QR Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['paypal', 'venmo', 'crypto', 'custom'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                    paymentQR.type === type
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {getTypeIcon(type)}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* QR Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label Text
            </label>
            <input
              type="text"
              value={paymentQR.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Scan to Pay"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Text shown below the QR code</p>
          </div>

          {/* QR Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment URL or Address
            </label>
            <input
              type="text"
              value={paymentQR.value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the full URL or payment address to encode
            </p>
          </div>

          {/* Preview hint */}
          {paymentQR.value && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">
                  The QR code will appear on your invoice PDF. Test it by scanning with your phone camera before sending to clients.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
