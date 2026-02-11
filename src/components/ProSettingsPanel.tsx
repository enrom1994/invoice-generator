'use client';

import { AppSettings, PaymentQRCode, TemplateType } from '@/types/invoice';
import PaymentQRSettings from './PaymentQRSettings';
import WhatsAppSettings from './WhatsAppSettings';
import ColorCustomizer from './ColorCustomizer';

interface ProSettingsPanelProps {
  paymentQR: PaymentQRCode;
  onPaymentQRChange: (qr: PaymentQRCode) => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  templateId?: TemplateType;
  primaryColor?: string;
  accentColor?: string;
  onPrimaryColorChange?: (color: string) => void;
  onAccentColorChange?: (color: string) => void;
}

export default function ProSettingsPanel({
  paymentQR,
  onPaymentQRChange,
  settings,
  onSettingsChange,
  templateId,
  primaryColor,
  accentColor,
  onPrimaryColorChange,
  onAccentColorChange,
}: ProSettingsPanelProps) {
  const hasColorSettings = onPrimaryColorChange && onAccentColorChange;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">PRO Settings</h2>
          <p className="text-sm text-gray-500">Customize your invoice experience</p>
        </div>
      </div>

      <div className="space-y-6">
        {hasColorSettings && (
          <ColorCustomizer
            primaryColor={primaryColor || '#059669'}
            accentColor={accentColor || '#059669'}
            templateId={templateId}
            onPrimaryChange={onPrimaryColorChange}
            onAccentChange={onAccentColorChange}
          />
        )}

        <PaymentQRSettings
          paymentQR={paymentQR}
          onChange={onPaymentQRChange}
        />

        <WhatsAppSettings
          settings={settings}
          onChange={onSettingsChange}
        />
      </div>
    </div>
  );
}
