'use client';

interface TemplateBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function TemplateBadge({ size = 'md' }: TemplateBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`
      inline-flex items-center gap-1 
      bg-gradient-to-r from-teal-500 to-teal-600 
      text-white font-semibold rounded-full
      shadow-sm
      ${sizeClasses[size]}
    `}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      PRO
    </span>
  );
}

interface LockedTemplateProps {
  message?: string;
}

export function LockedTemplateOverlay({ message = 'Upgrade to PRO to unlock this template' }: LockedTemplateProps) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-sm text-gray-600 text-center mb-2">{message}</p>
      <TemplateBadge size="sm" />
    </div>
  );
}

interface FeatureLockedProps {
  feature: string;
}

export function FeatureLocked({ feature: _feature }: FeatureLockedProps) {
  return (
    <div className="relative group">
      <div className="opacity-50 pointer-events-none filter blur-[1px]">
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <TemplateBadge size="md" />
      </div>
    </div>
  );
}
