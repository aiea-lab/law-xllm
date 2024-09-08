import { useState, useRef, useEffect, useContext } from 'react';

import data from '@/data/conversations.json';
import ChatGPTCall from '@/hooks/ChatGPTCall';
import { AppContext } from '@/pages/AppContext';

import ConversationFlask from './ConversationFlask';
import type { Result, Message } from './types';

export const useChatHandler = () => {
  const [textInput, setTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { currConversation } = useContext(AppContext);

  useEffect(() => {
    const conversation = data.find((conv) => conv.title === currConversation);
    if (conversation) {
      const msgs: Message[] = JSON.parse(JSON.stringify(conversation.content)) as Message[];
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  }, [currConversation]);

  const handleClick = async (): Promise<void> => {
    if (textInput.trim() === '') return;

    const userMessage: Message = { type: 'user', text: textInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const result: Result = await ChatGPTCall(textInput);
      const botMessage: Message =
        result.type === 'success'
          ? { type: 'user', text: result.data }
          : { type: 'bot', text: 'An error occurred while fetching the response.' };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Store both messages in the database
      await ConversationFlask(userMessage);
      await ConversationFlask(botMessage);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: textInput },
        { type: 'text', text: 'An error occurred while fetching the response.' },
      ]);
    } finally {
      setTextInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    textInput,
    setTextInput,
    messages,
    handleClick,
    messagesEndRef,
  };
};
