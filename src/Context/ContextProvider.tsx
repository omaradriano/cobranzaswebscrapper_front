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
import { useNavigate, useLocation } from "react-router"; // 💡 Agregamos useLocation

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

  const { alertOptions, setAlertOptions, showAlert, setShowAlert } = useModalAlert();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<session_claims | null>(null);
  
  // 💡 Estado para saber si ya terminamos de validar la sesión y no renderizar a ciegas
  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();
  const location = useLocation(); // 💡 Para saber en qué ruta está parado el usuario

  useEffect(() => {
    async function verifySession() {
      const session_token = localStorage.getItem("session_jwt");

      // 💡 Rutas públicas donde NO queremos redirigir a /home si no hay token
      const isPublicRoute = location.pathname === "/home" || location.pathname === "/auth/signin";

      if (!session_token) {
        setIsAuthenticated(false);
        setSession(null);
        setLoading(false);
        
        // Solo redirige si intenta entrar a una ruta protegida (ej: /dashboard)
        if (!isPublicRoute) {
          navigate("/home");
        }
        return;
      }

      try {
        const session_req = await fetch(
          `${import.meta.env.VITE_API_SERVER_URL}/v1/auth/checkSession`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session_token}`,
            },
          }
        );

        if (!session_req.ok) {
          throw new Error("Token inválido o expirado en el servidor");
        }

        const session_data: { success: boolean; payload: session_claims; message?: string } =
          await session_req.json();

        if (!session_data.success) {
          console.error("Error al verificar sesión:", session_data.message);
          localStorage.removeItem("session_jwt"); // Limpiamos token basura
          setIsAuthenticated(false);
          setSession(null);
          if (!isPublicRoute) navigate("/home");
          return;
        }

        setSession(session_data.payload);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error de conexión con el servidor Go:", error);
        setIsAuthenticated(false);
        setSession(null);
        if (!isPublicRoute) navigate("/home");
      } finally {
        setLoading(false); // Terminó la validación (sea éxito o fallo)
      }
    }

    verifySession();
  }, [navigate, location.pathname]); // 💡 Escucha si cambia de ruta para validar

  // 💡 Evita destellos raros de la interfaz mientras el backend de Go responde
  if (loading) {
    return null; // O un spinner de carga bonito temporal
  }

  return (
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
  );
};

export default ContextProvider;