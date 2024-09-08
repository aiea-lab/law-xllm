import type { Message } from './types';

async function ConversationFlask(message: Message) {
  try {
    const response = await fetch('http://127.0.0.1:5000/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Message;
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return { error: 'An error occurred while sending the conversation.' };
  }
}

export default ConversationFlask;
