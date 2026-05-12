import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ThemeContext, type PreferedScheme } from "../Context/ContextConfig";
import StatTag from "./statCard";
import PolizasContainer from "./polizasContainer";
import {
  CardComponent__SC,
  FlexColumn__SC,
  FlexRow__SC,
  textTheme__css,
} from "../styles/CssComponents";
import type { PolizaGetItem, PolizaType } from "../Types/types";
import Button from "./button";
import Icon from "./icon";
import Alert from "./modalAlert";
import { calculateDaysRemaining } from "../functions/globalFunctions";
// import SearchBar from "./searchbar";

export interface DashboardProps {
  title?: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const theme = useContext(ThemeContext);

  const [polizasData, setPolizasData] = useState<PolizaGetItem[]>([]);

  const [totalPolizas, setTotalPolizas] = useState<number>(0);
  const [polizasActivas, setPolizasActivas] = useState<number>(0);
  const [polizasPorVencer, setPolizasPorVencer] = useState<number>(0);
  const [polizasAnuladas, setPolizasAnuladas] = useState<number>(0);

  const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9hZHJpYW4zOEBnbWFpbC5jb20iLCJleHAiOjE3NzgzNTQ2NzQsInJvbGUiOiJ0ZXN0Um9sZSIsInVzZXJfdXVpZCI6ImMyNzVmNWUyLTM2YjUtNDRkNC1iZDBmLTJkY2RiM2Q5ODNlMCJ9.s3Py84Sj1310V3i9fZpb3Zipf_5M1_rrx_9XutNoYp0` 

  const [polizasChanged, setPolizasChanged] = useState<PolizaGetItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:3006/v1/scrapping/polizas/all", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTotalPolizas(data.payload.length);

        setPolizasData(data.payload);

        console.log(data.payload);

        setPolizasActivas(
          data.payload.reduce((acc: number, curr: PolizaType) => {
            if (curr.estatus === "En Vigor") {
              return acc + 1;
            }
            return acc;
          }, 0),
        );

        setPolizasAnuladas(
          data.payload.reduce((acc: number, curr: PolizaGetItem) => {
            if (curr.estatus === "Anulada") {
              return acc + 1;
            }
            return acc;
          }, 0),
        );

        setPolizasPorVencer(
          data.payload.reduce((acc: number, curr: PolizaGetItem) => {
            if (calculateDaysRemaining(curr.next_payment) < 5) {
              return acc + 1;
            }
            return acc;
          }, 0),
        );

        // setPolizasInactivas(totalPolizas - polizasActivas)
      });
  }, []);

  return (
    <DashboardContainer>
      <Alert />
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
            amount={totalPolizas}
            title="Total de polizas"
            type="Default"
            filter={() => {
              fetch("http://localhost:3006/v1/scrapping/polizas/all", {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  setPolizasData(data.payload);
                });
            }}
          ></StatTag>
          {/* <StatTag
            amount={polizasActivas}
            title="Polizas activas"
            type="Success"
          ></StatTag> */}
          <StatTag
            amount={polizasActivas}
            title="Polizas activas"
            type="Success"
            filter={() => {
              fetch("http://localhost:3006/v1/scrapping/polizas/active", {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  setPolizasData(data.payload);
                });
            }}
          ></StatTag>
          <StatTag
            amount={polizasAnuladas}
            title="Polizas anuladas"
            type="Danger"
            filter={() => {
              fetch("http://localhost:3006/v1/scrapping/polizas/inactive", {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  setPolizasData(data.payload);
                });
            }}
          ></StatTag>
          <StatTag
            amount={polizasPorVencer}
            title="Polizas por vencer"
            type="Warning"
            filter={() => {
              fetch("http://localhost:3006/v1/scrapping/polizas/almost_due", {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  setPolizasData(data.payload);
                });
            }}
          ></StatTag>
        </StatContainer>

        {/* BARRA DE BUSQUEDA */}
        {/* <SearchBar /> */}

        {/* CONTENEDOR PARA LA LISTA DE POLIZAS */}
        <PolizasContainer
          data={polizasData}
          notificationsNotifier={{
            stateAction: setPolizasChanged,
            stateValue: polizasChanged,
          }}
        ></PolizasContainer>
      </DashboardBody>
      <AppliedChangesContainer>
        <AppliedChangesHeader>
          <Icon iconName="Warning" customColor="#f9e423" size={24}></Icon>
          <p>
            Se han aplicado cambios en <span>{polizasChanged.length}</span>{" "}
            clientes
          </p>
        </AppliedChangesHeader>
        <Button
          type="DefaultBlue"
          label="Aplicar cambios"
          action={() => console.log("Se han aplicado cambios")}
        ></Button>
      </AppliedChangesContainer>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 4vw;
  gap: 15px;
  /* background-color: red; */
  height: calc(100vh - 60px);
  position: relative;
`;

const AppliedChangesContainer = styled.div`
  position: absolute;
  height: fit-content;
  width: fit-content;
  bottom: 25px;
  right: 25px;
  /* background-color: red; */
  background-color: blue;
  ${FlexColumn__SC}
  ${CardComponent__SC}
  padding: 20px 20px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;

  & > *:nth-child(2) {
    /* background-color: red; */
    align-self: flex-end;
  }

  display: none;
`;

const AppliedChangesHeader = styled.div`
  ${FlexRow__SC}
  gap: 10px;
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
