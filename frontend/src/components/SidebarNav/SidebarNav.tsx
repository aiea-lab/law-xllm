import { Box, Button, Divider, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { Sidebar } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { FaMoon, FaUser, FaQuestionCircle } from 'react-icons/fa';

import CustomSignInButton from '@/components/CustomSignInButton';
import GoogleLoginComponent from '@/components/GoogleAuth/GoogleLoginComponent';
import data from '@/data/conversations.json';
import { AppContext } from '@/pages/AppContext';

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [conversations, setConversations] = useState<JSX.Element[]>([]);
  const { setCurrConversation } = useContext(AppContext);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const changeConversation = (name: string) => () => {
      setCurrConversation(name);
    };

    const fetchData = () => {
      const arr = data.map((conversation) => (
        <ListItem
          key={conversation.title}
          sx={{
            marginBottom: '0.5rem',
            color: 'gray.300',
            fontSize: '0.875rem',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <ListItemButton onClick={changeConversation(conversation.title)}>
            {conversation.title}
          </ListItemButton>
        </ListItem>
      ));
      setConversations(arr);
    };
    fetchData();
  }, [setCurrConversation]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: isOpen ? '16rem' : '4rem',
        height: '100%',
        backgroundColor: '#202123',
        color: 'white',
        transition: 'width 0.3s',
      }}
    >
      <Box
        component="aside"
        sx={{
          display: isOpen ? 'block' : 'none',
          width: '16rem',
          height: '100%',
          backgroundColor: '#202123',
          color: 'white',
          padding: '1rem',
          flexDirection: 'column',
        }}
      >
        <Box mb={4}>
          <Box display="flex" flexDirection="row" gap={2}>
            <Button
              sx={{
                width: '100%',
                backgroundColor: '#202123',
                border: '1px solid',
                borderColor: 'gray.700',
                color: 'white',
                paddingY: '0.5rem',
                paddingX: '1rem',
                borderRadius: '9999px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="body2">
                <Box component="span" mr={2}>
                  +
                </Box>{' '}
                New chat
              </Typography>
            </Button>
            <Button
              onClick={toggleSidebar}
              sx={{
                width: '2rem',
                height: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'gray.400',
              }}
            >
              <Sidebar size={24} />
            </Button>
          </Box>
          <Typography sx={{ color: 'gray.400', marginBottom: '0.5rem' }} variant="body2">
            Previous 7 days
          </Typography>
          <List>{conversations}</List>
        </Box>
        <Box mt="auto">
          <Divider sx={{ borderColor: 'gray.700', marginBottom: '1rem' }} />
          <List>
            <ListItem
              sx={{
                marginBottom: '0.5rem',
                color: 'gray.300',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaMoon style={{ marginRight: '0.5rem' }} /> Dark mode
            </ListItem>
            <ListItem
              sx={{
                marginBottom: '0.5rem',
                color: 'gray.300',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaUser style={{ marginRight: '0.5rem' }} /> My account
            </ListItem>
            <ListItem
              sx={{
                marginBottom: '0.5rem',
                color: 'gray.300',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaQuestionCircle style={{ marginRight: '0.5rem' }} /> Updates & FAQ
            </ListItem>
          </List>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <GoogleLoginComponent />
            <CustomSignInButton />
          </div>
        </Box>
      </Box>

      <Box
        onClick={toggleSidebar}
        sx={{
          display: 'flex',
          alignItems: 'start',
          paddingTop: '1rem',
          justifyContent: 'center',
          width: '4rem',
          height: '100%',
          cursor: 'pointer',
        }}
      >
        <Sidebar size={24} />
      </Box>
    </Box>
  );
};

export default SidebarNav;
