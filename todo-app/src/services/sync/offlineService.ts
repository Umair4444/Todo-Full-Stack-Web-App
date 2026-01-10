// src/services/sync/offlineService.ts
import { TodoItem } from '@/lib/types';
import { toast } from 'sonner';

// Types for offline operations
export interface OfflineOperation {
  id: string;
  type: 'CREATE_TODO' | 'UPDATE_TODO' | 'DELETE_TODO';
  data: any;
  timestamp: number;
  completed: boolean;
}

// Local storage keys
const OFFLINE_OPERATIONS_KEY = 'todo-offline-operations';
const OFFLINE_DATA_KEY = 'todo-offline-data';

/**
 * Service for managing offline capabilities
 */
class OfflineService {
  /**
   * Add an operation to the offline queue
   */
  static queueOperation(operation: Omit<OfflineOperation, 'timestamp' | 'completed'>): void {
    const operations: OfflineOperation[] = this.getOfflineOperations();
    const newOperation: OfflineOperation = {
      ...operation,
      timestamp: Date.now(),
      completed: false
    };
    
    operations.push(newOperation);
    localStorage.setItem(OFFLINE_OPERATIONS_KEY, JSON.stringify(operations));
  }

  /**
   * Get all offline operations
   */
  static getOfflineOperations(): OfflineOperation[] {
    const opsStr = localStorage.getItem(OFFLINE_OPERATIONS_KEY);
    if (!opsStr) return [];
    
    try {
      return JSON.parse(opsStr);
    } catch (error) {
      console.error('Error parsing offline operations:', error);
      return [];
    }
  }

  /**
   * Mark an operation as completed
   */
  static markOperationCompleted(operationId: string): void {
    const operations = this.getOfflineOperations();
    const opIndex = operations.findIndex(op => op.id === operationId);
    
    if (opIndex !== -1) {
      operations[opIndex].completed = true;
      localStorage.setItem(OFFLINE_OPERATIONS_KEY, JSON.stringify(operations));
    }
  }

  /**
   * Remove completed operations
   */
  static cleanupCompletedOperations(): void {
    const operations = this.getOfflineOperations();
    const incompleteOps = operations.filter(op => !op.completed);
    localStorage.setItem(OFFLINE_OPERATIONS_KEY, JSON.stringify(incompleteOps));
  }

  /**
   * Store data for offline access
   */
  static storeOfflineData(data: { todos: TodoItem[] }): void {
    try {
      localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error storing offline data:', error);
    }
  }

  /**
   * Retrieve offline data
   */
  static getOfflineData(): { todos: TodoItem[] } | null {
    const dataStr = localStorage.getItem(OFFLINE_DATA_KEY);
    if (!dataStr) return null;
    
    try {
      return JSON.parse(dataStr);
    } catch (error) {
      console.error('Error parsing offline data:', error);
      return null;
    }
  }

  /**
   * Clear offline data
   */
  static clearOfflineData(): void {
    localStorage.removeItem(OFFLINE_DATA_KEY);
  }

  /**
   * Process offline operations when online
   */
  static async processOfflineOperations(): Promise<void> {
    const operations = this.getOfflineOperations();
    const incompleteOps = operations.filter(op => !op.completed);
    
    if (incompleteOps.length === 0) {
      return; // Nothing to process
    }

    let processedCount = 0;
    for (const operation of incompleteOps) {
      try {
        // In a real implementation, we would call the appropriate API endpoint
        // For now, we'll simulate the API call
        await this.simulateAPICall(operation);
        
        // Mark as completed
        this.markOperationCompleted(operation.id);
        processedCount++;
      } catch (error) {
        console.error(`Failed to process offline operation ${operation.id}:`, error);
        toast.error(`Failed to sync offline changes for ${operation.type.toLowerCase()}`);
      }
    }

    if (processedCount > 0) {
      toast.success(`Processed ${processedCount} offline operations`);
      this.cleanupCompletedOperations();
    }
  }

  /**
   * Simulate API call for offline operations
   */
  private static async simulateAPICall(operation: OfflineOperation): Promise<void> {
    // This is a simulation - in a real app, you would make actual API calls
    // based on the operation type and data
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Simulated API call for ${operation.type}:`, operation.data);
        resolve();
      }, 500); // Simulate network delay
    });
  }

  /**
   * Check if we're in offline mode
   */
  static isOffline(): boolean {
    return !navigator.onLine;
  }

  /**
   * Initialize offline capabilities
   */
  static initialize(): void {
    // Set up event listeners for online/offline events
    window.addEventListener('online', () => {
      toast.info('Connection restored. Processing offline changes...');
      this.processOfflineOperations();
    });

    window.addEventListener('offline', () => {
      toast.warning('Offline mode activated. Changes will sync when connection is restored.');
    });

    // Process any pending offline operations when the app starts
    if (navigator.onLine) {
      this.processOfflineOperations();
    }
  }
}

export default OfflineService;