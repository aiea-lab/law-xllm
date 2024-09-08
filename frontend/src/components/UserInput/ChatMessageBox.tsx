import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

import { MessageView } from './MessageView';
import type { ChatMessageBoxProps } from './types';

const ChatMessageBox = ({ messages }: ChatMessageBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box className="flex flex-col space-y-4 p-4 overflow-auto h-full">
      {messages.map((message, index) => (
        <Box
          className={`p-2 rounded-md ${
            message.type === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-300 self-start'
          }`}
          key={index}
        >
          <MessageView text={message.text} type={message.type} />
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatMessageBox;
