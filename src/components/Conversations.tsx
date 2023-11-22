import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useMessengerContext } from '../context/useMessengerContext';
import ConversationItem from './ConversationItem';
import { Divider, List } from '@mui/material';
import styles from './Conversations.module.css';
import Chat from './Chat';
import useAuth from '../hooks/useAuth';

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
  const {
    currentChannelId,
    isChannelOpen,
    conversations,
    setConversations,
    setConversation,
  } = useMessengerContext();
  const [conversationLoading, setConversationLoading] = useState(false);
  const { auth } = useAuth();

  const renderConversation = () => {
    return <Chat conversationLoading={conversationLoading} />;
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
          setConversationLoading(true);
          const response = await axiosPrivate.get(
            `/channels/${currentChannelId}/messages`,
          );

          const conversationData = response.data;
          setConversation(conversationData);
        } catch (err) {
          console.error(err);
        } finally {
          setConversationLoading(false);
        }
      };
      getConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannelId]);

  useEffect(() => {
    if (!currentChannelId) {
      const getConversations = async () => {
        try {
          const response = await axiosPrivate.get(
            `/channels?currentUserId=${auth.userId}`,
          );
          const conversationsData = response.data;

          const sortedConversations = conversationsData.sort(
            (a: ConversationType, b: ConversationType) => {
              const timestampA = a.latestMessage
                ? Date.parse(a.latestMessage.timestamp)
                : 0;
              const timestampB = b.latestMessage
                ? Date.parse(b.latestMessage.timestamp)
                : 0;

              return timestampB - timestampA;
            },
          );

          setConversations(sortedConversations);
        } catch (err) {
          console.error(err);
        }
      };
      getConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannelId]);

  return (
    <>
      {isChannelOpen && renderConversation()}
      {!isChannelOpen && renderConversations()}
    </>
  );
}
