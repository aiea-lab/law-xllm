import type { Result } from '@/components/UserInput/types';

import type { ChatGPTResponse } from './type';

async function ChatGPTCall(text: string): Promise<Result> {
  const MODEL_NAME = 'gpt-3.5-turbo';
  try {
    const res = await fetch('http://127.0.0.1:5000/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content:
              'You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.',
          },
          { role: 'user', content: text },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const response = (await res.json()) as ChatGPTResponse;
    if (
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message ||
      !response.choices[0].message.content
    ) {
      throw new Error('Invalid response format');
    }

    const responseMessage = response.choices[0].message.content;

    return {
      type: 'success',
      data: responseMessage,
    };
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return {
      type: 'err',
      data: 'An error occurred while fetching the response.',
    };
  }
}

export default ChatGPTCall;
