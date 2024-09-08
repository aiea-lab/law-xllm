import { Box, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { Send } from 'lucide-react';
import { useCallback, useState, useContext } from 'react';

import { Button } from '@/components/SidebarNav/button';
import { Input } from '@/components/SidebarNav/input';
import { AppContext } from '@/pages/AppContext';

import ChatMessageBox from './ChatMessageBox';
import { useChatHandler } from './useChatHandler';

function UserInput() {
  const { textInput, setTextInput, messages, handleClick, messagesEndRef } = useChatHandler();
  const [selectedOption, setSelectedOption] = useState('openai');
  const { isDark } = useContext(AppContext);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        void handleClick();
      }
    },
    [handleClick],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTextInput(e.target.value);
    },
    [setTextInput],
  );

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box
      className={
        isDark
          ? 'flex-grow p-4 bg-[#585C72] flex flex-col'
          : 'flex-grow p-4 bg-[#F0EBE3] flex flex-col'
      }
    >
      <Box className="flex-grow overflow-auto">
        <Box
          className="chat-container"
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            className="message-box"
            sx={{
              flexGrow: 1,
              overflow: 'auto',
            }}
          >
            <ChatMessageBox messages={messages} />
            <div ref={messagesEndRef} />
          </Box>
          <Box
            className="input-container"
            sx={{
              flexShrink: 0,
              backgroundColor: 'transparent',
              padding: '8px', // Reduce padding
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Select
              displayEmpty
              onChange={handleSelectChange}
              sx={{
                width: '150px', // Adjust the width as needed
                height: '40px', // Match the height of the Input component
                marginRight: '8px', // Adjust space to the right of the dropdown
                '.MuiSelect-select': {
                  backgroundColor: isDark ? '#202123' : '#BC9F8B',
                  color: '#FFFFFF',
                  padding: '10px 14px', // Adjust padding to match input height
                },
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.15)',
                  borderWidth: isDark ? '1px' : '2px',
                },
                '.MuiSelect-icon': {
                  color: '#FFFFFF',
                },
              }}
              value={selectedOption}
            >
              <MenuItem value="openai">OPEN AI</MenuItem>
            </Select>
            <Input
              aria-label="Input for chat messages"
              className="flex-grow"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Say Something"
              style={{ height: '40px' }} // Set the height to match the Select component
              value={textInput}
            />
            <Button
              aria-label="Send message"
              className="ml-2 custom-white-button"
              onClick={() => void handleClick()}
              size="icon"
              style={{ height: '40px', minWidth: '40px', color: isDark ? '#202123' : '#BC9F8B' }} // Match height with input and select
              variant="outline"
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UserInput;
