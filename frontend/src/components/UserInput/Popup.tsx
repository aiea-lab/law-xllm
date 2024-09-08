import { Box, Typography, Modal } from '@mui/material';
import { X } from 'lucide-react';

import type { ModalInput } from './types';

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

export function Popup(props: ModalInput) {
  return (
    <Modal
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      onClose={props.handleClose}
      open={props.open}
    >
      <Box className="flex flex-row" sx={modal_style}>
        <Box>
          <Typography component="h2" id="modal-modal-title" variant="h6">
            Explanation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            I have cooked. This is where the goal tree would go.
          </Typography>
        </Box>
        <Box className="grow"></Box>
        <Box>
          <button onClick={props.handleClose}>
            <X />
          </button>
        </Box>
      </Box>
    </Modal>
  );
}
