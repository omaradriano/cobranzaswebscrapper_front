import { createPortal } from "react-dom";
import styled from "styled-components";
import Icon from "./icon";
import { sectionTheme__css, textTheme__css } from "../styles/CssComponents";
import Button from "./button";
import type { PolizaType } from "../Types/types";
import ScrollCheckbox from "./checkboxscroll";

export interface ModalProps {
  onClose?: () => void;
  children?: React.ReactNode;
  title: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  polizaData: PolizaType;
}

const Modal: React.FC<ModalProps> = ({
  title = "Ejemplo Modal",
  modalOpen = false,
  setModalOpen,
  polizaData,
}) => {
  console.log(polizaData);

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
                    console.log("Click a cerrar");
                    setModalOpen(false);
                  }}
                ></Icon>
              </ModalHeader>
              <ModalBody>
                <BodyRow>
                  <p>No. de poliza:</p>
                  <p>{polizaData.numPoliza}</p>
                </BodyRow>
                <BodyRow>
                  <p>Asegurado:</p>
                  <p>{polizaData.asegurado}</p>
                </BodyRow>
                <BodyRow>
                  <p>Contratante:</p>
                  <p>{polizaData.contratante}</p>
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
                  <p>{polizaData.fechaEmision}</p>
                </BodyRow>
                <BodyRow>
                  <p>Forma de pago:</p>
                  <p>{polizaData.formaPago}</p>
                </BodyRow>
                <BodyRow>
                  <p>Plan:</p>
                  <p>{polizaData.plan}</p>
                </BodyRow>
                <BodyRow>
                  <p>Notificaciones</p>
                  <ScrollCheckbox />
                </BodyRow>
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
    /* width: clamp(100px, 50%, 300px); */
    ${textTheme__css}
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
