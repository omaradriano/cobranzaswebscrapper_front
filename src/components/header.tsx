import React from "react";
import styled from "styled-components";
import headerlogo from "@/assets/react.svg";
import Icon from "./icon";
import { useContext } from "react";
import {
  AuthContext,
  // UserModeContext,
  type UserMode,
} from "../Context/ContextConfig";
// import { UserModeTag } from "./NoFunctional";
import {
  borderTheme__css,
  headerTheme,
  textTheme__css,
} from "../styles/CssComponents";
import { NavLink, useNavigate } from "react-router";

export interface HeaderProps {
  title?: string;
  logoSrc?: string;
  alt?: string;
  onLogoClick?: () => void;
  children?: React.ReactNode;
  userType?: UserMode;
}

const Header: React.FC<HeaderProps> = ({ userType = "Admin" }) => {
  // const userMode = useContext(UserModeContext);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  // Evaluamos si existe una sesión activa de forma clara
  const isAuthenticated = auth?.session != null;

  return (
    <HeaderMain>
      <HeaderImg
        src={headerlogo}
        alt="Logo de app"
        onClick={() => navigate("/home")}
      />

      {/* <ThemeToggle /> */}

      <DesktopView>
        <CustomNavLink to={"/privacy"}>Politica de privacidad</CustomNavLink>
        {/* VISTA CON SESIÓN ACTIVA */}
        {isAuthenticated ? (
          <>
            <CustomNavLink to={"/dashboard"}>Dashboard</CustomNavLink>
            <CustomNavLink to={"/calendar"}>Calendario</CustomNavLink>
            <UserData $usertype={userType}>
              <p>{auth?.session?.email}</p>
              {/* <UserModeTag $usertype={userMode ?? "Demo"}>
                {userMode ?? "Demo"}
              </UserModeTag> */}
            </UserData>

            {/* <Icon iconName="Settings" size={24} isButton={true} /> */}

            <Icon
              iconName="Logout"
              size={24}
              isButton={true}
              action={() => {
                localStorage.removeItem("session_jwt");
                auth?.setSession(null);
                auth?.setIsAuthenticated(false); // Asegúrate de apagar tu bandera global de auth si la usas
                navigate("/home");
              }}
            />
          </>
        ) : (
          /* VISTA SIN SESIÓN */
          <>
            <LoginLink to="/auth/signin">Iniciar sesión</LoginLink>
          </>
        )}
      </DesktopView>

      <MobileView>
        {/* <Icon iconName="Menu" size={40} isButton={true} /> */}

        {!isAuthenticated ? (
          <>
            <CustomNavLink to={"/privacy"}>
              Politica de privacidad
            </CustomNavLink>
            <LoginLink to="/auth/signin">Iniciar sesión</LoginLink>
          </>
        ) : (
          <HeaderContainerMobile>
            <CustomNavLink to={"/privacy"}>
              Politica de privacidad
            </CustomNavLink>
            <CustomNavLink to={"/dashboard"}>Dashboard</CustomNavLink>
            <CustomNavLink to={"/calendar"}>Calendario</CustomNavLink>
            <Icon
              iconName="Logout"
              size={24}
              isButton={true}
              action={() => {
                localStorage.removeItem("session_jwt");
                auth?.setSession(null);
                auth?.setIsAuthenticated(false); // Asegúrate de apagar tu bandera global de auth si la usas
                navigate("/home");
              }}
            />
          </HeaderContainerMobile>
        )}
      </MobileView>
    </HeaderMain>
  );
};

// Estilos para el enlace de inicio de sesión que combinen con tu tema de texto
const LoginLink = styled(NavLink)`
  text-decoration: none;
  font-weight: 500;
  ${textTheme__css};

  &:hover {
    opacity: 0.8;
  }
`;

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

const HeaderImg = styled.img`
  cursor: pointer;
`;

const MobileView = styled.div`
  display: none;
  @media (max-width: 540px) {
    display: flex;
  }
`;

const DesktopView = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  @media (min-width: 540px) {
    display: flex;
  }
`;

const HeaderContainerMobile = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const CustomNavLink = styled(NavLink)`
  text-decoration: none;
  color: #2727f2;
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
