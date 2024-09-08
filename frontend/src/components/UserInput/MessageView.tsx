import { Box, Typography } from '@mui/material';
import { CirclePlus } from 'lucide-react';
import * as React from 'react';

import { Popup } from './Popup';
import type { Message } from './types';

export function MessageView(props: Message) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (props.type === 'user') {
    // If Message is from User
    return <Typography>{props.text}</Typography>;
  } else {
    // If message is from LLM
    return (
      <Box className="flex flex-row top">
        <Box>
          <Typography>{props.text}</Typography>
        </Box>
        <Box
          sx={{
            paddingLeft: 1,
          }}
        >
          <button onClick={handleOpen}>
            <CirclePlus />
          </button>
        </Box>
        <Popup handleClose={handleClose} open={open} />
      </Box>
    );
  }
}
