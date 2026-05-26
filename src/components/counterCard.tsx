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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cardType = DefineCounterColor(count, 5);

  return (
    <CounterCardWrapper ref={containerRef}>
      <CounterCardCustom
        $type={cardType}
        onClick={() => setShowOptions((prev) => !prev)}
        $clickable={true}
      >
        <PaymentRow>
          <CountBadge $type={cardType}>
            {label && <CountLabel>{label}</CountLabel>}
            <CountNumber $type={cardType}>{count}</CountNumber>
          </CountBadge>
          <DaysLabel>días</DaysLabel>
          {!includePayment && (
            <Icon
              iconName="Warning"
              size={16}
              isButton={false}
              customColor="#fb8d0f"
            />
          )}
          <Icon iconName="MoreVert" size={18} isButton={false} />
        </PaymentRow>
      </CounterCardCustom>

      {showOptions && (
        <CounterCardOptions>
          <CounterCardOption
            onClick={async () => {
              setShowOptions(false);
              alertContext?.setAlertOptions({
                title: "Confirmación de pago",
                message: `Desea confirmar pago para la poliza ${paymentdata.num_poliza}`,
                type: "success",
                onConfirm: async () => {
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
            <Icon iconName="Check" size={16} />
            <span>Marcar como pagado</span>
          </CounterCardOption>
        </CounterCardOptions>
      )}
    </CounterCardWrapper>
  );
};

/* ─── Wrapper ──────────────────────────────────────────────────── */
const CounterCardWrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

/* ─── Main card ────────────────────────────────────────────────── */
const CounterCardCustom = styled.div<{ $type: CardType; $clickable: boolean }>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  ${textTheme__css}
  background-color: ${(p) =>
    p.$type === "Success"
      ? "rgba(34,197,94,0.12)"
      : p.$type === "Warning"
        ? "rgba(251,141,15,0.12)"
        : p.$type === "Danger"
          ? "rgba(239,68,68,0.12)"
          : p.theme.mode === "Dark"
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.04)"};
  border: 1px solid
    ${(p) =>
      p.$type === "Success"
        ? "rgba(34,197,94,0.3)"
        : p.$type === "Warning"
          ? "rgba(251,141,15,0.3)"
          : p.$type === "Danger"
            ? "rgba(239,68,68,0.3)"
            : p.theme.mode === "Dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)"};
  transition: opacity 0.15s;

  &:hover {
    opacity: ${(p) => (p.$clickable ? "0.85" : "1")};
  }
`;

/* ─── Row layouts ──────────────────────────────────────────────── */
const PaymentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

/* ─── Count badge ──────────────────────────────────────────────── */
const CountBadge = styled.div<{ $type: CardType }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`;

const CountLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8a8a8a;
  line-height: 1;
`;

const CountNumber = styled.span<{ $type: CardType }>`
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: ${(p) =>
    p.$type === "Success"
      ? "#16a34a"
      : p.$type === "Warning"
        ? "#d97706"
        : p.$type === "Danger"
          ? "#dc2626"
          : p.theme.mode === "Dark"
            ? "#fff"
            : "#111"};
`;

const DaysLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #8a8a8a;
  align-self: flex-end;
  margin-bottom: 4px;
`;

/* ─── Options dropdown ─────────────────────────────────────────── */
const CounterCardOptions = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 200;
  ${CardComponent__SC}
  padding: 6px;
  min-width: 190px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  animation: fadeIn 0.12s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CounterCardOption = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  ${textTheme__css}
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  transition: background 0.12s;

  &:hover {
    background-color: rgba(34, 197, 94, 0.12);
    color: #16a34a;
  }
`;

export default CounterCard;
