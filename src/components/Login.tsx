import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import SideImage from './SideImage';
import styles from './Register.module.css';
import axiosApi from '../api/axios';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { USER_EMAIL, USER_PW } from '../constants';

type FormValuesType = {
  email: string;
  password: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://kristenmazza.dev'>
        Kristen Mazza
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login() {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const errRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist));
  }, [persist]);

  const handleLoginRequest = async (
    formData: FormValuesType,
  ): Promise<void> => {
    try {
      const response = await axiosApi.post(
        '/auth',
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );
      const accessToken = response?.data?.accessToken;
      const displayName = response?.data?.displayName;
      const userId = response?.data?.id;

      localStorage.setItem('displayName', displayName);
      localStorage.setItem('email', email);
      localStorage.setItem('userId', userId);

      setAuth({ email: formData.email, accessToken, displayName, userId });

      setEmail('');
      setPassword('');
      navigate(from, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
          setErrMsg('No server response');
        } else {
          setErrMsg(
            'Login failed: ' + err.response.data.message || err.message,
          );
        }
      } else {
        setErrMsg('Login failed');
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    await handleLoginRequest({ email, password });
  };

  const handleDemoLogin = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    await handleLoginRequest({
      email: USER_EMAIL,
      password: USER_PW,
    });
  };

  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
              id='persist'
              onChange={togglePersist}
              checked={persist}
            />

            <p
              ref={errRef}
              className={errMsg ? styles.errMsg : styles.offscreen}
              aria-live='assertive'
            >
              {errMsg}
            </p>

            <Button
              disabled={!email || !password}
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant='contained'
              onClick={(e) => handleDemoLogin(e)}
              sx={{ mb: 2 }}
            >
              Demo Account Login
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link href='/register' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
      <SideImage />
    </Grid>
  );
}
