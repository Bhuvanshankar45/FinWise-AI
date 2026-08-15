import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

describe('App', () => {
  it('renders the landing page content', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Turn Your Financial Data Into Smarter Decisions/i)).toBeInTheDocument();
  });
});
