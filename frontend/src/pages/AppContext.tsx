import { createContext, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

type AppState = {
  currConversation: string;
  setCurrConversation: Dispatch<SetStateAction<string>>;
};

const defaultState = {
  currConversation: '',
  setCurrConversation: () => undefined,
} as AppState;

export const AppContext = createContext(defaultState);

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  const [currConversation, setCurrConversation] = useState<string>('');

  return (
    <AppContext.Provider value={{ currConversation, setCurrConversation }}>
      {children}
    </AppContext.Provider>
  );
}
