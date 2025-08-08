import React from 'react';

/**
 * Props for LiveRegion component
 */
export interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all' | 'additions text' | 'additions removals' | 'removals text' | 'text additions' | 'text removals' | 'removals additions';
  children?: React.ReactNode;
}

/**
 * LiveRegion component for announcing dynamic content changes to screen readers
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  politeness = 'polite',
  atomic = false,
  relevant = 'additions text',
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={`sr-only ${className}`}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      role="status"
    >
      {children}
    </div>
  );
};