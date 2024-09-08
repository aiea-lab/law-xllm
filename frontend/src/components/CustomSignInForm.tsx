import { Button, TextField, Typography, Box, Link } from '@mui/material';
import { styled } from '@mui/system';
import type React from 'react';
import { useState, useContext } from 'react';

import { AuthContext } from '@/auth/AuthProvider';

type CustomSignInFormProps = {
  onClose: () => void;
  switchToSignUp: () => void;
};

const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '32px',
  maxWidth: '400px',
  width: '100%',
});

const SignInButton = styled(Button)({
  backgroundColor: '#007bff',
  color: '#fff',
  marginTop: '16px',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const InputField = styled(TextField)({
  margin: '8px 0',
});

const CustomSignInForm: React.FC<CustomSignInFormProps> = ({ onClose, switchToSignUp }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password }),
      });
      if (response.ok) {
        // const data = await response.json();
        if (authContext) {
          authContext.setIsAuthenticated(true);
          authContext.setUser(userId);
        }
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      setError('An error occurred while trying to sign in.');
    }
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <StyledContainer>
      <Typography variant="h4">Sign In</Typography>
      <InputField
        fullWidth
        label="User ID"
        onChange={handleUserIdChange}
        value={userId}
        variant="outlined"
      />
      <InputField
        fullWidth
        label="Password"
        onChange={handlePasswordChange}
        type="password"
        value={password}
        variant="outlined"
      />
      {error && <Typography color="error">{error}</Typography>}
      <SignInButton fullWidth onClick={handleSignIn} variant="contained">
        Sign In
      </SignInButton>
      <Button onClick={onClose} style={{ marginTop: '16px' }} variant="outlined">
        Close
      </Button>
      <Typography style={{ marginTop: '16px' }} variant="body2">
        Don&apos;t have an account?{' '}
        <Link href="#" onClick={switchToSignUp} underline="hover">
          Sign up here!
        </Link>
      </Typography>
    </StyledContainer>
  );
};

export default CustomSignInForm;
