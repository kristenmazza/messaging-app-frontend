import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useMessengerContext } from '../context/useMessengerContext';
import ConversationItem from './ConversationItem';
import { Divider, List } from '@mui/material';
import styles from './Conversations.module.css';
import Chat from './Chat';

type MessageType = {
  _id: string;
  text: string;
  user: {
    displayName: string;
    avatar: string;
    _id: string;
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
  const { currentChannelId, isChannelOpen, conversations, setConversations } =
    useMessengerContext();
  const [conversation, setConversation] = useState<MessageType[] | null>(null);

  const renderConversation = () => {
    return (
      <Chat conversation={conversation} setConversation={setConversation} />
    );
  };

  const renderConversations = () => {
    if (conversations) {
      return (
        <div className={styles.conversationContainer}>
          <div className={styles.list}>
            <h1>Messages</h1>
          </div>
          {conversations.map((item: ConversationType, index) => (
            <List className={styles.list} key={item._id}>
              <ConversationItem
                dataId={item._id}
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
        </div>
      );
    }
  };

  useEffect(() => {
    if (currentChannelId) {
      const getConversation = async () => {
        try {
          const response = await axiosPrivate.get(
            `/channels/${currentChannelId}/messages`,
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
  }, [currentChannelId, axiosPrivate, setConversations]);

  return (
    <>
      {isChannelOpen && renderConversation()}
      {!isChannelOpen && renderConversations()}
    </>
  );
}
