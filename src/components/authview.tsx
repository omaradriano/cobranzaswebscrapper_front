import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  CardComponent__SC,
  FlexColumn__SC,
  // Link__SC,
} from "../styles/CssComponents";
import Button from "./button";
import { useNavigate, useSearchParams } from "react-router";
import type { Insurance } from "../Types/types";

export interface AuthProps {
  test?: string;
  mode: AuthMode;
}

export interface ResetPassProps {
  password: string;
  repeat_password: string;
}

export interface RegisterCredentialsProps extends ResetPassProps {
  email: string;
  insurance: Insurance;
  no_asesor: string;
}

const displayMessages: Record<AuthMode, string> = {
  SignIn: "Inicia sesión",
  SignUp: "Crea una cuenta",
  SetPassword: "Establece tu contraseña",
  LoggedIn: "Sesión iniciada",
  EmailSended: "Envio de correo de confirmación",
  ResetPassword: "Restablecimiento de contraseña",
  Verified: "Verificación de cuenta",
};

export type AuthMode =
  | "SignIn"
  | "SignUp"
  | "SetPassword"
  | "LoggedIn"
  | "EmailSended"
  | "Verified"
  | "ResetPassword";

const AuthView: React.FC<AuthProps> = ({ mode = "SignIn" }) => {
  // Obtener el token de la URL para el registro de nueva contraseña
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");
  const verifiedAccountStatus = searchParams.get("status") ?? "unset";

  /**
   * Validaciones para una nueva contraseña (primera vez)
   */
  const [resetPassCredentials, setResetPassCredentials] =
    useState<ResetPassProps>({ password: "", repeat_password: "" });
  const isPasswordValid = validatePassword(resetPassCredentials.password);
  const passwordsMatch =
    resetPassCredentials.password !== "" &&
    resetPassCredentials.password === resetPassCredentials.repeat_password;
  const [fieldSetPassModified, setFieldSetPassModified] = useState({
    email: false,
    password: false,
    repeat_password: false,
  });

  const [resetPassCompleted, setResetPassCompleted] = useState<boolean | null>(
    null,
  );

  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(
    null,
  );

  /**
   * Validaciones para registro
   */
  const [registerCredentials, setRegisterCredentials] =
    useState<RegisterCredentialsProps>({
      email: "",
      password: "",
      insurance: null,
      repeat_password: "",
      no_asesor: "",
    });

  const isEmailValid = validateEmail(registerCredentials.email);
  const isRegisterPasswordValid = validatePassword(
    registerCredentials.password,
  );
  const isInsuranceSelected =
    registerCredentials.insurance !== null ? true : false;
  const registerPasswordsMatch =
    registerCredentials.password !== "" &&
    registerCredentials.password === registerCredentials.repeat_password;
  const areRegisterCredentialsValid =
    isEmailValid &&
    isRegisterPasswordValid &&
    registerPasswordsMatch &&
    isInsuranceSelected;

  const [fieldModified, setFieldModified] = useState({
    email: false,
    password: false,
    repeat_password: false,
  });

  /**
   * Correo ya existe
   */
  const [emailExist, setEmailExist] = useState<boolean | null>(null);

  /**
   * Restablecimiento de contraseña
   */
  const [resetPasswordValue, setResetPasswordValue] = useState<string>("");

  /**
   * @description Validador para contraseña
   * @param email
   * @returns
   */
  function validateEmail(email: string): boolean {
    const email_reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return email_reg.test(email);
  }

  /**
   * @description Validador para contraseña
   * @param password
   * @returns
   */
  function validatePassword(password: string) {
    const pass_reg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._])[A-Za-z\d@$!%*?&._]{8,20}$/;
    return pass_reg.test(password);
  }

  const navigate = useNavigate();

  // useEffect Test
  useEffect(() => {
    console.log(registerCredentials);
  }, [registerCredentials]);

  const renderContent = () => {
    switch (mode) {
      // MARK: INICIO SESION
      case "SignIn":
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

      // MARK: REGISTRO
      case "SignUp":
        return (
          <>
            <p>Crea una nueva cuenta</p>
            {/* EMAIL */}
            <InputText>
              <p>Correo</p>
              <input
                name="email"
                type="text"
                placeholder="tu@email.com"
                onChange={(evt) => {
                  const value = evt.target.value;

                  setRegisterCredentials((prev) => ({
                    ...prev,
                    email: value,
                  }));
                  setFieldModified((prev) => ({
                    ...prev,
                    email: true,
                  }));
                }}
              />
              {!isEmailValid && fieldModified.email ? (
                <CredentialAlert $valid={isEmailValid}>
                  <p>Formato de correo incorrecto</p>
                </CredentialAlert>
              ) : (
                ""
              )}
            </InputText>

            {/* NUMERO DE ASESOR */}
            <InputText>
              <p>Numero de asesor</p>
              <input
                name="no_asesor"
                type="number"
                placeholder="Ej. 000000"
                onChange={(evt) => {
                  const value = evt.target.value;

                  setRegisterCredentials((prev) => ({
                    ...prev,
                    no_asesor: value,
                  }));
                }}
              />
            </InputText>

            {/* CONTRASEÑA */}
            <InputText>
              <p>Contraseña</p>
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                onChange={(evt) => {
                  const value = evt.target.value;

                  setRegisterCredentials((prev) => ({
                    ...prev,
                    password: value,
                  }));

                  setFieldModified((prev) => ({
                    ...prev,
                    password: true,
                    repeat_password: true,
                  }));
                }}
              />
              {!isRegisterPasswordValid && fieldModified.password ? (
                <CredentialAlert $valid={isRegisterPasswordValid}>
                  <p>
                    Formato de contraseña incorrecto. Debe cumplir con los
                    siguiente:
                  </p>
                  <ul>
                    <li>
                      <strong>Longitud:</strong> De 8 a 20 caracteres.
                    </li>
                    <li>
                      <strong>Variedad:</strong> Debe incluir mayúsculas,
                      minúsculas y números.
                    </li>
                    <li>
                      <strong>Carácter especial:</strong> Debe contener al menos
                      un símbolo (ej: @, $, !, %, *, ?, &, _, .).
                    </li>
                  </ul>
                </CredentialAlert>
              ) : (
                ""
              )}
            </InputText>

            {/* REPITE CONTRASEÑA */}
            <InputText>
              <p>Repite contraseña</p>
              <input
                name="repeat_password"
                type="password"
                placeholder="Contraseña"
                onChange={(evt) => {
                  const value = evt.target.value;

                  setRegisterCredentials((prev) => ({
                    ...prev,
                    repeat_password: value,
                  }));

                  setFieldModified((prev) => ({
                    ...prev,
                    repeat_password: true,
                  }));
                }}
              />
              {!registerPasswordsMatch && fieldModified.repeat_password ? (
                <CredentialAlert $valid={registerPasswordsMatch}>
                  <p>Las contraseñas no coinciden</p>
                </CredentialAlert>
              ) : (
                ""
              )}
            </InputText>

            {/* ASEGURADORA */}
            <InputText>
              <p>Aseguradora</p>
              <select
                name="insurance"
                onChange={(evt) => {
                  const value = evt.target.value as Insurance | "";

                  setRegisterCredentials((prev) => ({
                    ...prev,
                    insurance: (value || null) as Insurance | null,
                  }));
                }}
              >
                <option value={""}>Seleccione una opción</option>
                <option value="SM">Seguros Monterrey</option>
              </select>
            </InputText>
            <AuthButton
              disabled={!areRegisterCredentialsValid}
              label="Completa registro"
              type="DefaultBlue"
              action={async () => {
                const options: RequestInit = {
                  method: "POST",
                  body: JSON.stringify(registerCredentials),
                };
                const register_account = await fetch(
                  "http://localhost:3006/v1/auth/register",
                  options,
                );
                const register_account_res = await register_account.json();

                console.log(register_account_res);
                if (register_account_res.success) {
                  console.log("Se ha confirmado la cuenta");
                  navigate("/auth/emailsended");
                } else {
                  console.log("Ha habido un error con la confirmación");
                  /**
                   * Aqui se inserta un alert de confirmacion
                   */
                  setEmailExist(false);
                }
              }}
            />
            {emailExist === false ? (
              <CredentialAlert $valid={emailExist}>
                <p>El correo ingresado ya se encuentra registrado</p>
              </CredentialAlert>
            ) : (
              ""
            )}
          </>
        );

      // MARK: CONTRASEÑA
      case "SetPassword":
        return (
          <>
            <p>Establece tu nueva contraseña</p>
            <InputText>
              <p>Nueva contraseña</p>
              <input
                type="password"
                placeholder="Nueva contraseña"
                onChange={(evt) => {
                  const value = evt.target.value;

                  setResetPassCredentials((prev) => ({
                    ...prev,
                    password: value,
                  }));

                  setFieldSetPassModified((prev) => ({
                    ...prev,
                    password: true,
                    repeat_password: true,
                  }));

                  if (value === "") {
                    setFieldSetPassModified((prev) => ({
                      ...prev,
                      password: false,
                      repeat_password: false,
                    }));
                  }
                }}
              />
            </InputText>
            {!isPasswordValid && fieldSetPassModified.password ? (
              <CredentialAlert $valid={isRegisterPasswordValid}>
                <p>
                  Formato de contraseña incorrecto. Debe cumplir con los
                  siguiente:
                </p>
                <ul>
                  <li>
                    <strong>Longitud:</strong> De 8 a 20 caracteres.
                  </li>
                  <li>
                    <strong>Variedad:</strong> Debe incluir mayúsculas,
                    minúsculas y números.
                  </li>
                  <li>
                    <strong>Carácter especial:</strong> Debe contener al menos
                    un símbolo (ej: @, $, !, %, *, ?, &, _, .).
                  </li>
                </ul>
              </CredentialAlert>
            ) : (
              ""
            )}
            <InputText>
              <p>Confirmar contraseña</p>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                onChange={(evt) => {
                  const value = evt.target.value;

                  setResetPassCredentials((prev) => ({
                    ...prev,
                    repeat_password: value,
                  }));

                  setFieldSetPassModified((prev) => ({
                    ...prev,
                    repeat_password: true,
                  }));
                }}
              />
            </InputText>
            {!passwordsMatch && fieldSetPassModified.repeat_password ? (
              <CredentialAlert $valid={passwordsMatch}>
                <p>Las contraseñas no coinciden</p>
              </CredentialAlert>
            ) : (
              ""
            )}
            <InputText>
              <p>Número de asesor</p>
              <input
                maxLength={6}
                name="no_asesor"
                type="number"
                placeholder="Ej. 000000"
                onChange={(evt) => {
                  const value = evt.target.value;

                  setRegisterCredentials((prev) => ({
                    ...prev,
                    no_asesor: value,
                  }));
                }}
              />
            </InputText>
            <AuthButton
              label="Guardar contraseña"
              type="DefaultBlue"
              disabled={!isPasswordValid || !passwordsMatch}
              action={async () => {
                const options = {
                  method: "POST",
                  body: JSON.stringify({
                    password: resetPassCredentials.password,
                    no_asesor: registerCredentials.no_asesor,
                  }),
                };

                console.log(options);
                const setpassoperation = await fetch(
                  `http://localhost:3006/v1/auth/setpassword?token=${tokenParam}`,
                  options,
                );

                const setpassoperation_res = await setpassoperation.json();

                console.log(setpassoperation_res);

                if (!setpassoperation_res.success) {
                  console.log(
                    `Error al cambiar la contraseña: ${setpassoperation_res.message}`,
                  );
                  setResetPassCompleted(false);
                  setCustomErrorMessage(setpassoperation_res.message);
                  return;
                }

                console.log("Contraseña cambiada con éxito");
                navigate("/auth/loggedin");
              }}
            />

            {resetPassCompleted === false ? (
              <CredentialAlert $valid={resetPassCompleted}>
                <p>
                  No se ha podido cambiar la contraseña: {customErrorMessage}
                </p>
              </CredentialAlert>
            ) : (
              ""
            )}
          </>
        );
      // MARK: RESET PASS
      case "ResetPassword":
        return (
          <>
            <InputText>
              <p>Correo</p>
              <input
                name="repeat_password"
                type="text"
                placeholder="usuario@gmail.com"
                onChange={(evt) => {
                  setResetPasswordValue(evt.target.value);
                }}
              />
            </InputText>
            <ResetPasswordButton
              label="Enviar"
              action={async () => {
                console.log("Enviando reinicio de contraseña");
                console.log(resetPasswordValue);
                const email_reset_pass = await fetch(
                  "http://localhost:3006/v1/auth/resetpasswordmail",
                  {
                    method: "POST",
                    body: JSON.stringify({ email: resetPasswordValue }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                );

                const email_reset_pass_res = await email_reset_pass.json();

                console.log(email_reset_pass_res);
              }}
            ></ResetPasswordButton>
          </>
        );
      // MARK: LOGGED IN
      case "LoggedIn":
        /**
         * Considerar los mensajes vacios para convertirlos en notificaciones
         */
        return (
          <>
            <p>Sesión iniciada con éxito. Ahora puede usar su extensión</p>
          </>
        );
      case "EmailSended":
        return (
          <>
            <p>
              Se ha enviado un correo para verificar la cuenta. Revise su correo
              electrónico.
            </p>
          </>
        );
      case "Verified":
        console.log(verifiedAccountStatus);
        switch (verifiedAccountStatus) {
          case "success":
            return (
              <>
                <p>La cuenta ha sido confirmada. Ahora puede iniciar sesión.</p>
              </>
            );
          case "invalid":
            return (
              <>
                <p>El token no existe o expiró</p>
              </>
            );

          default:
            return null;
        }

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

const CredentialAlert = styled.div<{ $valid: boolean }>`
  height: fit-content;
  flex: 1;
  border-radius: 6px;
  margin: 5px 5px 0 5px;
  padding: 8px 10px;
  font-size: 14px;

  background-color: ${(p) =>
    p.$valid ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"};

  border: 1px solid
    ${(p) => (p.$valid ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)")};

  color: ${(p) => (p.$valid ? "rgb(21, 128, 61)" : "rgb(227, 60, 60)")};

  & > ul {
    margin: 0 20px;
  }
`;

const AuthContainer = styled.div`
  ${FlexColumn__SC}
  width: clamp(300px, 100%, 500px);
  /* background-color: orange; */
  ${CardComponent__SC}
  gap: 10px;
`;

const ResetPasswordButton = styled(Button)`
  align-self: flex-end;
  width: 100%;
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
  & > input[type="password"],
  & > input[type="number"],
  & > select {
    border-radius: 5px;
    outline: none;
    border: unset;
    height: fit-content;
    padding: 5px 10px;
    font-size: 16px;
    background-color: #ebf1f9;
  }

  & > input[type="number"]::-webkit-inner-spin-button,
  & > input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// const SpanLink = styled.span`
//   ${Link__SC}
// `;

const AuthCustom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  /* background-color: #946464; */
  height: calc(100vh - 60px);
  width: 100%;
`;

export default AuthView;
