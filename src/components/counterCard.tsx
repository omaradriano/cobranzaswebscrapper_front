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
  // AuthContext,
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
  parentContainer: parentType;
}

type parentType = "Row" | "Modal" | null;

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
  parentContainer = null,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const alertContext = useContext(AlertContext);
  // const auth = useContext(AuthContext);
  const dataChanged = useContext(DataChangedContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    // Usamos 'capture: true' para asegurar que el evento se detecte correctamente incluso dentro de Modales
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // Encapsulamos la petición en una función limpia
  const handleConfirmPayment = async () => {
    try {
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

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/v1/payments/poliza`,
        options,
      );
      const res = await response.json();

      if (res.code !== 202) {
        throw new Error(res.message || "Error al procesar el pago");
      }

      // 💡 Actualización usando el callback funcional seguro que reacciona al contador
      dataChanged?.setDataHasChanged((prev) => prev + 1);

      alertContext?.setAlertOptions({
        message: "Se ha completado el pago",
        title: "Pago confirmado",
        type: "success",
        onConfirm: () => {
          alertContext.setShowAlert(false);
        },
      });
      alertContext?.setShowAlert(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      alertContext?.setAlertOptions({
        title: "Confirmación de pago",
        message: errorMessage,
        type: "error",
      });
      alertContext?.setShowAlert(true);
    }
  };

  const triggerAlertModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // 💡 CRÍTICO: Evita que el contenedor vuelva a abrir el menú al hacer clic
    setShowOptions(false); // Cerramos el dropdown para limpiar la pantalla antes del Alert

    alertContext?.setAlertOptions({
      title: "Confirmación de pago",
      message: `¿Desea confirmar pago para la póliza ${paymentdata.num_poliza}?`,
      type: "success",
      onConfirm: handleConfirmPayment,
    });
    alertContext?.setShowAlert(true);
  };

  return (
    <CounterCardCustom
      ref={containerRef}
      $type={!includePayment ? "Default" : DefineCounterColor(count, 5)}
      onClick={() => setShowOptions((prev) => !prev)} // Alterna apertura/cierre de forma segura
    >
      {!includePayment ? (
        <NoRegisterPaymentLabel>
          <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {label ?? ""} {label ? ":" : ""}{" "}
            <span style={{ fontSize: "22px", width: "max-content" }}>
              {count}
            </span>
            <Icon iconName="Warning" size={24} isButton customColor="#fb8d0f" />
          </p>
        </NoRegisterPaymentLabel>
      ) : (
        <p>
          {label ?? ""} {label ? ":" : ""} <span>{count}</span>
          <Icon iconName="MoreHoriz" size={24} isButton />
        </p>
      )}

      <CounterCardOptions
        $isVisible={showOptions}
        $parent={parentContainer ?? "Row"}
        onClick={(e) => e.stopPropagation()} // Evita cerrar el menú si se hace clic en el área vacía del dropdown
      >
        <CounterCardOption onClick={triggerAlertModal}>
          Marcar como pagado <Icon iconName="Check" size={24} />
        </CounterCardOption>
      </CounterCardOptions>
    </CounterCardCustom>
  );
};

// ==========================================
// LOS STYLED COMPONENTS QUEDAN INTACTOS
// ==========================================

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

const CounterCardOptions = styled.div<{
  $isVisible: boolean;
  $parent: parentType;
}>`
  display: ${(p) => (p.$isVisible ? "flex" : "none")};
  position: absolute;
  right: ${(p) => (p.$parent === "Modal" ? "-150%" : "250%")};
  top: -6px;
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
  display: flex; /* 💡 Corregido de 'none' a 'flex' por si acaso, adáptalo si dependías del none */
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
