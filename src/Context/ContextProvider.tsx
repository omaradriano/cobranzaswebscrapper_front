import { ThemeProvider } from "styled-components";
import {
  AlertContext,
  ThemeContext,
  UserModeContext,
  AuthContext,
} from "./ContextConfig";
import { useEffect, useState } from "react";
import type { DefaultTheme } from "styled-components/dist/types";
import useModalAlert from "../customHooks/useModalAlert";
import type { session_claims } from "../Types/types";
import { useNavigate } from "react-router";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [session, setSession] = useState<session_claims | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function verifySession() {
      const session_token = localStorage.getItem("session_jwt");

      if (session_token === null) {
        setIsAuthenticated(false);
        console.log("No existe sesion");
        navigate("/home");
        return;
      }

      const session_req = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/v1/auth/checkSession`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session_token}`,
          },
        },
      );

      const session_data: { success: boolean; payload: session_claims; message?: string } =
        await session_req.json();
      if (!session_data.success) {
        console.error("Error al verificar sesión:", session_data.message);
        setIsAuthenticated(false);
        navigate("/home");
        return;
      }

      console.log(session_data);

      setSession(session_data.payload);
      setIsAuthenticated(true);
    }

    verifySession();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, session, setSession }}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <ThemeProvider theme={themeValues as DefaultTheme}>
            <UserModeContext.Provider value={"Admin"}>
              <AlertContext.Provider
                value={{
                  alertOptions,
                  setAlertOptions,
                  showAlert,
                  setShowAlert,
                }}
              >
                {children}
              </AlertContext.Provider>
            </UserModeContext.Provider>
          </ThemeProvider>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </>
  );
};

export default ContextProvider;
