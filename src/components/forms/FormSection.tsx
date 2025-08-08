import React from 'react';
import { BaseComponentProps } from '../../types/ui';
import { Separator } from '../ui';

/**
 * Props for FormSection component
 */
export interface FormSectionProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * FormSection component for grouping related form fields
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  collapsible = false,
  defaultExpanded = true,
  children,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleExpanded();
    }
  };

  const headerClasses = collapsible 
    ? 'cursor-pointer hover:bg-neutral-800/50 rounded-lg p-2 -m-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950'
    : '';

  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className={headerClasses} 
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        tabIndex={collapsible ? 0 : -1}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? isExpanded : undefined}
        aria-controls={collapsible ? `${sectionId}-content` : undefined}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0 text-neutral-400">{icon}</div>}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {title}
              {collapsible && (
                <svg 
                  className={`h-4 w-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </h3>
            {description && (
              <p className="text-sm text-neutral-400 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          <Separator />
          <div id={`${sectionId}-content`} className="space-y-4">
            {children}
          </div>
        </>
      )}
    </div>
  );
};