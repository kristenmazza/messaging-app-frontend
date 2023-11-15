import { useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useMessengerContext } from '../context/useMessengerContext';

export default function Home() {
  const axiosPrivate = useAxiosPrivate();
  const { currentChannel } = useMessengerContext();

  useEffect(() => {
    console.log(currentChannel);
    if (currentChannel) {
      const getConversation = async () => {
        try {
          const response = await axiosPrivate.get(
            `/channels/${currentChannel._id}/messages`,
          );
          console.log(response);
        } catch (err) {
          console.error(err);
        }
      };
      getConversation();
    }
  });
  return <>Home</>;
}
