// __tests__/sync/data-persistence.integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SyncService from '@/services/sync/syncService';
import OfflineService from '@/services/sync/offlineService';
import ConflictResolutionService from '@/services/sync/conflictResolution';
import { TodoItem } from '@/lib/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock the todo API functions
vi.mock('@/services/todoApi', () => ({
  getTodos: vi.fn().mockResolvedValue({ items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
  createTodo: vi.fn().mockResolvedValue({ id: '1', title: 'Test', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' }),
  updateTodo: vi.fn().mockResolvedValue({ id: '1', title: 'Updated Test', completed: true, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' }),
  deleteTodo: vi.fn().mockResolvedValue(undefined),
  getTodoById: vi.fn().mockResolvedValue({ id: '1', title: 'Test', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' }),
}));

describe('Data Persistence Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReturnValue(undefined);
    localStorageMock.removeItem.mockReturnValue(undefined);
  });

  it('should handle offline operations and sync when online', async () => {
    // Simulate offline mode
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    // Queue an offline operation
    const todoData = { 
      title: 'Test Todo', 
      completed: false, 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      priority: 'medium' as const 
    };
    
    OfflineService.queueOperation({
      id: '1',
      type: 'CREATE_TODO',
      data: todoData,
    });

    // Verify operation was queued
    const offlineOps = OfflineService.getOfflineOperations();
    expect(offlineOps).toHaveLength(1);
    expect(offlineOps[0].id).toBe('1');

    // Simulate coming back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    // Process offline operations
    await OfflineService.processOfflineOperations();

    // Verify operations were processed
    const remainingOps = OfflineService.getOfflineOperations();
    const completedOps = remainingOps.filter(op => op.completed);
    expect(completedOps).toHaveLength(1);
  });

  it('should handle sync and conflict resolution together', () => {
    const localTodo: TodoItem = {
      id: '1',
      title: 'Local Title',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      version: 2,
    };

    const serverTodo: TodoItem = {
      id: '1',
      title: 'Server Title',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      version: 1,
    };

    // Detect conflict
    const hasConflict = ConflictResolutionService.detectConflict(localTodo, serverTodo);
    expect(hasConflict).toBe(true);

    // Add conflict to resolution service
    const conflict = {
      id: '1',
      entity: 'TODO' as const,
      localVersion: 2,
      serverVersion: 1,
      localData: localTodo,
      serverData: serverTodo,
      timestamp: new Date(),
    };
    
    ConflictResolutionService.addConflict(conflict);

    // Resolve conflict
    const resolvedTodo = ConflictResolutionService.resolveConflict(conflict, 'server_wins');
    
    // Verify resolution
    expect(resolvedTodo).toEqual(serverTodo);
  });

  it('should maintain data consistency during sync operations', async () => {
    // Queue multiple sync operations
    SyncService.queueSyncOperation({
      id: '1',
      type: 'CREATE',
      entity: 'TODO',
      data: { title: 'Test Todo 1' },
    });

    SyncService.queueSyncOperation({
      id: '2',
      type: 'UPDATE',
      entity: 'TODO',
      data: { id: '1', title: 'Updated Test Todo 1' },
    });

    // Verify operations are queued
    const queue = SyncService.getSyncQueue();
    expect(queue).toHaveLength(2);

    // Simulate sync process
    await SyncService.syncWithBackend();

    // Verify queue is updated
    const updatedQueue = SyncService.getSyncQueue();
    expect(updatedQueue.filter(op => !op.synced)).toHaveLength(0);
  });

  it('should handle network errors gracefully during sync', async () => {
    // Mock an error during sync
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Queue an operation
    SyncService.queueSyncOperation({
      id: '1',
      type: 'CREATE',
      entity: 'TODO',
      data: { title: 'Test Todo' },
    });

    // Mock the API to reject
    vi.mocked(import('@/services/todoApi')).createTodo.mockRejectedValueOnce(new Error('Network error'));

    // Mock localStorage to return the queued operation
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'todo-sync-queue') {
        return JSON.stringify([{
          id: '1',
          type: 'CREATE',
          entity: 'TODO',
          data: { title: 'Test Todo' },
          timestamp: new Date(),
          synced: false,
        }]);
      }
      return null;
    });

    // Attempt to sync - should handle error gracefully
    await expect(SyncService.syncWithBackend()).resolves.not.toThrow();

    consoleSpy.mockRestore();
  });
});