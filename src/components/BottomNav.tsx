import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import { useNavigate } from 'react-router-dom';

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

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
        <BottomNavigationAction label='Messages' icon={<ForumIcon />} />
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
