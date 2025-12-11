import { IResponseApi } from '@/types/common';
import { ROUTES } from '../routes';

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

export const fetchInstance = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include', // Include HTTP-only cookies
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = ROUTES.LOGIN; // Redirect on authorized errors
    }
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const data: IResponseApi<T> = await response.json();

  if (data.hasErrors) {
    throw new Error(data.errors.join(', '));
  }

  return data.content;
};
