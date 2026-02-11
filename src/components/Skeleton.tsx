import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  variant = 'text',
  width = '100%',
  height = '16px',
  style,
  className = '',
  animation = 'pulse',
}: SkeletonProps): React.ReactElement {
  const baseStyles: React.CSSProperties = {
    backgroundColor: '#e5e7eb',
    borderRadius: variant === 'circular' ? '50%' : variant === 'rectangular' ? '8px' : '4px',
    display: 'inline-block',
    width,
    height,
    ...style,
  };

  const animationStyles: Record<string, React.CSSProperties> = {
    pulse: {
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    },
    wave: {
      backgroundImage: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-wave 1.5s ease-in-out infinite',
    },
    none: {},
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      style={{ ...baseStyles, ...animationStyles[animation] }}
      className={className}
    >
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes skeleton-wave {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function FormFieldSkeleton(): React.ReactElement {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Skeleton width="120px" height="14px" />
      <Skeleton width="100%" height="42px" style={{ marginTop: '8px' }} />
    </div>
  );
}

export function CardSkeleton(): React.ReactElement {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Skeleton width="200px" height="24px" />
      <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
    </div>
  );
}

export function InvoicePreviewSkeleton(): React.ReactElement {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <Skeleton width="120px" height="32px" />
          <Skeleton width="80px" height="16px" style={{ marginTop: '8px' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Skeleton width="150px" height="24px" />
          <Skeleton width="100px" height="14px" style={{ marginTop: '8px' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div>
          <Skeleton width="60px" height="12px" />
          <Skeleton width="100%" height="60px" style={{ marginTop: '8px' }} />
        </div>
        <div>
          <Skeleton width="60px" height="12px" />
          <Skeleton width="100%" height="60px" style={{ marginTop: '8px' }} />
        </div>
      </div>

      <Skeleton width="100%" height="200px" variant="rectangular" style={{ marginBottom: '24px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton width="200px" height="80px" variant="rectangular" />
      </div>
    </div>
  );
}

export function PageLoader({ message = 'Loading...' }: { message?: string }): React.ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        width: '100%',
      }}
    >
      <LoadingSpinner size="lg" label={message} />
    </div>
  );
}

export default Skeleton;
