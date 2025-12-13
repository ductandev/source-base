import axiosInstance from "@/api/axios-instance";
import { ISimulationRequest, ISimulatioResponse } from "../../types/auth";

const BASE_API = "/api/simulations";

export const simulationApi = async (
  input: ISimulationRequest,
): Promise<ISimulatioResponse> => {
  return await axiosInstance.post(`${BASE_API}/run`, input);
};