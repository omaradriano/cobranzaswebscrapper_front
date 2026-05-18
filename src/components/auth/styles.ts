import styled from "styled-components";
import { FlexColumn__SC } from "../../styles/CssComponents";
import Button from "../button";

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

const AuthButton = styled(Button)`
  width: 100% !important;
`;

export { InputText, CredentialAlert, AuthButton };