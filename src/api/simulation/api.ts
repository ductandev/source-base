import axiosInstance from "@/api/axios-instance";
import {
  ISimulationDetailRequest,
  ISimulationRequest,
  ISimulatioResponse,
} from "../../types/auth";

const BASE_API = "/api/simulations";

export const simulationApi = async (
  input: ISimulationRequest,
): Promise<ISimulatioResponse> => {
  return await axiosInstance.post(`${BASE_API}/run`, input);
};

export const simulationDetailApi = async (
  scenarioId: ISimulationDetailRequest,
): Promise<ISimulatioResponse> => {
  return await axiosInstance.get(
    `${BASE_API}/${encodeURIComponent(String(scenarioId.scenarioId))}`,
  );
};
