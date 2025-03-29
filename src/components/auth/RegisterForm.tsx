import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerSchema } from '../../lib/validations/auth';
import { useRegister } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error: any) {
      if (error.response?.data?.message === 'Email already exists') {
        setError('email', {
          type: 'manual',
          message: 'This email is already registered',
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Something went wrong. Please try again later.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.root.message}</p>
            </div>
          </div>
        </div>
      )}
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        Sign up
      </Button>
    </form>
  );
}