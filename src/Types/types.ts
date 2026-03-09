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
};

export type StatusValues = "En Vigor" | "Anulada";

export type viewMode = "Mobile" | "Desktop";

export type CardType = "Default" | "Danger" | "Warning" | "Success" | "DefaultBlue";

export type MaterialIconName = keyof typeof MuiIcons;

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: PreferedScheme;
    text: string;
    // Agrega aquí cualquier otra propiedad que hayas puesto en themeValues
  }
}
