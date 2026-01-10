// __tests__/api/api-integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '@/hooks/api/useApi';
import { renderHook, waitFor } from '@testing-library/react';

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the API function
const mockApiFunction = vi.fn();

describe('useApi Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiFunction.mockClear();
  });

  it('should execute API call and return data', async () => {
    const testData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValue(testData);

    const { result } = renderHook(() => useApi(mockApiFunction));

    // Execute the API call
    const returnedData = await result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(testData);
      expect(returnedData).toEqual(testData);
    });
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API Error';
    mockApiFunction.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it('should show success toast when successMessage is provided', async () => {
    const toastSuccessSpy = vi.spyOn(require('sonner').toast, 'success');
    const testData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValue(testData);

    const { result } = renderHook(() => useApi(mockApiFunction, { successMessage: 'Success!' }));

    await result.current.execute();

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith('Success!');
    });

    toastSuccessSpy.mockRestore();
  });

  it('should show error toast when API call fails', async () => {
    const toastErrorSpy = vi.spyOn(require('sonner').toast, 'error');
    const errorMessage = 'API Error';
    mockApiFunction.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(errorMessage);
    });

    toastErrorSpy.mockRestore();
  });

  it('should not show error toast when showErrorToast is false', async () => {
    const toastErrorSpy = vi.spyOn(require('sonner').toast, 'error');
    const errorMessage = 'API Error';
    mockApiFunction.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useApi(mockApiFunction, { showErrorToast: false }));

    await result.current.execute();

    await waitFor(() => {
      expect(toastErrorSpy).not.toHaveBeenCalled();
    });

    toastErrorSpy.mockRestore();
  });
});