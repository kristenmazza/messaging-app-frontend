import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useMessengerContext } from '../context/useMessengerContext';
import ConversationItem from './ConversationItem';
import { Divider, List } from '@mui/material';
import styles from './Conversations.module.css';

type MessageType = {
  _id: string;
  text: string;
  user: {
    displayName: string;
    avatar: string;
  };
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

export default function Conversations() {
  const axiosPrivate = useAxiosPrivate();
  const { currentChannel, isChannelOpen } = useMessengerContext();
  const [conversation, setConversation] = useState<MessageType[] | null>(null);
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null,
  );

  const renderConversation = () => {
    if (conversation && conversation.length > 0) {
      return conversation.map((item: MessageType) => (
        <div key={item._id}>
          <div>{item.user.displayName}</div>
          <div>{item.text}</div>
        </div>
      ));
    } else {
      return 'Send a message...';
    }
  };

  const renderConversations = () => {
    console.log(conversations);
    if (conversations) {
      return (
        <div className={styles.conversationContainer}>
          {conversations.map((item: ConversationType, index) => (
            <List className={styles.list}>
              <ConversationItem
                key={item._id}
                latestMessage={item.latestMessage}
                participants={item.participants}
                conversation={item}
              />
              {index === conversations.length - 1 ? '' : <Divider />}
            </List>
          ))}
        </div>
      );
    } else {
      return (
        <div className={styles.conversationContainer}>
          <List className={styles.list}>
            Select a user to start a conversation...
          </List>
          =
        </div>
      );
    }
  };

  useEffect(() => {
    if (currentChannel) {
      const getConversation = async () => {
        try {
          const response = await axiosPrivate.get(
            `/channels/${currentChannel._id}/messages`,
          );
          setConversation(response.data);
        } catch (err) {
          console.error(err);
        }
      };
      getConversation();
    } else {
      const getConversations = async () => {
        try {
          const response = await axiosPrivate.get('/channels');
          setConversations(response.data);
        } catch (err) {
          console.error(err);
        }
      };
      getConversations();
    }
  }, [currentChannel, axiosPrivate]);
  return (
    <>
      {isChannelOpen && renderConversation()}
      {!isChannelOpen && renderConversations()}
    </>
  );
}
