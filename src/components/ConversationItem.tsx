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

export default function ConversationItem({
  latestMessage,
  participants,
  conversation,
}: {
  key: string;
  latestMessage?: LatestMessageType;
  participants: ParticipantType[];
  conversation: ConversationType;
}) {
  const { auth } = useAuth();
  const conversationPartner =
    auth.displayName === participants[0].displayName
      ? participants[1]
      : participants[0];
  return (
    <ListItem
      className={styles.listItemBackground}
      sx={{
        minWidth: '250px',
        overflowWrap: 'break-word',
        marginTop: '.5rem',
      }}
      alignItems='flex-start'
    >
      <ListItemAvatar>
        <Avatar
          alt={conversationPartner.displayName}
          src={conversationPartner.avatar}
        />
      </ListItemAvatar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <ListItemText
            sx={{ flex: 1 }}
            primary={conversationPartner.displayName}
          />
          <Typography
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
              : format(new Date(conversation.timestamp), 'MM/dd/yy') + ' '}
            <ChevronRightIcon sx={{ fontSize: '1rem' }} />
          </Typography>
        </Box>
        <ListItemText
          secondary={
            <>
              {latestMessage ? (
                <Typography
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
                  sx={{
                    color: 'text.secondary',
                  }}
                  variant='body2'
                  component='div'
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
