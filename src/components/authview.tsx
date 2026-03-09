import React from "react";
import styled from "styled-components";
import {
  CardComponent__SC,
  FlexColumn__SC,
  Link__SC,
} from "../styles/CssComponents";
import Button from "./button";

export interface AuthProps {
  test?: string;
  mode: AuthMode;
}

export type AuthMode = "SignIn" | "SignUp";

const AuthView: React.FC<AuthProps> = ({ mode = "SignIn" }) => {
  return (
    <AuthCustom>
      <AuthContainer>
        <h2>Cobranzas clientes</h2>
        {mode === "SignIn" ? (
          <>
            <p>Inicia sesion para acceder al sistema</p>
            <InputText>
              <p>Email</p>
              <input type="text" placeholder="tu@email.com" />
            </InputText>
            <InputText>
              <p>Contraseña</p>
              <input type="password" placeholder="Contraseña" />
            </InputText>
            <AuthButton label="Iniciar sesión" type="DefaultBlue" />
            <Button label="Entrar como Demo" type="Default" />
            <p>
              No tienes cuenta? <SpanLink>Registrate aqui</SpanLink>
            </p>
          </>
        ) : (
          <>
            <p>Crea una nueva cuenta</p>
            <InputText>
              <p>Email</p>
              <input type="text" placeholder="tu@email.com" />
            </InputText>
            <InputText>
              <p>Contraseña</p>
              <input type="password" placeholder="Contraseña" />
            </InputText>
            <InputText>
              <p>Repite contraseña</p>
              <input type="password" placeholder="Contraseña" />
            </InputText>
            <AuthButton label="Completa registro" type="DefaultBlue" />
            <p>
              Ya tienes una cuenta? <SpanLink>Inicia sesión</SpanLink>
            </p>
          </>
        )}
      </AuthContainer>
    </AuthCustom>
  );
};

const AuthContainer = styled.div`
  ${FlexColumn__SC}
  width: clamp(300px, 100%, 500px);
  /* background-color: orange; */
  ${CardComponent__SC}
  gap: 10px;
`;

const AuthButton = styled(Button)`
  width: 100% !important;
`;

const InputText = styled.div`
  ${FlexColumn__SC}
  gap: 3px;

  & > p {
    color: #bbbbbb;
  }

  & > input[type="text"],
  & > input[type="password"] {
    border-radius: 5px;
    outline: none;
    border: unset;
    height: fit-content;
    padding: 5px 10px;
    font-size: 16px;
    background-color: #ebf1f9;
  }
`;

const SpanLink = styled.span`
  ${Link__SC}
`;

const AuthCustom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  /* background-color: #946464; */
  height: calc(100vh - 60px);
  width: 100%;
`;

export default AuthView;
