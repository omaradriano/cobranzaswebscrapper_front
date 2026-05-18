import React from "react";
import { AuthButton, InputText } from "./styles";
import Button from "../button";

const SignInForm: React.FC = () => {
  return (
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
    </>
  );
};

export default SignInForm;
