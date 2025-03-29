import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import api from '../lib/api';
import { loginSchema, registerSchema } from '../lib/validations/auth';

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      try {
        const response = await api.post('/auth', {
          email: data.email,
          password: data.password,
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}