import { useEffect, useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessengerContext } from '../context/useMessengerContext';

export default function FixedBottomNavigation() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsChannelOpen, setConversation, setCurrentChannelId } =
    useMessengerContext();
  useEffect(() => {
    const tabRoute = {
      '/': 0,
      '/users': 1,
      '/account': 2,
    };

    const currentLocationTab =
      tabRoute[location.pathname as keyof typeof tabRoute];
    setValue(currentLocationTab);
  }, [location.pathname]);

  const handleMessagesClick = () => {
    setIsChannelOpen(false);
    setConversation(null);
    setCurrentChannelId('');
    navigate('/');
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label='Messages'
          onClick={handleMessagesClick}
          icon={<ForumIcon />}
        />
        <BottomNavigationAction
          label='Users'
          onClick={() => navigate('/users')}
          icon={<PeopleIcon />}
        />
        <BottomNavigationAction
          label='Account'
          onClick={() => navigate('/account')}
          icon={<AccountCircleIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
