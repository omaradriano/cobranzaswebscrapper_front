import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  AuthContext,
  DataChangedContext,
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
  const dataChanged = useContext(DataChangedContext);
  const navigate = useNavigate();

  const [polizasData, setPolizasData] = useState<PolizaGetItem[]>([]);
  const [polizasChanged, setPolizasChanged] = useState<PolizaGetItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [maxPages, setMaxPages] = useState(1);

  const [showAnuladasFilter, setAnuladasFilter] = useState(false);
  const [showAnuladasCheckbox, setShowAnuladasCheckbox] = useState(true);

  const [detailsData, setDetailsData] = useState<{
    total: number;
    activas: number;
    por_vencer: number;
    inactivas: number;
    sin_pago_registrado: number;
    cobertura_activa: number;
  }>({
    total: 0,
    activas: 0,
    por_vencer: 0,
    inactivas: 0,
    sin_pago_registrado: 0,
    cobertura_activa: 0,
  });

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
        `${import.meta.env.VITE_API_SERVER_URL}/v1/scrapping/polizas?pageSize=20&currentPage=${currentPage}${query_params}`,
        { headers: { Authorization: `Bearer ${session_token}` } },
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
      const res = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/v1/scrapping/details`,
        {
          headers: { Authorization: `Bearer ${session_token}` },
        },
      );
      const data = await res.json();

      if (data && data.success && data.payload) {
        return data.payload;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const filtersString = convertFiltersToString({
        ...filters,
        show_anuladas: showAnuladasFilter ? "true" : "false",
      });
      const data = await fetchPolizas(filtersString);
      if (data?.payload) {
        setPolizasData(data.payload.items);
        setMaxPages(data.payload.pages || 1);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, showAnuladasFilter, dataChanged?.dataHasChanged]);

  useEffect(() => {
    const loadDetails = async () => {
      const payload = await getPolizasDetails();
      if (payload) {
        setDetailsData(payload);
      }
    };
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataChanged?.dataHasChanged]);

  // 💡 FUNCIÓN AGREGADA: Maneja el cambio de estado nativo del input de forma segura
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnuladasFilter(e.target.checked);
    setCurrentPage(1); 
  };

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
            amount={detailsData.total}
            title="Total"
            type="Default"
            filter={() => {
              setFilters({});
              setCurrentPage(1);
              setSearchValue("");
              setAnuladasFilter(false);
              setShowAnuladasCheckbox(true)
            }}
          />

          <StatTag
            amount={detailsData.activas}
            title="Activas"
            type="Success"
            filter={() => {
              setCurrentPage(1);
              setFilters({ estatus: "En Vigor" });
              setSearchValue("");
              setShowAnuladasCheckbox(false);
            }}
          />

          <StatTag
            amount={detailsData.inactivas}
            title="Anuladas"
            type="Danger"
            filter={() => {
              setCurrentPage(1);
              setFilters({ estatus: "Anulada" });
              setSearchValue("");
              setAnuladasFilter(false);
              setShowAnuladasCheckbox(false);
            }}
          />

          <StatTag
            amount={detailsData.por_vencer}
            title="Por vencer o fecha superada"
            type="Warning"
            filter={() => {
              setCurrentPage(1);
              setFilters({ next_due: "true" });
              setSearchValue("");
              setAnuladasFilter(false)
              setShowAnuladasCheckbox(true);
            }}
          />
        </StatContainer>

        <MoreFiltersSection>
          <SearchBar
            stateValue={filters}
            stateChangeValue={setFilters}
            setCurrentPage={setCurrentPage}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />

          {/* 💡 ACTUALIZADO: Componente conectado con estados y propiedades correspondientes */}
          {showAnuladasCheckbox ? (
            <FilterAnuladas htmlFor="hideCanceled">
              <input
                type="checkbox"
                id="hideCanceled"
                checked={showAnuladasFilter}
                onChange={handleCheckboxChange}
              />
              <span />
              Ocultar anuladas
            </FilterAnuladas>
          ) : null}
        </MoreFiltersSection>

        <PaginationRow>
          <Icon
            iconName="KeyboardArrowLeft"
            isButton
            customColor="#000"
            size={24}
            action={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />

          <PageIndicator>
            Página {currentPage} de {maxPages}
          </PageIndicator>

          <Icon
            iconName="KeyboardArrowRight"
            isButton
            customColor="#000"
            size={24}
            action={() =>
              setCurrentPage((prev) => Math.min(prev + 1, maxPages))
            }
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

const AppliedChangesContainer = styled.div<{ $visible: boolean }>`
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

const MoreFiltersSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// 💡 CORRECCIÓN COMPLETA DE ESTILOS: Asegura centrado perfecto Flexbox y proporciones estables en 28px
const FilterAnuladas = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-family: sans-serif;
  color: #333333;

  & > input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  & > span {
    display: flex; /* Flexbox para centrar matemáticamente la palomita */
    align-items: center;
    justify-content: center;

    width: 28px;
    height: 28px;
    border: 2px solid #b3b3b3;
    border-radius: 6px;
    background: white;
    transition: all 0.2s ease-in-out;
    flex-shrink: 0;
    box-sizing: border-box;

    &::after {
      content: "";
      width: 6px;
      height: 12px;
      border: solid white;
      border-width: 0 3px 3px 0; /* Grosor ideal de 3px para balance visual */
      transform: rotate(45deg) translateY(-1px);
      opacity: 0;
      transition: opacity 0.15s ease-in-out;
    }
  }

  &:hover > input ~ span {
    border-color: #4b7bec;
  }

  & > input:checked ~ span {
    background-color: #4b7bec;
    border-color: #4b7bec;
  }

  & > input:checked ~ span::after {
    opacity: 1; /* Hace visible la palomita */
  }

  & > input:focus-visible ~ span {
    box-shadow: 0 0 0 3px rgba(75, 123, 236, 0.25);
  }
`;

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

const DashboardText = styled.p<{ $theme: PreferedScheme }>`
  color: ${(p) => (p.$theme === "Dark" ? "#999" : "#000")};
`;

export { DashboardHeader, DashboardTitle, DashboardText, DashboardContainer };
export default Dashboard;
