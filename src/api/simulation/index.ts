import { useMutation } from "@tanstack/react-query";

import { simulationApi } from "./api";
import { ISimulationRequest } from "@/types/auth";

export const useSimulation = () => {
  return useMutation({
    mutationFn: (input: ISimulationRequest) => simulationApi(input),
  });
};
