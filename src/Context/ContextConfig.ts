import { createContext } from "react";
import type { AlertOptions } from "../customHooks/useModalAlert";

export type PreferedScheme = "Light" | "Dark";
export const ThemeContext = createContext<{
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export type UserMode = "Asegurador" | "Admin" | "Demo";
export const UserModeContext = createContext<UserMode | null>(null);

export const AlertContext = createContext<{
  alertOptions: AlertOptions;
  setAlertOptions: React.Dispatch<React.SetStateAction<AlertOptions>>;
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);
