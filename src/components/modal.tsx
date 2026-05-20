import { createPortal } from "react-dom";
import styled from "styled-components";
import Icon from "./icon";
import { sectionTheme__css, textTheme__css } from "../styles/CssComponents";
import Button from "./button";
import type { PolizaGetItem } from "../Types/types";
import CounterCard from "./counterCard";
import {
  calculateDaysUntilLimit,
  formatDate,
} from "../functions/globalFunctions";
// import ScrollCheckbox from "./checkboxscroll";

export interface ModalProps {
  onClose?: () => void;
  children?: React.ReactNode;
  title: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  polizaData: PolizaGetItem;
}

const Modal: React.FC<ModalProps> = ({
  title = "Ejemplo Modal",
  modalOpen = false,
  setModalOpen,
  polizaData,
}) => {

  return (
    <>
      {modalOpen &&
        createPortal(
          <ModalShadow>
            <ModalContent>
              <ModalHeader>
                <h3>{title}</h3>
                <Icon
                  iconName="Clear"
                  size={24}
                  isButton={true}
                  action={() => {
                    setModalOpen(false);
                  }}
                ></Icon>
              </ModalHeader>
              <ModalBody>
                <BodyRow>
                  <p>No. de poliza:</p>
                  <p>{polizaData.num_poliza}</p>
                </BodyRow>
                <BodyRow>
                  <p>Día de cobro:</p>
                  <p>{polizaData.diaCobro}</p>
                </BodyRow>
                <BodyRow>
                  <p>Estatus:</p>
                  <p>{polizaData.estatus}</p>
                </BodyRow>
                <BodyRow>
                  <p>Fecha de emisión:</p>
                  <p>{formatDate(polizaData.fecha_emision)}</p>
                </BodyRow>
                <BodyRow>
                  <p>Forma de pago:</p>
                  <p>{polizaData.forma_pago}</p>
                </BodyRow>
                <BodyRow>
                  <p>Medio de cobro:</p>
                  <p>{polizaData.medio_cobro}</p>
                </BodyRow>
                <BodyRow>
                  <p>Plan:</p>
                  <p>{polizaData.plan}</p>
                </BodyRow>
                <BodyRow>
                  <p>Siguiente pago:</p>
                  <p>{formatDate(polizaData.next_payment)}</p>
                </BodyRow>
                <BodyRow>
                  <p>Direccion:</p>
                  <p>
                    Calle y numero: {polizaData.direccion.calle} | Colonia:{" "}
                    {polizaData.direccion.colonia} | Estado y ciudad:{" "}
                    {polizaData.direccion.estado}, {polizaData.direccion.ciudad}
                    . Codigo Postal: {polizaData.direccion.codigoPostal}
                  </p>
                </BodyRow>
                <BodyRow>
                  <p>Días para corte:</p>
                  <div>
                    <CounterCard
                      count={calculateDaysUntilLimit(polizaData.next_payment)}
                      paymentdata={{
                        asegurador: polizaData.agente_uuid,
                        poliza: polizaData.poliza_uuid,
                        paid_period: polizaData.next_payment,
                        num_poliza: polizaData.num_poliza
                      }}
                    ></CounterCard>
                  </div>
                </BodyRow>
                {/* <BodyRow>
                  <p>Notificaciones</p>
                  <ScrollCheckbox active={polizaData.allownotifications}/>
                </BodyRow> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  action={() => setModalOpen(false)}
                  label="Cerrar"
                ></Button>
              </ModalFooter>
            </ModalContent>
          </ModalShadow>,
          document.body,
        )}
    </>
  );
};

const BodyRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* background-color: red; */
  padding: 5px 0;

  & > p {
    display: flex;
    width: 100%;
    ${textTheme__css}
  }

  & > div {
    display: flex;
    width: 100%;
  }

  & > p:nth-child(1) {
    color: #7c7c7cc4;
    width: clamp(100px, 35%, 300px);
  }
`;

const ModalShadow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #04040454;
  height: 100%;
  width: 100%;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;

  height: fit-content;
  border-radius: 6px;
  overflow: hidden;
  width: clamp(300px, 90%, 600px);
  background-color: red;
  padding: 0 10px;
  ${sectionTheme__css}
`;

const ModalHeader = styled.div`
  height: 45px;
  width: 100%;
  /* padding: 10px; */
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  /* background-color: gray; */
  border-bottom: 1px solid #ffffff1a;
  ${textTheme__css}
`;

const ModalBody = styled.div`
  height: fit-content;
  width: 100%;
  padding: 10px 0;
  /* background-color: white; */
`;

const ModalFooter = styled.div`
  border-top: 1px solid #ffffff1a;
  padding: 10px 0;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  /* background-color: white; */
`;

export default Modal;
