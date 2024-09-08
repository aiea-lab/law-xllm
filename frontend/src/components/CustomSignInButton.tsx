import { Button, Dialog, DialogContent } from '@mui/material';
import type React from 'react';
import { useState } from 'react';

import CustomSignInForm from './CustomSignInForm';
import CustomSignUpForm from './CustomSignUpForm';

const CustomSignInButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setShowSignUp(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const switchToSignUp = () => {
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        style={{ backgroundColor: '#007bff', color: '#fff' }}
        variant="contained"
      >
        Sign In
      </Button>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        fullScreen
        onClose={handleClose}
        open={open}
      >
        <DialogContent
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {showSignUp ? (
            <CustomSignUpForm onClose={handleClose} switchToSignIn={switchToSignIn} />
          ) : (
            <CustomSignInForm onClose={handleClose} switchToSignUp={switchToSignUp} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomSignInButton;
