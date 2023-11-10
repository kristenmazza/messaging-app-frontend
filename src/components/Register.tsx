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
import { InfoRounded } from '@mui/icons-material';
import axios from 'axios';

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
const DISPLAY_NAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{6,30}$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignUp() {
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [validDisplayName, setValidDisplayName] = useState(false);
  const [displayNameFocus, setDisplayNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const result = DISPLAY_NAME_REGEX.test(displayName);
    setValidDisplayName(result);
  }, [displayName]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);

    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    setErrMsg('');
  }, [displayName, password, matchPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const v1 = DISPLAY_NAME_REGEX.test(displayName);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(password);

    if (!v1 || !v2 || !v3) {
      setErrMsg('Invalid entry');
      return;
    }

    console.log({
      displayName: displayName,
      password: password,
      email: email,
      c_password: matchPassword,
    });

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/register',
        {
          displayName: displayName,
          password: encodeURIComponent(password),
          email: email,
          c_password: encodeURIComponent(matchPassword),
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      console.log(response);
      setSuccess(true);
      setDisplayName('');
      setPassword('');
      setMatchPassword('');
      setEmail('');
    } catch (err) {
      console.error('Error:', err);

      const message = err instanceof Error ? err.message : String(err);
      setErrMsg(message);
    }
  };

  return (
    <>
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
            {success ? (
              <section className={styles.successRegister}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                  Success!
                </Typography>
                <p>Please sign in to continue.</p>
                <p>
                  <a href='/login'>Sign In</a>
                </p>
              </section>
            ) : (
              <>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                  Sign up
                </Typography>
                <Box
                  component='form'
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete='nickname'
                        name='displayName'
                        required
                        fullWidth
                        id='displayName'
                        label='Display Name'
                        ref={userRef}
                        onChange={(e) => setDisplayName(e.target.value)}
                        aria-invalid={validDisplayName ? 'false' : 'true'}
                        aria-labelledby='displaynamenote'
                        onFocus={() => setDisplayNameFocus(true)}
                        onBlur={() => setDisplayNameFocus(false)}
                      />
                      <p
                        id='displaynamenote'
                        className={
                          displayNameFocus && displayName && !validDisplayName
                            ? styles.instructions
                            : styles.offscreen
                        }
                      >
                        <InfoRounded />
                        3 to 23 characters.
                        <br />
                        Must begin with a letter.
                        <br />
                        Letters, numbers, underscores, and hyphens allowed.
                      </p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={validEmail ? 'false' : 'true'}
                        aria-labelledby='emailnote'
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      />
                      <p
                        id='emailnote'
                        className={
                          emailFocus && email && !validEmail
                            ? styles.instructions
                            : styles.offscreen
                        }
                      >
                        <InfoRounded />
                        Email must be entered
                      </p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='new-password'
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={validPassword ? 'false' : 'true'}
                        aria-labelledby='pwdnote'
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                      />
                      <p
                        id='pwdnote'
                        className={
                          passwordFocus && password && !validPassword
                            ? styles.instructions
                            : styles.offscreen
                        }
                      >
                        <InfoRounded />
                        6 to 30 characters. <br />
                        Must include an uppercase letter, lowercase letter, and
                        symbol. <br />
                        Allowed special characters: ! @ # $
                        <br />
                      </p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name='c_password'
                        label='Confirm Password'
                        type='password'
                        id='c_password'
                        autoComplete='new-password'
                        onChange={(e) => setMatchPassword(e.target.value)}
                        aria-invalid={validMatch ? 'false' : 'true'}
                        aria-describedby='confirmnote'
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                      />
                      <p
                        id='matchnote'
                        className={
                          matchFocus && matchPassword && !validMatch
                            ? styles.instructions
                            : styles.offscreen
                        }
                      >
                        <InfoRounded />
                        Must match the first password input field.
                      </p>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox value='allowExtraEmails' color='primary' />
                        }
                        label='I want to receive inspiration, marketing promotions and updates via email.'
                      />
                    </Grid>
                  </Grid>
                  <Button
                    disabled={
                      !validDisplayName ||
                      !validPassword ||
                      !validEmail ||
                      !validMatch
                        ? true
                        : false
                    }
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>

                  <p
                    ref={errRef}
                    className={errMsg ? styles.errMsg : styles.offscreen}
                    aria-live='assertive'
                  >
                    {errMsg}
                  </p>

                  <Grid container justifyContent='flex-end'>
                    <Grid item>
                      <Link href='/login' variant='body2'>
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </>
            )}
          </Box>
        </Grid>

        <SideImage />
      </Grid>
    </>
  );
}
