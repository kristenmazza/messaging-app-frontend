import Avatar from '@mui/material/Avatar';

export default function AvatarDisplay({ avatar }: { avatar: string }) {
  return <Avatar alt='Avatar' src={avatar} sx={{ width: 56, height: 56 }} />;
}
