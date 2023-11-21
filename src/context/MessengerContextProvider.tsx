import { createContext, ReactNode, useState } from 'react';
import { ContextProps } from './ContextProps';

export const MessengerContext = createContext<ContextProps>({
  isChannelOpen: false,
  setIsChannelOpen: () => false,
  currentChannelId: '',
  setCurrentChannelId: () => null,
  conversations: null,
  setConversations: () => null,
  otherName: '',
  setOtherName: () => null,
  conversation: null,
  setConversation: () => null,
});

interface MessengerContextProviderProps {
  children: ReactNode;
}

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

type MessageType = {
  _id: string;
  text: string;
  user: {
    displayName: string;
    avatar: string;
    _id: string;
  };
};

export function MessengerContextProvider({
  children,
}: MessengerContextProviderProps) {
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState('');
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null,
  );
  const [otherName, setOtherName] = useState('');
  const [conversation, setConversation] = useState<MessageType[] | null>(null);

  const value = {
    isChannelOpen,
    setIsChannelOpen,
    currentChannelId,
    setCurrentChannelId,
    conversations,
    setConversations,
    otherName,
    setOtherName,
    conversation,
    setConversation,
  };

  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
}
