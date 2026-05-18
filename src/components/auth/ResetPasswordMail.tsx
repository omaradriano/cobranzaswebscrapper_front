import React from "react";
import { AuthButton, InputText } from "./styles";
import { useNavigate } from "react-router";

const ResetPasswordMail: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");

  const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
  };

  const handlePasswordEmail = async () => {
    // Aquí iría la lógica para enviar el correo de restablecimiento
    console.log("Correo de restablecimiento enviado");

    const resetpassflow = await fetch(
      "http://localhost:3006/v1/auth/resetpasswordmail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    const data = await resetpassflow.json();

    if (!data.success) {
      console.error("Error al enviar correo de restablecimiento:", data.message);
      return;
    }

    navigate("/auth/resetpasswordemailsended");
  };

  return (
    <>
      <InputText>
        <p>Correo</p>
        <input
          name="email"
          type="text"
          placeholder="tu@email.com"
          value={email}
          onChange={handleEmailChange}
        />
      </InputText>
      <AuthButton
        label="Enviar correo de restablecimiento"
        type="DefaultBlue"
        action={handlePasswordEmail}
      />
    </>
  );
};

export default ResetPasswordMail;
