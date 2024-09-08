import { createContext, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

type AppState = {
  currConversation: string;
  setCurrConversation: Dispatch<SetStateAction<string>>;
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
};

const defaultState = {
  currConversation: '',
  setCurrConversation: () => undefined,
  isDark: true,
  setIsDark: () => undefined,
} as AppState;

export const AppContext = createContext(defaultState);

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  const [currConversation, setCurrConversation] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(true);

  return (
    <AppContext.Provider value={{ currConversation, setCurrConversation, isDark, setIsDark }}>
      {children}
    </AppContext.Provider>
  );
}
