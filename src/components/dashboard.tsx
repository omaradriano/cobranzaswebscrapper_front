import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  AuthContext,
  ThemeContext,
  type PreferedScheme,
} from "../Context/ContextConfig";

import StatTag from "./statCard";
import PolizasContainer from "./polizasContainer";
import Button from "./button";
import Icon from "./icon";
import Alert from "./modalAlert";
import SearchBar from "./searchbar";

import {
  CardComponent__SC,
  FlexColumn__SC,
  FlexRow__SC,
  textTheme__css,
} from "../styles/CssComponents";

import type { PolizaGetItem } from "../Types/types";
import { useNavigate } from "react-router";

const Dashboard: React.FC = () => {
  const theme = useContext(ThemeContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [polizasData, setPolizasData] = useState<PolizaGetItem[]>([]);
  const [polizasChanged, setPolizasChanged] = useState<PolizaGetItem[]>([]);

  const [searchValue, setSearchValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<{
    [key: string]: string;
  }>({});

  const [detailsData, setDetailsData] = useState<{
    success: boolean;
    payload: {
      total: number;
      activas: number;
      por_vencer: number;
      inactivas: number;
      sin_pago_registrado: number;
      cobertura_activa: number;
    };
  } | null>(null);

  const [maxPages, setMaxPages] = useState(1);

  function convertFiltersToString(currentFilters: { [key: string]: string }) {
    const entries = Object.entries(currentFilters);

    if (!entries.length) return "";

    return (
      "&" +
      entries
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")
    );
  }

  async function fetchPolizas(query_params: string) {
    const session_token = localStorage.getItem("session_jwt");

    if (!session_token) {
      auth?.setIsAuthenticated(false);
      navigate("/home");
      return null;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:3006/v1/scrapping/polizas?pageSize=10&currentPage=${currentPage}${query_params}`,
        {
          headers: {
            Authorization: `Bearer ${session_token}`,
          },
        },
      );

      const data = await res.json();

      if (!data.success) return null;

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function getPolizasDetails() {
    const session_token = localStorage.getItem("session_jwt");

    if (!session_token) {
      auth?.setIsAuthenticated(false);
      navigate("/home");
      return null;
    }

    try {
      const res = await fetch("http://127.0.0.1:3006/v1/scrapping/details", {
        headers: {
          Authorization: `Bearer ${session_token}`,
        },
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const filtersString = convertFiltersToString(filters);

      const data = await fetchPolizas(filtersString);

      if (data?.payload) {
        setPolizasData(data.payload.items);

        setMaxPages(data.payload.pages || 1);
      }
    };

    loadData();
  }, [currentPage, filters]);

  useEffect(() => {
    const loadDetails = async () => {
      const data = await getPolizasDetails();

      if (data) {
        setDetailsData(data);
      }
    };

    loadDetails();
  }, []);

  return (
    <DashboardContainer>
      <Alert />

      <DashboardHeader>
        <DashboardTitle>Mis pólizas</DashboardTitle>

        <DashboardText $theme={theme?.theme as PreferedScheme}>
          Gestiona tus recordatorios de corte de pólizas.
        </DashboardText>
      </DashboardHeader>

      <DashboardBody>
        <StatContainer>
          <StatTag
            amount={detailsData?.payload.total ?? 0}
            title="Total"
            type="Default"
            filter={() => {
              setFilters({});
              setCurrentPage(1);
              setSearchValue("");
            }}
          />

          <StatTag
            amount={detailsData?.payload.activas ?? 0}
            title="Activas"
            type="Success"
            filter={() => {
              setFilters({
                estatus: "En Vigor",
              });

              setCurrentPage(1);
              setSearchValue("");
            }}
          />

          <StatTag
            amount={detailsData?.payload.inactivas ?? 0}
            title="Anuladas"
            type="Danger"
            filter={() => {
              setFilters({
                estatus: "Anulada",
              });

              setCurrentPage(1);
              setSearchValue("");
            }}
          />

          <StatTag
            amount={detailsData?.payload.por_vencer ?? 0}
            title="Por vencer o fecha superada"
            type="Warning"
            filter={() => {
              setFilters({
                next_due: "true",
              });

              setCurrentPage(1);
              setSearchValue("");
            }}
          />
        </StatContainer>

        <SearchBar
          stateValue={filters}
          stateChangeValue={setFilters}
          setCurrentPage={setCurrentPage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        <PaginationRow>
          <Icon
            iconName="KeyboardArrowLeft"
            isButton
            customColor="#000"
            size={24}
            action={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
          />

          <PageIndicator>
            Página {currentPage} de {maxPages}
          </PageIndicator>

          <Icon
            iconName="KeyboardArrowRight"
            isButton
            customColor="#000"
            size={24}
            action={() => {
              setCurrentPage((prev) => Math.min(prev + 1, maxPages));
            }}
          />
        </PaginationRow>

        <PolizasContainer
          data={polizasData}
          notificationsNotifier={{
            stateAction: setPolizasChanged,
            stateValue: polizasChanged,
          }}
        />
      </DashboardBody>

      <AppliedChangesContainer $visible={polizasChanged.length > 0}>
        <AppliedChangesHeader>
          <Icon iconName="Warning" customColor="#f9e423" size={24} />

          <p>
            Se han aplicado cambios en <span>{polizasChanged.length}</span>
          </p>
        </AppliedChangesHeader>

        <Button
          type="DefaultBlue"
          label="Aplicar cambios"
          action={() => console.log("Aplicando")}
        />
      </AppliedChangesContainer>
    </DashboardContainer>
  );
};

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PageIndicator = styled.span`
  font-weight: 500;
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 4vw;
  gap: 15px;
  height: calc(100vh - 60px);
  position: relative;
`;

const AppliedChangesContainer = styled.div<{
  $visible: boolean;
}>`
  position: absolute;
  bottom: 25px;
  right: 25px;

  ${FlexColumn__SC}
  ${CardComponent__SC}

display:${(p) => (p.$visible ? "flex" : "none")};

  padding: 20px;
  gap: 10px;
`;

const AppliedChangesHeader = styled.div`
  ${FlexRow__SC}
  gap:10px;
`;

const DashboardHeader = styled.div``;

const DashboardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StatContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const DashboardTitle = styled.h1`
  ${textTheme__css}
`;

const DashboardText = styled.p<{
  $theme: PreferedScheme;
}>`
  color: ${(p) => (p.$theme === "Dark" ? "#999" : "#000")};
`;
export {
  DashboardHeader, DashboardTitle, DashboardText, DashboardContainer
}
export default Dashboard;
