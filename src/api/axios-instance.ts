import axios, { AxiosError } from 'axios';
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

export enum EAxiosErrorCode {
  ErrorNetwork = 'ERR_NETWORK',
  ErrorTimeout = 'ECONNABORTED', // Axios uses this code for request timeouts,
  ErrorCanceled = 'ERR_CANCELED'
}

export interface CustomAxiosError extends AxiosError {
  _isHandled?: boolean;
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // To send HTTP-ONLY cookies
  headers: {
    'Content-Type': 'application/json'
  }
});


export default axiosInstance;
