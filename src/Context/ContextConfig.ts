import { createContext } from "react";

export type PreferedScheme = 'Light' | 'Dark';
export const ThemeContext = createContext<{
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export type UserMode = 'Asegurador' | 'Admin' | 'Demo';
export const UserModeContext = createContext<UserMode | null>(null);