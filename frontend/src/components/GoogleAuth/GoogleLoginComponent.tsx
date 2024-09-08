import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import dotenv from 'dotenv';
import { setCookie } from 'nookies';
import { useContext } from 'react';
dotenv.config();

import { AuthContext } from '@/auth/AuthProvider';
import type { AuthContextProps } from '@/auth/types';

import type { AuthResponse } from './type';

const GoogleLoginComponent: React.FC = () => {
  const clientId = process.env.NEXT_PUBLIC_Google_Client_ID || '';
  const { setIsAuthenticated, setUser, setUserId } = useContext(AuthContext) as AuthContextProps;

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Login Success:', credentialResponse);
    if (credentialResponse.credential) {
      const response = await fetch('http://127.0.0.1:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      if (response.ok) {
        const data = (await response.json()) as AuthResponse;
        console.log('Server response:', data);
        setIsAuthenticated(true);
        setUser(data.user.name);
        setUserId(data.user.id);
        setCookie(null, 'isAuthenticated', 'true', { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setCookie(null, 'user', data.user.name, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setCookie(null, 'userId', data.user.id, { maxAge: 30 * 24 * 60 * 60, path: '/' });
      } else {
        console.error('Failed to authenticate with server');
      }
    }
  };

  const onError = () => {
    console.log('Login Failed');
  };

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    onSuccess(credentialResponse).catch((error) => {
      console.error('Error during login:', error);
    });
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onError={onError} onSuccess={handleSuccess} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
