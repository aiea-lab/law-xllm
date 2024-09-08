'use client';
import { Alert, Box } from '@mui/material';
import { useState, useEffect } from 'react';

import type { NotificationProps } from './types';

const Notification = ({ msg, severity }: NotificationProps) => {
  const [visible, setVisible] = useState(true);
  const [style, setStyle] = useState({
    opacity: 0,
    top: '0%',
  });

  useEffect(() => {
    setStyle({ opacity: 1, top: '3%' });

    const timer = setTimeout(() => {
      setStyle({ opacity: 0, top: '0%' });
      setTimeout(() => setVisible(false), 1000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setStyle({ opacity: 0, top: '0%' });
    setTimeout(() => setVisible(false), 1000);
  };

  if (!visible) return null;

  return (
    <Box
      onClick={handleClose}
      sx={{
        position: 'fixed',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '100%',
        maxWidth: 600,
        opacity: style.opacity,
        top: style.top,
        transition: 'opacity 1s ease-in-out, top 1s ease-in-out',
      }}
    >
      <Alert severity={severity}>{msg}</Alert>
    </Box>
  );
};
export default Notification;
