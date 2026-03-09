import { useState } from "react";
import type { PolizaType } from "../Types/types";

function useModalState(isModalOpen = false) {
  const [isOpen, setIsOpen] = useState<boolean>(isModalOpen);
  const [polizaData, setPolizaData] = useState<PolizaType>({} as PolizaType);

  return { isOpen, setIsOpen, polizaData, setPolizaData };
}

export default useModalState;
