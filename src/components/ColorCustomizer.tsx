'use client';

import { useState, useRef, useEffect } from 'react';
import { getTemplateById } from '@/lib/templates';
import { TemplateType } from '@/types/invoice';

interface ColorCustomizerProps {
  primaryColor: string;
  accentColor: string;
  templateId?: TemplateType;
  onPrimaryChange: (color: string) => void;
  onAccentChange: (color: string) => void;
  disabled?: boolean;
}

const colorPresets = [
  '#059669', '#1e3a5f', '#dc2626', '#7c3aed', '#0891b2',
  '#2563eb', '#ca8a04', '#16a34a', '#db2777', '#4f46e5',
  '#0ea5e9', '#84cc16', '#f97316', '#ef4444', '#6366f1',
];

const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

interface ColorPickerProps {
  color: string;
  label: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

function ColorPicker({ color, label, onChange, disabled = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(color);
  }, [color]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handlePresetClick = (preset: string) => {
    onChange(preset);
    setInputValue(preset);
    setIsOpen(false);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only update parent if it's a valid hex color
    if (isValidHexColor(value)) {
      onChange(value);
    }
  };

  const handleTextInputBlur = () => {
    // Reset to actual color value if invalid
    if (!isValidHexColor(inputValue)) {
      setInputValue(color);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
    setInputValue(value);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
      >
        <div className="w-8 h-8 rounded border-2 border-gray-200 flex-shrink-0" style={{ backgroundColor: color || '#e5e7eb' }} />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-1 p-3 bg-white rounded-lg shadow-lg border border-gray-200"
          style={{ width: '220px' }}
        >
          {/* Preset Colors */}
          <div className="grid grid-cols-5 gap-1.5">
            {colorPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="w-8 h-8 rounded border border-gray-200 hover:border-gray-400 hover:scale-105 transition-all"
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <input
              type="color"
              value={isValidHexColor(color) ? color : '#000000'}
              onChange={handleColorInputChange}
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
            />
            <input
              type="text"
              value={inputValue}
              onChange={handleTextInputChange}
              onBlur={handleTextInputBlur}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-mono"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ColorCustomizer({
  primaryColor,
  accentColor,
  templateId,
  onPrimaryChange,
  onAccentChange,
  disabled = false,
}: ColorCustomizerProps) {
  const handleResetToDefaults = () => {
    if (templateId) {
      const template = getTemplateById(templateId);
      onPrimaryChange(template.colors.primary);
      onAccentChange(template.colors.accent);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Brand Colors</h3>
      
      <ColorPicker
        color={primaryColor}
        label="Primary"
        onChange={onPrimaryChange}
        disabled={disabled}
      />

      <ColorPicker
        color={accentColor}
        label="Accent"
        onChange={onAccentChange}
        disabled={disabled}
      />

      {templateId && (
        <button
          type="button"
          onClick={handleResetToDefaults}
          disabled={disabled}
          className="w-full py-2.5 px-4 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 mt-2"
        >
          Reset to Template Defaults
        </button>
      )}
    </div>
  );
}
