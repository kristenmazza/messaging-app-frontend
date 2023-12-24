import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from '@testing-library/react';
import Login from '../Login';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

describe('Login Component', () => {
  it('renders login form', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    // Act & Assert
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('handles form submission failure and displays error message', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Act
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Assert
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });

  it('handles successful form submission and navigates to another page', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Act
    await act(async () => {
      fireEvent.change(emailInput, {
        target: { value: import.meta.env.VITE_DEMO_USER },
      });
      fireEvent.change(passwordInput, {
        target: { value: import.meta.env.VITE_DEMO_PW },
      });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  it('disables login button when fields are empty', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Act & Assert
    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton).not.toBeDisabled();
  });
});
