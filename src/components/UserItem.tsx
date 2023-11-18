import styles from './UsersList.module.css';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AvatarDisplay from './AvatarDisplay';
import useAuth from '../hooks/useAuth';
import axiosApi from '../api/axios';
import axios from 'axios';
import { useMessengerContext } from '../context/useMessengerContext';
import { useLocation, useNavigate } from 'react-router-dom';

type ChannelType = {
  _id?: string;
  participants?: string[];
  __v?: number;
  timestamp?: string;
  latestMessage?: {
    _id?: string;
    user?: string;
    channel?: string;
    text?: string;
    timestamp?: string;
    __v?: number;
  };
};

export default function UserItem({
  avatar,
  displayName,
  dataId,
}: {
  avatar: string;
  displayName: string;
  dataId: string;
}) {
  const { auth } = useAuth();
  const { setCurrentChannel, setIsChannelOpen } = useMessengerContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isExistingChannel = async (element: HTMLElement) => {
    let existingChannel;
    try {
      const response = await axiosApi.get('/channels/channel', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
        params: {
          user1: auth.userId,
          user2: element.dataset.id,
        },
      });
      const transfomedResponse: ChannelType = response.data;
      setCurrentChannel(transfomedResponse);
      existingChannel = true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          existingChannel = err.response.data.channelExists;
        } else if (err.request) {
          console.error('No response received: ' + err.request);
        } else {
          console.error('Error: ' + err.message);
        }
      }
    }
    return existingChannel;
  };

  const createChannel = async (element: HTMLElement) => {
    try {
      const response = await axiosApi.post(
        '/channels',
        {
          user1: auth.userId,
          user2: element.dataset.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        },
      );

      const transfomedResponse: ChannelType = response.data;
      setCurrentChannel(transfomedResponse);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Error: ' + err.response.data);
        } else if (err.request) {
          console.error('No response received: ' + err.request);
        } else {
          console.error('Error: ' + err.message);
        }
      }
    }
  };

  const handleUserClick = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    const element = e.currentTarget as HTMLElement;
    const existingChannel = await isExistingChannel(element);

    if (!existingChannel) {
      await createChannel(element);
    }

    setIsChannelOpen(true);
    navigate('/', { state: { from: location }, replace: true });
  };

  return (
    <ListItem
      className={styles.listItemBackground}
      data-id={dataId}
      onClick={(e) => handleUserClick(e)}
    >
      <ListItemAvatar
        sx={{ paddingRight: '1rem' }}
        style={{ pointerEvents: 'none' }}
      >
        <AvatarDisplay avatar={avatar} />
      </ListItemAvatar>
      <ListItemText primary={displayName} style={{ pointerEvents: 'none' }} />
    </ListItem>
  );
}
