import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import UsersList from '../UsersList';
import { BrowserRouter } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';

jest.mock('../../constants', () => ({
  BASE_URL: 'demoUrl.com',
}));

const mockedUsers = [
  {
    _id: 1,
    dataId: 123,
    avatar: 'avatar.png',
    displayName: 'Demo1',
    email: 'demo1@example.com',
  },
  {
    _id: 2,
    dataId: 234,
    avatar: 'avatar.png',
    displayName: 'Demo2',
    email: 'demo2@example.com',
  },
];

jest.mock('../../api/axios', () => ({
  default: {
    get: jest.fn().mockReturnValue(
      Promise.resolve({
        data: mockedUsers,
      }),
    ),
  },
}));

describe('UsersList Component', () => {
  function renderComponent() {
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
          <UsersList />
        </AuthContext.Provider>
      </BrowserRouter>,
    );
  }

  it('displays UsersList component with loading spinner on initial render', async () => {
    // Arrange
    renderComponent();
    const loadingSpinner = screen.getByRole('progressbar');

    // Act & Assert
    expect(loadingSpinner).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    expect(loadingSpinner).not.toBeInTheDocument();
  });
});
