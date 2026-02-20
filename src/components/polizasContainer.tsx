import React, { useEffect, useState } from "react";
import type { PolizaType } from "../Types/types";
import styled from "styled-components";
import { PolizasNoItems } from "./NoFunctional";
import Icon from "./icon";
import PolizaItem from "./polizaItem";
import { headerTheme, textTheme__css } from "../styles/CssComponents";

export interface PolizasContainerProps {
  data: PolizaType[];
}

const PolizasContainer: React.FC<PolizasContainerProps> = ({ data }) => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches,
  );

  useEffect(() => {
    const watcher = window.matchMedia("(max-width: 768px)");
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    watcher.addEventListener("change", listener);
    return () => watcher.removeEventListener("change", listener);
  }, []);

  return (
    <PolizasContainerCustom>
      {data.length === 0 ? (
        <PolizasNoItems>
          <Icon iconName="ErrorOutline" size={60} />
          <h3>Sin pólizas</h3>
          <p>Comienza por importar tus polizas desde la herramienta</p>
        </PolizasNoItems>
      ) : (
        <PolizasItems>
          {!isMobile ? (
            <PolizasItemsHeader>
              <p>No. Poliza</p>
              <p>Contratante</p>
              <p>Asegurado principal</p>
              <p>Producto</p>
              <p>Estatus</p>
              <p>Notificaciones</p>
              <p></p>
            </PolizasItemsHeader>
          ) : null}
          {data.map((elem) => (
            <PolizaItem
              viewMode={isMobile ? "Mobile" : "Desktop"}
              key={elem.numPoliza}
              data={elem}
            ></PolizaItem>
          ))}
        </PolizasItems>
      )}
    </PolizasContainerCustom>
  );
};

const PolizasItems = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PolizasItemsHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  /* background-color: white; */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  & p {
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    ${textTheme__css}
  }
  & p:nth-child(2n) {
    /* background-color: gray; */
  }
`;

const PolizasContainerCustom = styled.div`
  /* min-height: 400px; */
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  /* ${headerTheme} */
  border-radius: 8px;
  /* padding: 40px 10px; */
  /* align-items: center; */
  /* border: 1px solid #ababab1f; */
`;

export default PolizasContainer;
