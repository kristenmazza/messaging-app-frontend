import axiosApi from '../api/axios';
import useAuth from './useAuth';

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axiosApi.get('/refresh', {
        withCredentials: true,
      });

      setAuth((prev) => {
        return { ...prev, accessToken: response.data.accessToken };
      });

      return response.data.accessToken;
    } catch (err) {
      console.error('Refresh token error:', err);
    }
  };

  return refresh;
}
