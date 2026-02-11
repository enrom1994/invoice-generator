import { TemplateType } from '@/types/invoice';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  isFree: boolean;
  layout: 'standard' | 'sidebar' | 'compact' | 'letterhead' | 'executive' | 'split' | 'card' | 'minimal-pro';
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
    border: string;
    headerBg: string;
    sidebarBg?: string;
    // NEW: Advanced color options for Pro templates
    zebraStripe?: string;
    leftPanelBg?: string;
    cardBg?: string;
    cardBorder?: string;
    shadowColor?: string;
  };
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean centered layout',
    isFree: true,
    layout: 'standard',
    colors: {
      primary: '#18181b',
      accent: '#18181b',
      background: '#ffffff',
      text: '#18181b',
      textMuted: '#71717a',
      border: '#e4e4e7',
      headerBg: '#ffffff',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Left-aligned with accent colors',
    isFree: true,
    layout: 'standard',
    colors: {
      primary: '#059669',
      accent: '#059669',
      background: '#ffffff',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      headerBg: '#ffffff',
    },
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Two-column layout with sidebar',
    isFree: false,
    layout: 'sidebar',
    colors: {
      primary: '#1e3a5f',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      headerBg: '#f8fafc',
      sidebarBg: '#f1f5f9',
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Condensed single-page layout',
    isFree: true,
    layout: 'compact',
    colors: {
      primary: '#0f172a',
      accent: '#0f172a',
      background: '#ffffff',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#cbd5e1',
      headerBg: '#f8fafc',
    },
  },
  // NEW: Advanced Pro Templates
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium corporate layout',
    isFree: false,
    layout: 'executive',
    colors: {
      primary: '#1e3a5f',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      headerBg: '#f8fafc',
      zebraStripe: '#f1f5f9',
      cardBg: '#ffffff',
      cardBorder: '#e2e8f0',
      shadowColor: 'rgba(0,0,0,0.1)',
    },
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Creative two-column design',
    isFree: false,
    layout: 'split',
    colors: {
      primary: '#059669',
      accent: '#10b981',
      background: '#ffffff',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      headerBg: '#ffffff',
      leftPanelBg: '#ecfdf5',
    },
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Modern card-based layout',
    isFree: false,
    layout: 'card',
    colors: {
      primary: '#4f46e5',
      accent: '#6366f1',
      background: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      headerBg: '#ffffff',
      cardBg: '#ffffff',
      cardBorder: '#cbd5e1',
      shadowColor: 'rgba(0,0,0,0.05)',
    },
  },
  {
    id: 'luxury-minimal',
    name: 'Luxury Minimal',
    description: 'Ultra-premium minimalist design',
    isFree: false,
    layout: 'minimal-pro',
    colors: {
      primary: '#18181b',
      accent: '#18181b',
      background: '#ffffff',
      text: '#27272a',
      textMuted: '#71717a',
      border: '#e4e4e7',
      headerBg: '#ffffff',
    },
  },
  {
    id: 'letterhead',
    name: 'Letterhead',
    description: 'Full-width header image support',
    isFree: false,
    layout: 'letterhead',
    colors: {
      primary: '#374151',
      accent: '#4f46e5',
      background: '#ffffff',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      headerBg: '#ffffff',
    },
  },
];

export function getTemplateById(id: TemplateType): TemplateConfig {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[1];
}

export function getFreeTemplates(): TemplateConfig[] {
  return TEMPLATES.filter(t => t.isFree);
}

export function getProTemplates(): TemplateConfig[] {
  return TEMPLATES.filter(t => !t.isFree);
}

export function isTemplateFree(id: TemplateType): boolean {
  const template = getTemplateById(id);
  return template.isFree;
}
