import React from 'react';
import { CardProps } from '../../types/ui';

/**
 * Card component for grouping related content
 */
export const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'rounded-2xl border shadow-lg';
  
  const variantClasses = {
    default: 'border-neutral-800 bg-neutral-950 shadow-black/30',
    outlined: 'border-neutral-700 bg-transparent shadow-neutral-900/20',
    filled: 'border-neutral-600 bg-neutral-900 shadow-black/40',
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <section className={cardClasses} role="region" aria-labelledby={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-4 flex items-center gap-2">
        {icon && <div className="flex-shrink-0" aria-hidden="true">{icon}</div>}
        <h2 id={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="text-neutral-200">
        {children}
      </div>
    </section>
  );
};