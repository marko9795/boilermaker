import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPI } from '../KPI';

describe('KPI', () => {
  it('renders label and value', () => {
    render(
      <KPI
        label="Total Revenue"
        value={1000}
        format="currency"
      />
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('renders with subValue', () => {
    render(
      <KPI
        label="Growth Rate"
        value={15}
        format="percentage"
        subValue="vs last month"
      />
    );

    expect(screen.getByText('Growth Rate')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(
      <KPI
        label="Net Pay"
        value={2500.75}
        format="currency"
      />
    );

    expect(screen.getByText('$2,500.75')).toBeInTheDocument();
  });

  it('formats numbers correctly', () => {
    render(
      <KPI
        label="Hours Worked"
        value={1234.5}
        format="number"
      />
    );

    expect(screen.getByText('1,234.5')).toBeInTheDocument();
  });

  it('formats percentages correctly', () => {
    render(
      <KPI
        label="Tax Rate"
        value={25.5}
        format="percentage"
      />
    );

    expect(screen.getByText('25.5%')).toBeInTheDocument();
  });

  it('handles string values', () => {
    render(
      <KPI
        label="Status"
        value="Active"
        format="text"
      />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies highlight styling', () => {
    const { container } = render(
      <KPI
        label="Important Metric"
        value={100}
        highlight
      />
    );

    const kpiElement = container.firstChild as HTMLElement;
    expect(kpiElement).toHaveClass('bg-blue-900/20', 'border-blue-700/30');
  });

  it('shows trend indicators', () => {
    const { rerender } = render(
      <KPI
        label="Revenue"
        value={1000}
        trend="up"
      />
    );

    // Check for up trend (should have green color class in SVG)
    expect(document.querySelector('.text-green-400')).toBeInTheDocument();

    rerender(
      <KPI
        label="Revenue"
        value={1000}
        trend="down"
      />
    );

    // Check for down trend (should have red color class in SVG)
    expect(document.querySelector('.text-red-400')).toBeInTheDocument();

    rerender(
      <KPI
        label="Revenue"
        value={1000}
        trend="neutral"
      />
    );

    // Check for neutral trend (should have neutral color class in SVG)
    expect(document.querySelector('.text-neutral-400')).toBeInTheDocument();
  });
});