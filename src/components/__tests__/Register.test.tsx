import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Register from '../Register';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import axiosApi from '../../api/axios';

jest.mock('../SideImage', () => ({
  default: jest.fn().mockImplementation(() => null),
}));

jest.mock('../../constants', () => ({
  BASE_URL: 'demoUrl.com',
}));

describe('Register Component', () => {
  it('renders register form', async () => {
    // Arrange
    render(<Register />, { wrapper: BrowserRouter });

    // Act & Assert
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/password/i, {
        selector: 'input[name="password"]',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('handles successful form submission', async () => {
    // Arrange
    const user = {
      displayName: 'Test101',
      email: 'test101@example.com',
      password: 'Aa$12345',
      c_password: 'Aa$12345',
    };

    const axiosApiMock = axiosApi as jest.Mocked<typeof axios>;
    const spyOnAxiosPost = jest.spyOn(axiosApiMock, 'post');
    spyOnAxiosPost.mockResolvedValueOnce({ success: true });

    render(<Register />, { wrapper: BrowserRouter });

    const displayNameInput = screen.getByLabelText(/display name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Act
    fireEvent.change(displayNameInput, {
      target: { value: user.displayName },
    });
    fireEvent.change(emailInput, { target: { value: user.email } });
    fireEvent.change(passwordInput, { target: { value: user.password } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: user.c_password },
    });
    fireEvent.click(submitButton);

    // Assert
    expect(spyOnAxiosPost).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });

  it('handles form submission failure', async () => {
    // Arrange
    const user = {
      displayName: 'Test101',
      email: 'test101@example.com',
      password: 'Aa$12345',
      c_password: 'Aa$12345',
    };

    const axiosApiMock = axiosApi as jest.Mocked<typeof axios>;
    axiosApiMock.post.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { errors: [{ msg: 'A user already exists with this email' }] },
      },
    });

    render(<Register />, { wrapper: BrowserRouter });

    const displayNameInput = screen.getByLabelText(/display name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Act
    fireEvent.change(displayNameInput, {
      target: { value: user.displayName },
    });
    fireEvent.change(emailInput, { target: { value: user.email } });
    fireEvent.change(passwordInput, { target: { value: user.password } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: user.c_password },
    });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      screen.getByText(/user already exists with this email/i);
    });
  });

  it('disables register button when fields are empty', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

    const displayNameInput = screen.getByLabelText(/display name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Act & Assert
    expect(submitButton).toBeDisabled();

    fireEvent.change(displayNameInput, { target: { value: 'DemoName' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('displays error when display name is invalid', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

    const displayNameInput = screen.getByLabelText(/display name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Act & Assert
    expect(submitButton).toBeDisabled();

    fireEvent.change(displayNameInput, { target: { value: 'De' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });

    expect(screen.getByText(/3 to 23 characters/i)).toBeInTheDocument();
  });

  it('displays error when email is invalid', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

    const displayNameInput = screen.getByLabelText(/display name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Act & Assert
    expect(submitButton).toBeDisabled();

    fireEvent.change(displayNameInput, { target: { value: 'DemoName' } });
    fireEvent.change(emailInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });

    expect(screen.getByText(/email must be entered/i)).toBeInTheDocument();
  });

  it('displays error when passwords do not match', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

    const displayNameInput = screen.getByLabelText(/display name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input[name="password"]',
    });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Act & Assert
    expect(submitButton).toBeDisabled();

    fireEvent.change(displayNameInput, { target: { value: 'DemoName' } });
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });

    expect(
      screen.getByText(/must match the first password input field/i),
    ).toBeInTheDocument();
  });
});
