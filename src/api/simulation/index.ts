import { useMutation } from "@tanstack/react-query";

import { simulationApi, simulationDetailApi } from "@/api/simulation/api";
import { ISimulationDetailRequest, ISimulationRequest } from "@/types/auth";

export const useSimulation = () => {
  return useMutation({
    mutationFn: (input: ISimulationRequest) => simulationApi(input),
  });
};
export const useSimulationDetail = () => {
  return useMutation({
    mutationFn: (input: ISimulationDetailRequest) => simulationDetailApi(input),
  });
};
