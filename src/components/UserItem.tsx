import styles from './UsersList.module.css';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AvatarDisplay from './AvatarDisplay';

export default function UserItem({
  avatar,
  displayName,
}: {
  avatar: string;
  displayName: string;
}) {
  return (
    <ListItem className={styles.listItemBackground}>
      <ListItemAvatar sx={{ paddingRight: '1rem' }}>
        <AvatarDisplay avatar={avatar} />
      </ListItemAvatar>
      <ListItemText primary={displayName} />
    </ListItem>
  );
}
