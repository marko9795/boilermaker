import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByText(/boilermaker toolbox/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the setup complete message', () => {
    render(<App />);
    const message = screen.getByText(
      /modern react application setup complete/i
    );
    expect(message).toBeInTheDocument();
  });
});
