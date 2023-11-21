import { Dispatch, SetStateAction } from 'react';

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

export interface ContextProps {
  isChannelOpen: boolean;
  setIsChannelOpen: Dispatch<SetStateAction<boolean>>;
  currentChannelId: string;
  setCurrentChannelId: Dispatch<SetStateAction<string>>;
  conversations: ConversationType[] | null;
  setConversations: Dispatch<SetStateAction<ConversationType[] | null>>;
  otherName: string;
  setOtherName: Dispatch<SetStateAction<string>>;
}
