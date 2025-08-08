import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormErrors } from '../FormErrors';

describe('FormErrors', () => {
  it('renders nothing when no errors', () => {
    const { container } = render(<FormErrors errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error list with default title', () => {
    const errors = [
      { field: 'email', message: 'Email is required' },
      { field: 'password', message: 'Password must be at least 8 characters' },
    ];

    render(<FormErrors errors={errors} />);

    expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    
    // Check that field names are present
    const emailSpan = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.includes('email');
    });
    expect(emailSpan).toBeInTheDocument();
    
    const passwordSpan = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.includes('password');
    });
    expect(passwordSpan).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const errors = [
      { field: 'name', message: 'Name is required' },
    ];

    render(<FormErrors errors={errors} title="Validation Issues:" />);

    expect(screen.getByText('Validation Issues:')).toBeInTheDocument();
  });

  it('has proper ARIA role for accessibility', () => {
    const errors = [
      { field: 'email', message: 'Email is required' },
    ];

    render(<FormErrors errors={errors} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders error icon', () => {
    const errors = [
      { field: 'email', message: 'Email is required' },
    ];

    const { container } = render(<FormErrors errors={errors} />);
    
    // Check for SVG icon
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('handles multiple errors for same field', () => {
    const errors = [
      { field: 'password', message: 'Password is required' },
      { field: 'password', message: 'Password must be at least 8 characters' },
    ];

    render(<FormErrors errors={errors} />);

    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });
});