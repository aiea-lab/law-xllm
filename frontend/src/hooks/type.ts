export type ChatGPTResponse = {
  choices: [
    {
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
      index: number;
      logprobs: null | object;
    },
  ];
};
