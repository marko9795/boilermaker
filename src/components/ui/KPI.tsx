import React from 'react';
import { KPIProps } from '../../types/ui';

/**
 * KPI (Key Performance Indicator) component for displaying metrics
 */
export const KPI: React.FC<KPIProps> = ({
  label,
  value,
  subValue,
  trend,
  highlight = false,
  format = 'text',
  className = '',
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-CA', {
          style: 'currency',
          currency: 'CAD',
        }).format(val);
      case 'number':
        return new Intl.NumberFormat('en-CA').format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toString();
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      case 'neutral':
        return (
          <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const baseClasses = 'rounded-lg p-4 transition-colors';
  const highlightClasses = highlight 
    ? 'bg-blue-900/20 border border-blue-700/30' 
    : 'bg-neutral-800/50';
  
  const kpiClasses = `${baseClasses} ${highlightClasses} ${className}`;

  const kpiId = `kpi-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const trendDescription = trend ? `Trend: ${trend}` : undefined;

  return (
    <div className={kpiClasses} role="region" aria-labelledby={`${kpiId}-label`}>
      <div className="flex items-center justify-between">
        <p id={`${kpiId}-label`} className="text-sm font-medium text-neutral-400">{label}</p>
        {trend && (
          <div aria-label={trendDescription} role="img">
            {getTrendIcon()}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <p 
          className={`text-2xl font-bold ${highlight ? 'text-blue-400' : 'text-white'}`}
          aria-describedby={subValue ? `${kpiId}-sub` : undefined}
        >
          {formatValue(value)}
        </p>
        {subValue && (
          <p id={`${kpiId}-sub`} className="text-sm text-neutral-500 mt-1">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};