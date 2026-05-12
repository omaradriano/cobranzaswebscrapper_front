import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  ButtonConf__SC,
  CardComponent__SC,
  textTheme__css,
} from "../styles/CssComponents";
import type { CardType } from "../Types/types";
import Icon from "./icon";
import { AlertContext } from "../Context/ContextConfig";

export interface SpanCardProps {
  label?: string;
  count: number | string;
  paymentdata: {
    poliza: string;
    paid_period: string;
    asegurador: string;
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
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const alertContext = useContext(AlertContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
      $type={DefineCounterColor(count, 5)}
      onClick={() => {
        setShowOptions(true);
      }}
    >
      <p>
        {label ?? ""} {label ? ":" : ""} <span>{count}</span>
        <Icon iconName="MoreHoriz" size={24} isButton></Icon>
      </p>
      <CounterCardOptions $isVisible={showOptions}>
        <CounterCardOption
          onClick={async () => {
            const options = {
              method: "PATCH",
              body: JSON.stringify({
                poliza: paymentdata.poliza,
                paid_period: paymentdata.paid_period,
                asegurador: paymentdata.asegurador,
              }),
            };

            alertContext?.setAlertOptions({
              title: "Confirmación de pago",
              message: `Desea confirmar pago para la poliza ${paymentdata.num_poliza}`,
              type: "success",
              onConfirm: async () => {
                try {
                  //Aqui se hace la peticion para verificar confirmacion de pago
                  const response = await fetch(
                    "http://localhost:3006/v1/cobranzaItemPayment",
                    options,
                  );
                  const res = await response.json();
                  if (res.code !== 202) {
                    throw new Error(res.message);
                  }
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
  top: -46px;
  transform: translate(50%, 0);
  ${CardComponent__SC}
  padding: 5px 5px;
  height: fit-content;
  width: max-content;

  & > span:hover {
    background-color: white;
  }
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

export default CounterCard;
