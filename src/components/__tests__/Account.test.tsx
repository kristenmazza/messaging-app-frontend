import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Account from '../Account';
import { BrowserRouter } from 'react-router-dom';
import axiosApi from '../../api/axios';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';

jest.mock('../../api/axios', () => ({
  default: jest.fn().mockImplementation(() => null),
}));

jest.mock('../../constants', () => ({}));

describe('Account Component', () => {
  it('renders account page', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Account />
      </BrowserRouter>,
    );

    // Act & Assert
    expect(screen.getByLabelText(/change display name/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument();
  });

  it('changes display name', async () => {
    // Arrange
    const mockAuth = {
      email: 'demo@example.com',
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJlbmppQGdtYWlsLmNvbSIsImlhdCI6MTcwMDA4NzkzOSwiZXhwIjoxNzAwMDkxNTM5fQ.svBefFio88HfFowYTfbBk9ShJAAV6865r6ziry9dD3c',
      userId: '654c17240f876fef70d6a57d',
      displayName: 'demoName',
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            auth: mockAuth,
            setAuth: jest.fn(),
            persist: false,
            setPersist: jest.fn(),
          }}
        >
          <Account />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const displayNameInput = screen.getByLabelText(/change display name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    const axiosApiMock = axiosApi as jest.Mocked<typeof axios>;
    axiosApiMock.put = jest
      .fn()
      .mockResolvedValueOnce({ data: { success: true } });

    // Act
    fireEvent.change(displayNameInput, {
      target: { value: `${mockAuth.displayName}` },
    });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(axiosApi.put).toHaveBeenCalledWith(
        `/users/${mockAuth.userId}`,
        {
          displayName: `${mockAuth.displayName}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockAuth.accessToken}`,
          },
          withCredentials: true,
        },
      );
    });

    await waitFor(() => {
      expect(screen.getByText('demoName')).toBeInTheDocument();
    });
  });
});
