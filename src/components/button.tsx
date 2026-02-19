import React from "react";
import type { CardType, MaterialIconName } from "../Types/types";
import styled from "styled-components";
import Icon from "./icon";
import { buttonTheme__css, textTheme__css } from "../styles/CssComponents";

export interface ButtonProps {
  label: string;
  iconName?: MaterialIconName;
  action?: () => void;
  type?: CardType;
  customStyle?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  label = "Default",
  iconName = "Abc",
}) => {
  return (
    <BaseButtonCustom>
      <p>{label}</p>
      {iconName ? <Icon iconName={iconName} size={24}></Icon> : ""}
    </BaseButtonCustom>
  );
};

const BaseButtonCustom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  cursor: pointer;

  width: fit-content;
  padding: 5px 10px;
  border-radius: 6px;

  ${buttonTheme__css}

  & > p {
    ${textTheme__css}
  }
`;

export default Button;
