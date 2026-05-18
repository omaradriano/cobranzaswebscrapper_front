import React from "react";
import { useSearchParams } from "react-router";
import styled from "styled-components";
import { CardComponent__SC, FlexColumn__SC } from "../styles/CssComponents";

// Importación de sub-formularios
import SignInForm from "./auth/SignInForm";
import SignUpForm from "./auth/SignUpForm";
import SetPasswordForm from "./auth/SetPasswordForm";
import ResetPasswordMail from "./auth/ResetPasswordMail";
// import ResetPasswordForm from "./auth/ResetPasswordForm"; // Descomentar cuando lo crees

export type AuthMode =
  | "SignIn"
  | "SignUp"
  | "SetPassword"
  | "LoggedIn"
  | "EmailSended"
  | "Verified"
  | "ResetPassword"
  | "ResetPasswordCompleted"
  | "RegisterCompleted"
  | "ResetPasswordInitFlow"
  | "ResetPasswordEmailSended";

export interface AuthProps {
  test?: string;
  mode: AuthMode;
}

const displayMessages: Record<AuthMode, string> = {
  SignIn: "Inicia sesión",
  SignUp: "Crea una cuenta",
  SetPassword: "Establece tu contraseña",
  LoggedIn: "Sesión iniciada",
  EmailSended: "Envio de correo de confirmación",
  ResetPassword: "Restablecimiento de contraseña",
  ResetPasswordCompleted: "Restablecimiento de contraseña completado",
  Verified: "Verificación de cuenta",
  RegisterCompleted: "Registro completado. Puede unirse a la extensión.",
  ResetPasswordInitFlow: "Restablecimiento de contraseña",
  ResetPasswordEmailSended: "Correo de restablecimiento enviado",
};

const AuthView: React.FC<AuthProps> = ({ mode = "SignIn" }) => {
  const [searchParams] = useSearchParams();

  // Parámetros de la URL pasados limpia y directamente a los subcomponentes
  const tokenParam = searchParams.get("token") ?? null;
  const setpasswordParam = searchParams.get("setpasswordmode") ?? null;
  const verifiedAccountStatus = searchParams.get("status") ?? "unset";

  const renderContent = () => {
    switch (mode) {
      case "SignIn":
        return <SignInForm />;

      case "SignUp":
        return <SignUpForm />;

      case "ResetPasswordInitFlow":
        return <ResetPasswordMail />;

      case "SetPassword":
        return (
          <SetPasswordForm
            setPasswordMode={setpasswordParam}
            token={tokenParam}
          />
        );
      case "ResetPassword":
        return (
          <SetPasswordForm
            setPasswordMode={setpasswordParam}
            token={tokenParam}
          />
        );

      case "LoggedIn":
        return <p>Sesión iniciada con éxito. Ahora puede usar su extensión</p>;

      case "RegisterCompleted":
        return (
          <p>
            Registro completado con éxito. Ahora puede usar su extensión y
            plataforma web.
          </p>
        );

      case "ResetPasswordEmailSended":
        return (
          <p>
            Se ha enviado un correo para restablecer la contraseña. Revise su
            correo electrónico.
          </p>
        );
      case "EmailSended":
        return (
          <p>
            Se ha enviado un correo para verificar la cuenta. Revise su correo
            electrónico.
          </p>
        );

      case "ResetPasswordCompleted":
        return (
          <p>
            La contraseña ha sido restablecida con éxito. Ahora puede iniciar
            sesión.
          </p>
        );

      case "Verified":
        return verifiedAccountStatus === "success" ? (
          <p>La cuenta ha sido confirmada. Ahora puede iniciar sesión.</p>
        ) : (
          <p>El token no existe o expiró</p>
        );

      default:
        return null;
    }
  };

  return (
    <AuthCustom>
      <AuthContainer>
        <h2>{displayMessages[mode]}</h2>
        {renderContent()}
      </AuthContainer>
    </AuthCustom>
  );
};

// --- ESTILOS ---
const AuthCustom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
  width: 100%;
`;

const AuthContainer = styled.div`
  ${FlexColumn__SC}
  width: clamp(300px, 100%, 500px);
  ${CardComponent__SC}
  gap: 10px;
`;

export default AuthView;
