import React from "react";
import styled from "styled-components";
import segurosMonterreyLogo from "@/assets/logosegurosmonterrey.png";
import Icon from "./icon";
import { useContext } from "react";
import {
  UserModeContext,
  type UserMode,
} from "../Context/ContextConfig";
import { UserModeTag } from "./NoFunctional";
import {
  borderTheme__css,
  headerTheme,
  textTheme__css,
} from "../styles/CssComponents";
import ThemeToggle from "./toggleThemeButton";
import { NavLink } from "react-router";

export interface HeaderProps {
  title?: string;
  logoSrc?: string;
  alt?: string;
  onLogoClick?: () => void;
  children?: React.ReactNode;
  userType?: UserMode;
}

const Header: React.FC<HeaderProps> = ({ userType = "Admin" }) => {
  const userMode = useContext(UserModeContext);

  return (
    <HeaderMain>
      <HeaderImg src={segurosMonterreyLogo} alt="Imagen de seguros monterrey" />
      <NavLink to="/auth">Ir a auth</NavLink>
      <NavLink to="/dashboard">Ir a dash</NavLink>
      <ThemeToggle />
      <DesktopView>
        <UserData $usertype={userType}>
          <p>oadrian38@gmail.com</p>
          <UserModeTag $usertype={userMode ?? "Demo"}>
            {userMode ?? "Demo"}
          </UserModeTag>
        </UserData>
        <Icon iconName="Settings" size={24} isButton={true}></Icon>
        <Icon iconName="Logout" size={24} isButton={true}></Icon>
      </DesktopView>
      <MobileView>
        <Icon iconName="Menu" size={40} isButton={true}></Icon>
      </MobileView>
    </HeaderMain>
  );
};

const HeaderMain = styled.div`
  ${headerTheme}
  ${borderTheme__css}
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  justify-content: space-between;
  @media (min-width: 540px) {
    padding: 1rem 4vw;
  }
`;

const HeaderImg = styled.img``;

const MobileView = styled.div`
  display: none;
  @media (max-width: 540px) {
    display: flex;
  }
`;

const DesktopView = styled.div`
  display: none;
  /* display: flex; */
  flex-direction: row;
  align-items: center;
  gap: 20px;
  @media (min-width: 540px) {
    display: flex;
  }
`;

const UserData = styled.div<{ $usertype: UserMode }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  & p {
    ${textTheme__css};
  }
`;

export default Header;
