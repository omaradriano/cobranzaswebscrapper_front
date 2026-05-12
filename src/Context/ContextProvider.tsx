import { ThemeProvider } from "styled-components";
import { AlertContext, ThemeContext, UserModeContext } from "./ContextConfig";
import { useState } from "react";
import type { DefaultTheme } from "styled-components/dist/types";
import useModalAlert from "../customHooks/useModalAlert";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("themeMode");

    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch {
        return savedTheme;
      }
    }

    return "Dark";
  });

  const themeValues = {
    mode: theme,
    text: theme === "Dark" ? "#fff" : "black",
  };

  const { alertOptions, setAlertOptions, showAlert, setShowAlert } =
    useModalAlert();
  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ThemeProvider theme={themeValues as DefaultTheme}>
          <UserModeContext.Provider value={"Admin"}>
            <AlertContext.Provider
              value={{ alertOptions, setAlertOptions, showAlert, setShowAlert }}
            >
              {children}
            </AlertContext.Provider>
          </UserModeContext.Provider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </>
  );
};

export default ContextProvider;
