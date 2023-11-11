import { useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

export default function Home() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await axiosPrivate.get('/channels');
        console.log(response);
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getChannels();
  });

  return (
    <>
      <p>Home</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
