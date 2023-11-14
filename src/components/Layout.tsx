import { useRef } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import styles from './Layout.module.css';

export default function Layout() {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <main className='App'>
      {pathname === '/login' || pathname === '/register' ? (
        <Outlet />
      ) : (
        <Box sx={{ pb: 7 }} ref={ref} className={styles.background}>
          <Container maxWidth='md' className={styles.layoutWrapper}>
            <CssBaseline />
            <Outlet />
            <BottomNav />
          </Container>
        </Box>
      )}
    </main>
  );
}
