import React from "react";
import type { PolizaType, StatusValues, viewMode } from "../Types/types";
import styled from "styled-components";
import ScrollCheckbox from "./checkboxscroll";
import {
  MayorText,
  MinorText,
  NormalText,
  sectionBorderTheme__css,
  sectionTheme__css,
  textTheme__css,
} from "../styles/CssComponents";
import Button from "./button";
import SpanCard from "./spanCard";

export interface PolizaItemProps {
  data: PolizaType;
  viewMode?: viewMode;
}

const PolizaItem: React.FC<PolizaItemProps> = ({
  data,
  viewMode = "Mobile",
}) => {
  return (
    <>
      {viewMode === "Mobile" ? (
        <PolizaItemCustom $viewMode={viewMode}>
          <PolizaItemHeader>
            <MayorText>{data.numPoliza}</MayorText>
            <div>
              <MinorText>Notificaciones</MinorText>
              <ScrollCheckbox />
            </div>
          </PolizaItemHeader>
          <div>
            <MinorText>Contratante:</MinorText>
            <NormalText>{data.contratante}</NormalText>
          </div>
          <div>
            <MinorText>Asegurado:</MinorText>
            <NormalText>{data.asegurado}</NormalText>
          </div>
          <div>
            <MinorText>Producto:</MinorText>
            <NormalText>{data.tipoSeguro}</NormalText>
          </div>
          <PolizaItemFooter>
            <SpanCard title={data.estatus}></SpanCard>
            <Button label="Detalles" iconName="ChevronRight" />
          </PolizaItemFooter>
        </PolizaItemCustom>
      ) : (
        <PolizaItemCustom $viewMode={viewMode}>
          <p>{data.numPoliza}</p>
          <p>{data.contratante}</p>
          <p>{data.asegurado}</p>
          <p>{data.tipoSeguro}</p>
          <div>
            <SpanCard title={data.estatus as StatusValues} />
          </div>
          <NotificationDiv>
            <p>Dias para corte: 10</p>
            <ScrollCheckbox />
          </NotificationDiv>
          <div>
            <Button label="Detalle" iconName="ChevronRight" />
          </div>
        </PolizaItemCustom>
      )}
    </>
  );
};

const NotificationDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;

  ${textTheme__css}
`;

const PolizaItemFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 5px 0;
`;

const PolizaItemCustom = styled.div<{ $viewMode: viewMode }>`
  display: flex;
  flex-direction: ${(p) => (p.$viewMode === "Mobile" ? "column" : "row")};
  align-items: ${(p) => (p.$viewMode === "Mobile" ? "" : "center")};
  text-align: ${(p) => (p.$viewMode === "Mobile" ? "" : "center")};
  ${sectionTheme__css}
  border-radius: 8px;
  padding: 5px 10px;
  ${sectionBorderTheme__css}

  & > p {
    flex: ${(p) => (p.$viewMode === "Mobile" ? "" : "1")};
    ${textTheme__css}
  }

  & > div {
    ${(p) =>
      p.$viewMode === "Desktop"
        ? `
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
          `
        : ``}
  }
`;

const PolizaItemHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  /* background-color: purple; */

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }
`;

export default PolizaItem;
