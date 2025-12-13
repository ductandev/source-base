import { useMutation } from '@tanstack/react-query';

import { authLoginApi } from './api';
import { ILoginRequest } from '@/types/auth';


export const useLogin = () => {
  return useMutation({
    mutationFn: (input: ILoginRequest) => authLoginApi(input)
  });
};

