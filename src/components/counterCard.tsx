import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  ButtonConf__SC,
  CardComponent__SC,
  textTheme__css,
} from "../styles/CssComponents";
import type { CardType } from "../Types/types";
import Icon from "./icon";
import {
  AlertContext,
  AuthContext,
  DataChangedContext,
} from "../Context/ContextConfig";

export interface SpanCardProps {
  label?: string;
  count: number | string;
  includePayment?: boolean;
  paymentdata: {
    poliza: string;
    paid_period: string;
    num_poliza: string;
  };
}

function DefineCounterColor(count: number | string, limit: number): CardType {
  if (typeof count === "string") return "Default";
  if (count <= limit && count > 0) {
    return "Warning";
  } else if (count <= 0) {
    return "Danger";
  }
  return "Success";
}

const CounterCard: React.FC<SpanCardProps> = ({
  label,
  count,
  paymentdata,
  includePayment = false,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const alertContext = useContext(AlertContext);
  const auth = useContext(AuthContext);

  const dataChanged = useContext(DataChangedContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log(containerRef);
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <CounterCardCustom
      ref={containerRef}
      $type={!includePayment ? "Default" : DefineCounterColor(count, 5)}
      onClick={() => {
        setShowOptions(true);
      }}
    >
      {!includePayment ? (
        <NoRegisterPaymentLabel>
          <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {label ?? ""} {label ? ":" : ""}{" "}
            <span style={{ fontSize: "22px", width: "max-content" }}>
              {count}
            </span>
            <Icon
              iconName="Warning"
              size={24}
              isButton={true}
              customColor="#fb8d0f"
            ></Icon>
          </p>
          {/* <p>Este registro no tiene pago registrado previo</p> */}
        </NoRegisterPaymentLabel>
      ) : (
        <p>
          {label ?? ""} {label ? ":" : ""} <span>{count}</span>
          <Icon iconName="MoreHoriz" size={24} isButton></Icon>
        </p>
      )}

      <CounterCardOptions $isVisible={showOptions}>
        <CounterCardOption
          onClick={async () => {
            const options = {
              method: "PATCH",
              body: JSON.stringify({
                poliza: paymentdata.poliza,
                paid_period: paymentdata.paid_period,
              }),
              headers: {
                Authorization: `Bearer ${localStorage.getItem("session_jwt")}`,
              },
            };

            console.log({
              poliza: paymentdata.poliza,
              paid_period: paymentdata.paid_period,
              agente: auth?.session?.agente_uuid,
            });

            // return

            alertContext?.setAlertOptions({
              title: "Confirmación de pago",
              message: `Desea confirmar pago para la poliza ${paymentdata.num_poliza}`,
              type: "success",
              onConfirm: async () => {
                try {
                  //Aqui se hace la peticion para verificar confirmacion de pago
                  const response = await fetch(
                    `${import.meta.env.VITE_API_SERVER_URL}/v1/payments/poliza`,
                    options,
                  );
                  const res = await response.json();
                  if (res.code !== 202) {
                    throw new Error(res.message);
                  }
                  dataChanged?.setDataHasChanged((prev) => prev + 1);
                  alertContext.setAlertOptions({
                    message: "Se ha completado el pago",
                    title: "Pago confirmado",
                    type: "success",
                    onConfirm: () => {
                      alertContext.setShowAlert(false);
                    },
                  });
                  alertContext.setShowAlert(true);
                } catch (error) {
                  //Aqui se define el mensaje de un alert
                  const errorMessage =
                    error instanceof Error
                      ? error.message
                      : "Error desconocido";
                  alertContext?.setAlertOptions({
                    title: "Confirmación de pago",
                    message: errorMessage,
                    type: "error",
                  });
                  alertContext.setShowAlert(true);
                }
              },
            });
            alertContext?.setShowAlert(true);
          }}
        >
          Marcar como pagado <Icon iconName="Check" size={24}></Icon>
        </CounterCardOption>
      </CounterCardOptions>
    </CounterCardCustom>
  );
};

const CounterCardOption = styled.p`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 8px;

  &:hover {
    background-color: green;
  }
`;

const CounterCardOptions = styled.div<{ $isVisible: boolean }>`
  display: ${(p) => (p.$isVisible ? "flex" : "none")};
  position: absolute;
  right: 50%;
  top: 40px;
  /* transform: translate(50%, 0); */
  ${CardComponent__SC}
  padding: 5px 5px;
  height: fit-content;
  width: max-content;

  & > span:hover {
    background-color: white;
  }
  transform: translateX(50%);
`;

const CounterCardCustom = styled.div<{ $type: CardType }>`
  display: none;
  position: relative;
  flex-direction: row;
  align-items: center;
  height: fit-content;
  justify-content: center;
  border-radius: 6px;
  padding: 5px 10px;
  width: fit-content;
  min-width: 75px;
  ${ButtonConf__SC}
  opacity: 0.8;
  cursor: pointer;

  ${textTheme__css}

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

  & > p {
    display: flex;
    align-items: center;
    font-size: clamp(14px, 1.5vw, 1rem);
    height: 24px;
    gap: 5px;

    & > span {
      font-size: 22px;
    }
  }
`;

const NoRegisterPaymentLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${textTheme__css}
  font-size: clamp(14px, 1.5vw, 1rem);
  color: #000000b0;
`;

export default CounterCard;
