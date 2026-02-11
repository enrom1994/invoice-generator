'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeDisplay({ value, size = 128, className = '' }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const prevValueRef = useRef(value);

  const generateQR = useCallback(async () => {
    if (!value) {
      setDataUrl(null);
      setError(null);
      return;
    }

    try {
      const url = await QRCode.toDataURL(value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setDataUrl(url);
        setError(null);
      }
    } catch (err) {
      console.error('QR Code generation failed:', err);
      if (isMountedRef.current) {
        setError('Failed to generate QR code');
        setDataUrl(null);
      }
    }
  }, [value, size]);

  useEffect(() => {
    // Reset mounted flag on mount
    isMountedRef.current = true;
    
    // Only regenerate if value changed
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateQR();
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [value, size, generateQR]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
        style={{ width: size, height: size }}
        role="img"
        aria-label="QR code generation failed"
      >
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
        style={{ width: size, height: size }}
        aria-label="Generating QR code"
      >
        <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-teal-500 rounded-full"></div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- QR code data URL, Next.js Image not beneficial
    <img
      src={dataUrl}
      alt="Payment QR Code"
      className={`${className}`}
      style={{ width: size, height: size }}
    />
  );
}
