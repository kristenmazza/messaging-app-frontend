import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import axiosApi from '../api/axios';
import styles from './UsersList.module.css';
import List from '@mui/material/List';
import UserItem from './UserItem';
import { Box, CircularProgress } from '@mui/material';

type UserType = {
  _id: string;
  displayName: string;
  avatar: string;
  email: string;
};

export default function UsersList() {
  const { auth } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axiosApi.get('/users', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [auth.accessToken]);

  const renderedUsers = users.map((user) => (
    <UserItem
      key={user._id}
      dataId={user._id}
      avatar={user.avatar}
      displayName={user.displayName}
    />
  ));

  return (
    <>
      <div className={styles.usersList}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <List className={styles.list}>
            <h1>Users</h1>
            {renderedUsers}
          </List>
        )}
      </div>
    </>
  );
}
