import useAuth from '../hooks/useAuth';
import { format } from 'date-fns';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './Conversations.module.css';

type LatestMessageType = {
  text: string;
  timestamp: string;
};

type ParticipantType = {
  _id: string;
  displayName: string;
  avatar: string;
};

type ConversationType = {
  _id: string;
  latestMessage: {
    text: string;
    timestamp: string;
  };
  participants: ParticipantType[];
  timestamp: string;
};

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { useMessengerContext } from '../context/useMessengerContext';

export default function ConversationItem({
  latestMessage,
  participants,
  dataId,
}: {
  dataId: string;
  latestMessage?: LatestMessageType;
  participants: ParticipantType[];
  conversation: ConversationType;
}) {
  const { auth } = useAuth();
  const { setCurrentChannelId, setIsChannelOpen, setOtherName } =
    useMessengerContext();

  const conversationPartner =
    auth.userId === participants[0]._id ? participants[1] : participants[0];

  const handleUserClick = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    const element = e.currentTarget as HTMLElement;

    if (element.dataset.id) {
      setCurrentChannelId(element.dataset.id);
      setIsChannelOpen(true);
    }

    setOtherName(conversationPartner.displayName);
  };

  return (
    <ListItem
      className={styles.listItemBackground}
      data-id={dataId}
      data-name={conversationPartner.displayName}
      onClick={(e) => handleUserClick(e)}
      sx={{
        minWidth: '250px',
        overflowWrap: 'break-word',
        marginTop: '.5rem',
      }}
      alignItems='flex-start'
    >
      <ListItemAvatar style={{ pointerEvents: 'none' }}>
        <Avatar
          alt={conversationPartner.displayName}
          src={conversationPartner.avatar}
        />
      </ListItemAvatar>
      <Box
        style={{ pointerEvents: 'none' }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box
          style={{ pointerEvents: 'none' }}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <ListItemText
            style={{ pointerEvents: 'none' }}
            sx={{ flex: 1 }}
            primary={conversationPartner.displayName}
          />
          <Typography
            style={{ pointerEvents: 'none' }}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            marginTop='6px'
            component='span'
            variant='body2'
            color='text.secondary'
          >
            {latestMessage
              ? format(new Date(latestMessage.timestamp), 'MM/dd/yy') + ' '
              : ' '}
            <ChevronRightIcon sx={{ fontSize: '1rem' }} />
          </Typography>
        </Box>
        <ListItemText
          style={{ pointerEvents: 'none' }}
          secondary={
            <>
              {latestMessage ? (
                <Typography
                  style={{ pointerEvents: 'none' }}
                  sx={{ display: 'inline' }}
                  component='span'
                  variant='body2'
                  color='text.primary'
                  noWrap={true}
                >
                  {latestMessage.text}
                </Typography>
              ) : (
                <Typography
                  style={{ pointerEvents: 'none' }}
                  sx={{
                    color: 'text.secondary',
                  }}
                  variant='body2'
                  component='span'
                >
                  No messages yet
                </Typography>
              )}
            </>
          }
        />
      </Box>
    </ListItem>
  );
}
