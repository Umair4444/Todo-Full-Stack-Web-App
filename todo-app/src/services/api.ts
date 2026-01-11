// API service for backend connection
// This handles communication with the Python FastAPI backend

import { toast } from 'sonner';

// Define the shape of API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Base API URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create a base request function with error handling
async function baseRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint}`;

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add authorization header if token exists
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
      signal: controller.signal, // Add abort signal for timeout
    });

    clearTimeout(timeoutId); // Clear timeout if request completes

    const data = await response.json();

    if (!response.ok) {
      const errorResponse: ApiResponse<T> = {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: data.detail || response.statusText, // Backend uses 'detail' for error messages
          details: data,
        },
      };

      // Show error toast notification
      toast.error(data.detail || response.statusText);

      return errorResponse;
    }

    return {
      success: true,
      data: data as T
    };
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);

    // Check if the error is due to timeout
    if (error instanceof Error && error.name === 'AbortError') {
      const timeoutResponse: ApiResponse<T> = {
        success: false,
        error: {
          code: 'TIMEOUT_ERROR',
          message: 'Request timed out. Please check your connection and try again.',
          details: 'The request took too long to complete',
        },
      };

      // Show timeout error toast notification
      toast.error('Request timed out. Please check your connection and try again.');
      return timeoutResponse;
    }

    const errorResponse: ApiResponse<T> = {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: error instanceof Error ? error.message : String(error),
      },
    };

    // Show error toast notification
    toast.error('Network error occurred. Please check your connection and try again.');

    return errorResponse;
  }
}

// Helper function to get authorization header
function getAuthHeader(): { Authorization?: string } {
  // In a real implementation, this would retrieve the JWT token from storage
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Health check endpoint
export async function checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string; response_time_ms: number; details: object }>> {
  return baseRequest('/health', { method: 'GET' });
}

// Export the base request function for custom API calls
export { baseRequest };