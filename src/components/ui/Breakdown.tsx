import React from 'react';
import { BaseComponentProps } from '../../types/ui';

/**
 * Props for individual breakdown items
 */
export interface BreakdownItemProps {
  label: string;
  value: string | number;
  subItems?: BreakdownItemProps[];
  highlight?: boolean;
  format?: 'currency' | 'number' | 'percentage' | 'text';
}

/**
 * Props for the Breakdown component
 */
export interface BreakdownProps extends BaseComponentProps {
  title?: string;
  items: BreakdownItemProps[];
  showTotal?: boolean;
  totalLabel?: string;
}

/**
 * Breakdown component for displaying detailed calculation breakdowns
 */
export const Breakdown: React.FC<BreakdownProps> = ({
  title,
  items,
  showTotal = false,
  totalLabel = 'Total',
  className = '',
}) => {
  const formatValue = (val: string | number, format: BreakdownItemProps['format'] = 'text'): string => {
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

  const calculateTotal = (): number => {
    return items.reduce((sum, item) => {
      const numValue = typeof item.value === 'number' ? item.value : parseFloat(item.value.toString()) || 0;
      return sum + numValue;
    }, 0);
  };

  const renderBreakdownItem = (item: BreakdownItemProps, level: number = 0) => {
    const indentClass = level > 0 ? `ml-${level * 4}` : '';
    const textClass = item.highlight ? 'text-blue-400 font-semibold' : 'text-neutral-200';
    
    return (
      <div key={item.label} className="space-y-1">
        <div className={`flex justify-between items-center py-1 ${indentClass}`}>
          <span className={`text-sm ${textClass}`}>{item.label}</span>
          <span className={`text-sm font-mono ${textClass}`}>
            {formatValue(item.value, item.format)}
          </span>
        </div>
        
        {item.subItems && item.subItems.length > 0 && (
          <div className="space-y-1">
            {item.subItems.map((subItem) => renderBreakdownItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      )}
      
      <div className="space-y-2">
        {items.map((item) => renderBreakdownItem(item))}
      </div>

      {showTotal && (
        <>
          <div className="border-t border-neutral-700 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white">{totalLabel}</span>
              <span className="text-sm font-mono font-semibold text-white">
                {formatValue(calculateTotal(), 'currency')}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};