import { createContext, ReactNode, useState } from 'react';
import { ContextProps } from './ContextProps';

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

export const MessengerContext = createContext<ContextProps>({
  currentChannel: null,
  setCurrentChannel: () => null,
  isChannelOpen: false,
  setIsChannelOpen: () => false,
});

interface MessengerContextProviderProps {
  children: ReactNode;
}

export function MessengerContextProvider({
  children,
}: MessengerContextProviderProps) {
  const [currentChannel, setCurrentChannel] = useState<ChannelType | null>(
    null,
  );
  const [isChannelOpen, setIsChannelOpen] = useState(false);

  const value = {
    currentChannel,
    setCurrentChannel,
    isChannelOpen,
    setIsChannelOpen,
  };

  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
}
