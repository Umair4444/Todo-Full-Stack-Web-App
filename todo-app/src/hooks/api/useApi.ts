// src/hooks/api/useApi.ts
import { useState } from 'react';
import { toast } from 'sonner';

export interface ApiHook<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  execute: (params?: any) => Promise<TData | null>;
}

export const useApi = <TData, TParams = void>(
  apiFunction: (params: TParams) => Promise<TData>,
  options?: { showErrorToast?: boolean; successMessage?: string }
): ApiHook<TData> => {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (params?: TParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(params as TParams);
      setData(result);
      
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      if (options?.showErrorToast !== false) { // Default to showing error toast
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
};