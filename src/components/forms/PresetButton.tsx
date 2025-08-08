import React from 'react';
import { Button } from '../ui';
import { ButtonProps } from '../../types/ui';

/**
 * Props for PresetButton component
 */
export interface PresetButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  label: string;
  description?: string;
  onApply: () => void;
  icon?: React.ReactNode;
}

/**
 * PresetButton component for applying predefined values
 */
export const PresetButton: React.FC<PresetButtonProps> = ({
  label,
  description,
  onApply,
  icon,
  variant = 'outline',
  size = 'sm',
  className = '',
  ...buttonProps
}) => {
  const handleClick = () => {
    onApply();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <Button
        {...buttonProps}
        variant={variant}
        size={size}
        onClick={handleClick}
        icon={icon}
        className="w-full justify-start"
      >
        {label}
      </Button>
      {description && (
        <p className="text-xs text-neutral-400 px-2">
          {description}
        </p>
      )}
    </div>
  );
};