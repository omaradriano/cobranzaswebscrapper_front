import React from "react";
import type { PolizaType, viewMode } from "../Types/types";
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
        <PolizaItemCustom>
          <PolizaItemHeader>
            <MayorText>{data.numPoliza}</MayorText>
            <div>
              <MinorText>Notificaciones</MinorText>
              <ScrollCheckbox noPoliza={data.numPoliza} />
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
            <MinorText>Plan:</MinorText>
            <NormalText>{data.tipoSeguro}</NormalText>
          </div>
          <PolizaItemFooter>
            <SpanCard title={data.estatus}></SpanCard>
            <Button label="Detalles" iconName="ChevronRight" />
          </PolizaItemFooter>
        </PolizaItemCustom>
      ) : (
        ""
      )}
    </>
  );
};

const PolizaItemFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 5px 0;
`;

const PolizaItemCustom = styled.div`
  display: flex;
  flex-direction: column;
  ${sectionTheme__css}
  border-radius: 8px;
  padding: 5px 10px;
  ${sectionBorderTheme__css}

  & > p {
    /* flex: 1; */
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    /* text-align: center; */
    /* height: 65px; */
    ${textTheme__css}
  }

  /*
  & > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  } */
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
