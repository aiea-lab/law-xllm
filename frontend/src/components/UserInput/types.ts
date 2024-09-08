export type Result = Ok | Err;

export type Ok = {
  data: string;
  type: 'success';
};

export type Err = {
  data: string;
  type: 'err';
};

export type Message = {
  type: 'text' | 'user' | 'bot';
  text: string;
};

export type ChatMessageBoxProps = {
  messages: Message[];
};

export type ModalInput = {
  open: boolean;
  handleClose: () => void;
};
