import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext, type PreferedScheme } from "../Context/ContextConfig";
import StatTag from "./statCard";
import PolizasContainer from "./polizasContainer";
import { textTheme__css } from "../styles/CssComponents";

export interface DashboardProps {
  title?: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const theme = useContext(ThemeContext);

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Mis pólizas</DashboardTitle>
        <DashboardText $theme={theme?.theme as PreferedScheme}>
          Gestiona tus recordatorios de corte de pólizas. Configurados para
          recordarte 7 días antes.
        </DashboardText>
      </DashboardHeader>
      <DashboardBody>
        {/* CONTENEDOR PARA LOS TAGS */}
        <StatContainer>
          <StatTag
            amount={11}
            title="Total de polizas"
            type="Default"
          ></StatTag>
          <StatTag
            amount={5}
            title="Recordatorios activos"
            type="Default"
          ></StatTag>
          <StatTag amount={5} title="Polizas activas" type="Danger"></StatTag>
          <StatTag
            amount={3}
            title="Polizas inactivas"
            type="Success"
          ></StatTag>
        </StatContainer>
        {/* CONTENEDOR PARA LA LISTA DE POLIZAS */}
        <PolizasContainer
          data={[
            {
              asegurado: "Omar Adrian Acosta Santiago",
              contratante: "Alexis Santiesteban",
              diaCobro: 0,
              estatus: "Anulada",
              fechaEmision: "13/02/2026",
              formaPago: "SEMESTRAL",
              medioCobro: "MODO DIRECTO",
              numPoliza: "GM0000679872",
              plan: "COMPLETO",
              tipoSeguro: "GASTOS MEDICOS MAYORES INDIVIDUAL",
            },
            {
              asegurado: "Valeria Acosta Santiago",
              contratante: "Alexis Santiesteban",
              diaCobro: 5,
              estatus: "En Vigor",
              fechaEmision: "13/02/2026",
              formaPago: "MENSUAL",
              medioCobro: "MODO DIRECTO",
              numPoliza: "GM0000679873",
              plan: "COMPLETO",
              tipoSeguro: "GASTOS MEDICOS MAYORES INDIVIDUAL",
            },
          ]}
        ></PolizasContainer>
      </DashboardBody>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 4vw;
  gap: 15px;
`;

const DashboardHeader = styled.div`
  & h1 {
    font-size: clamp(2rem, 5vw, 2.5rem);
  }
`;

const DashboardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StatContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  /* margin: 10px 0; */
  justify-content: center;
  @media (min-width: 540px) {
    flex-direction: row;
  }
`;

const DashboardTitle = styled.h1`
  ${textTheme__css};
`;

const DashboardText = styled.p<{ $theme: PreferedScheme }>`
  color: ${(p) => (p.$theme === "Dark" ? "#999999" : "#000")};
  font-size: clamp(16px, 2vw, 1.2rem);
`;

export default Dashboard;
