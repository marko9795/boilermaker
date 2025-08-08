import React from 'react';

/**
 * Props for ScreenReaderOnly component
 */
export interface ScreenReaderOnlyProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/**
 * ScreenReaderOnly component for content that should only be visible to screen readers
 */
export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  as: Component = 'span',
  children,
  className = '',
  ...props
}) => {
  const srOnlyClasses = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';
  
  return React.createElement(
    Component,
    {
      ...props,
      className: `${srOnlyClasses} ${className}`,
    },
    children
  );
};