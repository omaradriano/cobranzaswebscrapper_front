import type { PreferedScheme } from "../Context/ContextConfig";
import * as MuiIcons from "@mui/icons-material";

export type PolizaType = {
  asegurado: string;
  contratante: string;
  diaCobro: number;
  estatus: StatusValues;
  fechaEmision: string;
  formaPago: string;
  medioCobro: string;
  numPoliza: string;
  plan: string;
  tipoSeguro: string;
  allownotifications: boolean;
  direccion: {
    calle: string;
    codigoPostal: string;
    ciudad: string;
    estado: string;
    colonia: string;
  };
  dueIndicator: string;
  next_payment: string;
};

export type PolizaGetItem = {
  asegurado: string;
  contratante: string;
  diaCobro: number;
  estatus: StatusValues;
  fecha_emision: string;
  forma_pago: string;
  medio_cobro: string;
  num_poliza: string;
  plan: string;
  tipo_seguro: string;
  direccion: {
    calle: string;
    codigo_postal: string;
    ciudad: string;
    estado: string;
    colonia: string;
  };
  next_payment: string;
  poliza_uuid: string;
  user_uuid: string;
  haslog: number
};

export type StatusValues = "En Vigor" | "Anulada";

export type viewMode = "Mobile" | "Desktop";

export type CardType =
  | "Default"
  | "Danger"
  | "Warning"
  | "Success"
  | "DefaultBlue";

export type FilterType =
  | "All"
  | "Active"
  | "AlreadyPay"
  | "Inactive"
  | "OverDueDate"
  | "AlmostOnDueDate";

export type MaterialIconName = keyof typeof MuiIcons;

export type Insurance = 'SM' | 'Unknown' | null

declare module "styled-components" {
  export interface DefaultTheme {
    mode: PreferedScheme;
    text: string;
    // Agrega aquí cualquier otra propiedad que hayas puesto en themeValues
  }
}
