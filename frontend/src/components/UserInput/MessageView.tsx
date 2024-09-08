import { Box, Typography, Modal } from '@mui/material';
import { CirclePlus, X } from 'lucide-react';
import * as React from 'react';

import type { Message } from './types';

const modal_style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
        <Modal
          aria-describedby="modal-modal-description"
          aria-labelledby="modal-modal-title"
          onClose={handleClose}
          open={open}
        >
          <Box className="flex flex-row" sx={modal_style}>
            <Box>
              <Typography component="h2" id="modal-modal-title" variant="h6">
                Explanation
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                I have cooked.
              </Typography>
            </Box>
            <Box className="grow"></Box>
            <Box>
              <button onClick={handleClose}>
                <X />
              </button>
            </Box>
          </Box>
        </Modal>
      </Box>
    );
  }
}
