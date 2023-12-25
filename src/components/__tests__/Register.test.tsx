import { render, screen } from '@testing-library/react';
import Register from '../Register';
import { BrowserRouter } from 'react-router-dom';
// import { act } from 'react-dom/test-utils';
// import { describe, expect, test } from '@jest/globals';

// import axios from 'axios';
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../SideImage', () => ({
  default: jest.fn().mockImplementation(() => null),
}));

jest.mock('../../api/axios', () => ({
  default: jest.fn().mockImplementation(() => null),
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

  // it('handles form submission failure and displays error message', async () => {
  //   const user = {
  //     displayName: 'Test6',
  //     email: 'test6@gmail.com',
  //     password: 'Aa$12345',
  //     c_password: 'Aa$12345',
  //   };

  //   mockedAxios.post.mockResolvedValue({
  //     data: { success: `New user ${user.email} created` },
  //   });

  //   // Arrange
  //   render(<Register />, { wrapper: BrowserRouter });

  //   const displayNameInput = screen.getByLabelText(/display name/i);
  //   const emailInput = screen.getByLabelText(/email address/i);
  //   const passwordInput = screen.getByLabelText(/password/i, {
  //     selector: 'input[name="password"]',
  //   });
  //   const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  //   const submitButton = screen.getByRole('button', { name: /sign up/i });

  //   // Act
  //   await act(async () => {
  //     fireEvent.change(displayNameInput, {
  //       target: { value: user.displayName },
  //     });
  //     fireEvent.change(emailInput, { target: { value: user.email } });
  //     fireEvent.change(passwordInput, { target: { value: user.password } });
  //     fireEvent.change(confirmPasswordInput, {
  //       target: { value: user.c_password },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.click(submitButton);
  //   });

  //   // Assert
  //   expect(screen.getByText(/signing up/i)).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(screen.getByText(/success/i)).toBeInTheDocument();
  //   });
  // });
});
