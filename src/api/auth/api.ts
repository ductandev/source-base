import axiosInstance from "@/api/axios-instance";
import { ILoginRequest, ILoginResponse } from "../../types/auth";

const BASE_API = "/api/auth";

export const authLoginApi = async (
  input: ILoginRequest,
): Promise<ILoginResponse> => {
  return await axiosInstance.post(`${BASE_API}/login`, input);
};
