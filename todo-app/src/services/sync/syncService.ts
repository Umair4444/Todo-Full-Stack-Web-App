// src/services/sync/syncService.ts
import { TodoItem, UserPreferences } from '@/lib/types';
import { getTodos, createTodo, updateTodo, deleteTodo, getTodoById } from '../todoApi';
import { toast } from 'sonner';

// Types for sync operations
export interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'TODO' | 'PREFERENCE';
  data: any;
  timestamp: Date;
  synced: boolean;
}

// Local storage keys
const SYNC_QUEUE_KEY = 'todo-sync-queue';
const LAST_SYNC_KEY = 'last-sync-timestamp';

/**
 * Service for managing synchronization between frontend and backend
 */
class SyncService {
  /**
   * Queue a sync operation for later processing
   */
  static queueSyncOperation(operation: Omit<SyncOperation, 'timestamp' | 'synced'>): void {
    const queue: SyncOperation[] = this.getSyncQueue();
    const newOperation: SyncOperation = {
      ...operation,
      timestamp: new Date(),
      synced: false
    };
    
    queue.push(newOperation);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  /**
   * Get the current sync queue
   */
  static getSyncQueue(): SyncOperation[] {
    const queueStr = localStorage.getItem(SYNC_QUEUE_KEY);
    if (!queueStr) return [];
    
    try {
      return JSON.parse(queueStr, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      });
    } catch (error) {
      console.error('Error parsing sync queue:', error);
      return [];
    }
  }

  /**
   * Clear the sync queue
   */
  static clearSyncQueue(): void {
    localStorage.removeItem(SYNC_QUEUE_KEY);
  }

  /**
   * Get the last sync timestamp
   */
  static getLastSyncTime(): Date | null {
    const timestampStr = localStorage.getItem(LAST_SYNC_KEY);
    if (!timestampStr) return null;
    
    try {
      return new Date(timestampStr);
    } catch (error) {
      console.error('Error parsing last sync time:', error);
      return null;
    }
  }

  /**
   * Set the last sync timestamp
   */
  static setLastSyncTime(time: Date): void {
    localStorage.setItem(LAST_SYNC_KEY, time.toISOString());
  }

  /**
   * Synchronize queued operations with the backend
   */
  static async syncWithBackend(): Promise<void> {
    const queue = this.getSyncQueue();
    if (queue.length === 0) {
      return; // Nothing to sync
    }

    const operationsToProcess = [...queue];
    let processedCount = 0;

    for (const operation of operationsToProcess) {
      try {
        // Process the operation based on its type
        switch (operation.type) {
          case 'CREATE':
            if (operation.entity === 'TODO') {
              await createTodo(operation.data);
            } else if (operation.entity === 'PREFERENCE') {
              // Handle preference sync if needed
            }
            break;
            
          case 'UPDATE':
            if (operation.entity === 'TODO') {
              await updateTodo(operation.data.id, operation.data);
            } else if (operation.entity === 'PREFERENCE') {
              // Handle preference sync if needed
            }
            break;
            
          case 'DELETE':
            if (operation.entity === 'TODO') {
              await deleteTodo(operation.data.id);
            } else if (operation.entity === 'PREFERENCE') {
              // Handle preference sync if needed
            }
            break;
        }

        // Mark operation as synced
        const updatedQueue = this.getSyncQueue();
        const opIndex = updatedQueue.findIndex(op => op.id === operation.id);
        if (opIndex !== -1) {
          updatedQueue[opIndex].synced = true;
          localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
        }

        processedCount++;
      } catch (error) {
        console.error(`Failed to sync operation ${operation.id}:`, error);
        toast.error(`Failed to sync ${operation.type.toLowerCase()} operation`);
      }
    }

    // Remove synced operations from the queue
    const finalQueue = this.getSyncQueue().filter(op => !op.synced);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(finalQueue));

    if (processedCount > 0) {
      toast.success(`Synced ${processedCount} operations with the server`);
      this.setLastSyncTime(new Date());
    }
  }

  /**
   * Perform a full sync: download latest data from backend and upload local changes
   */
  static async fullSync(): Promise<{ todos: TodoItem[], preferences: UserPreferences | null }> {
    try {
      // First, sync any pending operations
      await this.syncWithBackend();

      // Then fetch fresh data from backend
      const { items: todos } = await getTodos(1, 100); // Get all todos
      
      // For now, return empty preferences - would be implemented based on actual needs
      const preferences: UserPreferences | null = null;

      return { todos, preferences };
    } catch (error) {
      console.error('Full sync failed:', error);
      toast.error('Failed to sync with server. Working in offline mode.');
      throw error;
    }
  }

  /**
   * Check if we're in online mode
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Listen for online/offline events
   */
  static setupOnlineListener(): void {
    window.addEventListener('online', () => {
      toast.info('Connection restored. Syncing with server...');
      this.syncWithBackend();
    });

    window.addEventListener('offline', () => {
      toast.warning('Offline mode. Changes will sync when connection is restored.');
    });
  }
}

export default SyncService;