// __tests__/sync/sync-service.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SyncService from '@/services/sync/syncService';
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

describe('SyncService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReturnValue(undefined);
    localStorageMock.removeItem.mockReturnValue(undefined);
  });

  it('should queue a sync operation', () => {
    const operation = {
      id: '1',
      type: 'CREATE' as const,
      entity: 'TODO' as const,
      data: { title: 'Test Todo' },
    };

    SyncService.queueSyncOperation(operation);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'todo-sync-queue',
      expect.any(String)
    );
  });

  it('should get the sync queue', () => {
    const queue = [
      {
        id: '1',
        type: 'CREATE',
        entity: 'TODO',
        data: { title: 'Test Todo' },
        timestamp: new Date(),
        synced: false,
      }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(queue));

    const result = SyncService.getSyncQueue();

    expect(result).toEqual(queue);
  });

  it('should set and get last sync time', () => {
    const time = new Date();
    
    SyncService.setLastSyncTime(time);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'last-sync-timestamp',
      time.toISOString()
    );
    
    localStorageMock.getItem.mockReturnValue(time.toISOString());
    
    const result = SyncService.getLastSyncTime();
    
    expect(result).toEqual(time);
  });

  it('should handle sync errors gracefully', async () => {
    // Mock an error during sync
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the API to reject
    vi.mocked(import('@/services/todoApi')).createTodo.mockRejectedValueOnce(new Error('Network error'));
    
    const operation = {
      id: '1',
      type: 'CREATE' as const,
      entity: 'TODO' as const,
      data: { title: 'Test Todo' },
    };
    
    SyncService.queueSyncOperation(operation);
    
    // Mock the queue to return the operation
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'todo-sync-queue') {
        return JSON.stringify([{
          ...operation,
          timestamp: new Date(),
          synced: false,
        }]);
      }
      return null;
    });
    
    await expect(SyncService.syncWithBackend()).resolves.not.toThrow();
    
    consoleSpy.mockRestore();
  });
});