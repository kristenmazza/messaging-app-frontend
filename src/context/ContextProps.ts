import { Dispatch, SetStateAction } from 'react';

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

export interface ContextProps {
  currentChannel: ChannelType | null;
  setCurrentChannel: Dispatch<SetStateAction<ChannelType | null>>;
  isChannelOpen: boolean;
  setIsChannelOpen: Dispatch<SetStateAction<boolean>>;
}
