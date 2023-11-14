import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import { Box, Button } from '@mui/material';
import { useState, FormEvent, useRef } from 'react';
import styles from './Account.module.css';
import axiosApi from '../api/axios';
import axios from 'axios';
import SuccessSnackbar from './SuccessSnackbar';

export default function Account() {
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  const [displayName, setDisplayName] = useState(auth.displayName);
  const signOut = async () => {
    await logout();
    navigate('/login');
  };
  const [errMsg, setErrMsg] = useState('');
  const errRef = useRef<HTMLInputElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loadingNameChange, setLoadingNameChange] = useState(false);

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingNameChange(true);

    if (!displayName || displayName?.trim() === '') {
      setErrMsg('Enter a display name');
    } else {
      try {
        await axiosApi.put(
          '/users',
          {
            email: auth.email,
            displayName: displayName,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.accessToken}`,
            },
            withCredentials: true,
          },
        );
        localStorage.setItem('displayName', displayName);
        setErrMsg('');
        handleOpenSnackbar();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (!err?.response) {
            setErrMsg('No server response');
          } else {
            setErrMsg(
              'Update failed: ' + err.response.data.message || err.message,
            );
          }
        } else {
          setErrMsg('Update failed');
        }
        if (errRef.current) {
          errRef.current.focus();
        }
      } finally {
        setLoadingNameChange(false);
      }
    }
  };

  return (
    <>
      <div className={styles.accountSection}>
        <h1>Account</h1>
        <Box className={styles.form}>
          <form
            method='post'
            encType='multipart/form-data'
            className={styles.uploadForm}
            onSubmit={() => {}}
          >
            <div className={styles.formGroup}>
              <label htmlFor='file'>Choose Avatar</label>
              <input type='file' id='file' name='file' onChange={() => {}} />
            </div>
            <Button className={styles.button} type='submit' variant='contained'>
              Upload
            </Button>
          </form>

          <form
            className={styles.formWrapper}
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className={styles.displayNameForm}>
              <div className={styles.formGroup}>
                <label htmlFor='displayName'>Change Display Name</label>
                <input
                  id='displayName'
                  onChange={(e) => setDisplayName(e.target.value)}
                  value={displayName ? displayName : ''}
                />
              </div>

              <Button
                disabled={loadingNameChange}
                className={styles.button}
                type='submit'
                variant='contained'
              >
                {loadingNameChange ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
            <p
              ref={errRef}
              className={errMsg ? styles.errMsg : styles.offscreen}
              aria-live='assertive'
            >
              {errMsg}
            </p>
          </form>
        </Box>

        <Button
          sx={{ margin: '2rem 0' }}
          onClick={() => signOut()}
          variant='text'
        >
          Sign Out
        </Button>
      </div>
      <SuccessSnackbar
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
        message='Display named successfully updated'
      />
    </>
  );
}
