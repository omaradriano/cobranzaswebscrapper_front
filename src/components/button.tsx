import React from "react";
import type { CardType, MaterialIconName } from "../Types/types";
import styled from "styled-components";
import Icon from "./icon";
import { ButtonConf__SC, textTheme__css } from "../styles/CssComponents";

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
  type = "Default",
}) => {
  return (
    <BaseButtonCustom $type={type}>
      <p>{label}</p>
      {iconName ? <Icon iconName={iconName} size={24}></Icon> : ""}
    </BaseButtonCustom>
  );
};

const BaseButtonCustom = styled.div<{ $type: CardType }>`

  ${ButtonConf__SC}

  gap: 5px;
  width: fit-content;
  transition: 0.2s linear;

  & > p {
    ${textTheme__css}
  }
`;

export default Button;
