import { useContext } from 'react';
import { MessengerContext } from './MessengerContextProvider';
import { ContextProps } from './ContextProps';

export const useMessengerContext = (): ContextProps => {
  const context = useContext(MessengerContext);
  return context;
};
