import React from 'react';
import { SeparatorProps } from '../../types/ui';

/**
 * Separator component for visual content separation
 */
export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  className = '',
}) => {
  const baseClasses = 'border-neutral-700';
  
  const orientationClasses = {
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l',
  };

  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const separatorClasses = `${baseClasses} ${orientationClasses[orientation]} ${variantClasses[variant]} ${className}`;

  return <div className={separatorClasses} role="separator" />;
};