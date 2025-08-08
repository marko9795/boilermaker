import React from 'react';
import { Button } from '../ui';
import { BaseComponentProps } from '../../types/ui';

/**
 * Props for individual quick actions
 */
export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
}

/**
 * Props for QuickActions component
 */
export interface QuickActionsProps extends BaseComponentProps {
  actions: QuickAction[];
  title?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

/**
 * QuickActions component for common form operations
 */
export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title,
  layout = 'horizontal',
  className = '',
}) => {
  if (actions.length === 0) {
    return null;
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-2';
      case 'grid':
        return 'grid grid-cols-2 gap-2';
      default:
        return 'flex flex-wrap gap-2';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <h4 className="text-sm font-medium text-neutral-300">{title}</h4>
      )}
      
      <div className={getLayoutClasses()}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            icon={action.icon}
            className={layout === 'grid' ? 'justify-start' : ''}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};