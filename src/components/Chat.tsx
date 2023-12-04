import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import styles from './Chat.module.css';
import useAuth from '../hooks/useAuth';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { axiosPrivate } from '../api/axios';
import { useMessengerContext } from '../context/useMessengerContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

type MessageType = {
  _id: string;
  text: string;
  user: {
    displayName: string;
    avatar: string;
    _id: string;
  };
};

interface ServerToClientEvents {
  'receive-message': (message: MessageType) => void;
}

interface ClientToServerEvents {
  'send-message': (message: MessageType) => void;
}

export default function Chat({
  conversationLoading,
  conversation,
  setConversation,
}: {
  conversationLoading: boolean;
  conversation: MessageType[] | [];
  setConversation: Dispatch<SetStateAction<MessageType[] | []>>;
}) {
  const { auth } = useAuth();
  const { currentChannelId, otherName, setIsChannelOpen, setCurrentChannelId } =
    useMessengerContext();
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });

    setSocket(newSocket);
  }, [auth.accessToken]);

  useEffect(() => {
    const handleReceivedMessage = (message: MessageType) => {
      setConversation((prev) => [message, ...prev]);
    };

    socket?.on('receive-message', handleReceivedMessage);

    return () => {
      socket?.off('receive-message', handleReceivedMessage);
    };
  }, [socket, setConversation]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        `/channels/${currentChannelId}/messages`,
        {
          userId: auth.userId,
          text,
        },
      );

      socket?.emit('send-message', response.data);

      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackClick = () => {
    setIsChannelOpen(false);
    setConversation([]);
    setCurrentChannelId('');
    navigate(from, { replace: true });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeading}>
        <IconButton onClick={handleBackClick} aria-label='Back'>
          <ArrowBackIosNewIcon />
        </IconButton>
        <h1>Chat with {otherName}</h1>
      </div>
      {conversationLoading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.chat}>
          <div className={styles.messagesContainer}>
            {conversation && conversation.length > 0 ? (
              conversation.map((item: MessageType) => (
                <div className={styles.row} key={item._id}>
                  {auth.userId === item.user?._id ? (
                    <>
                      <div className={`${styles.msg} ${styles.sent}`}>
                        <div className={styles.sentName}>You</div>
                        {item.text}
                      </div>
                      <Avatar
                        className={styles.sentImg}
                        alt={item.user.displayName}
                        src={item.user.avatar}
                      />
                    </>
                  ) : (
                    <>
                      <Avatar
                        className={styles.rcvdImg}
                        alt={item.user.displayName}
                        src={item.user.avatar}
                      />
                      <div className={`${styles.msg} ${styles.rcvd}`}>
                        <div className={styles.rcvdName}>
                          {item.user.displayName}
                        </div>
                        {item.text}
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className={styles.messageIndicator}>No messages yet</p>
            )}
          </div>
        </div>
      )}
      <Box
        component='form'
        className={styles.formContainer}
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
      >
        <TextField
          className={styles.textField}
          hiddenLabel
          id='filled-hidden-label-normal'
          placeholder='Enter message...'
          variant='outlined'
          onChange={(e) => setText(e.target.value)}
          value={text}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton type='submit' aria-label='Send'>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </div>
  );
}
