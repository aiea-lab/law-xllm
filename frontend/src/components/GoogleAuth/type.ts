export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
