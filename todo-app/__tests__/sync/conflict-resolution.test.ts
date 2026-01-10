// __tests__/sync/conflict-resolution.test.ts
import { describe, it, expect, vi } from 'vitest';
import ConflictResolutionService, { ResolutionStrategy } from '@/services/sync/conflictResolution';
import { TodoItem } from '@/lib/types';

describe('ConflictResolutionService', () => {
  it('should detect conflicts between local and server data', () => {
    const localTodo: TodoItem = {
      id: '1',
      title: 'Local Title',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      version: 2, // Assuming we add a version property
    };

    const serverTodo: TodoItem = {
      id: '1',
      title: 'Server Title',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      version: 1, // Different version indicating conflict
    };

    const hasConflict = ConflictResolutionService.detectConflict(localTodo, serverTodo);

    expect(hasConflict).toBe(true);
  });

  it('should not detect conflicts when versions are the same', () => {
    const localTodo: TodoItem = {
      id: '1',
      title: 'Same Title',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      version: 1,
    };

    const serverTodo: TodoItem = {
      id: '1',
      title: 'Same Title',
      completed: false, // Same as local
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      version: 1, // Same version
    };

    const hasConflict = ConflictResolutionService.detectConflict(localTodo, serverTodo);

    expect(hasConflict).toBe(false);
  });

  it('should resolve conflict with server wins strategy', () => {
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

    const conflict = {
      id: '1',
      entity: 'TODO' as const,
      localVersion: 2,
      serverVersion: 1,
      localData: localTodo,
      serverData: serverTodo,
      timestamp: new Date(),
    };

    const resolvedTodo = ConflictResolutionService.resolveConflict(conflict, ResolutionStrategy.SERVER_WINS);

    expect(resolvedTodo).toEqual(serverTodo);
  });

  it('should resolve conflict with client wins strategy', () => {
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

    const conflict = {
      id: '1',
      entity: 'TODO' as const,
      localVersion: 2,
      serverVersion: 1,
      localData: localTodo,
      serverData: serverTodo,
      timestamp: new Date(),
    };

    const resolvedTodo = ConflictResolutionService.resolveConflict(conflict, ResolutionStrategy.CLIENT_WINS);

    expect(resolvedTodo).toEqual(localTodo);
  });

  it('should add and retrieve conflicts', () => {
    const conflict = {
      id: '1',
      entity: 'TODO' as const,
      localVersion: 2,
      serverVersion: 1,
      localData: { id: '1', title: 'Local', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' } as TodoItem,
      serverData: { id: '1', title: 'Server', completed: true, createdAt: new Date(), updatedAt: new Date(), priority: 'high' } as TodoItem,
      timestamp: new Date(),
    };

    ConflictResolutionService.addConflict(conflict);
    const conflicts = ConflictResolutionService.getConflicts();

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toEqual(conflict);
  });

  it('should clear conflicts', () => {
    const conflict = {
      id: '1',
      entity: 'TODO' as const,
      localVersion: 2,
      serverVersion: 1,
      localData: { id: '1', title: 'Local', completed: false, createdAt: new Date(), updatedAt: new Date(), priority: 'medium' } as TodoItem,
      serverData: { id: '1', title: 'Server', completed: true, createdAt: new Date(), updatedAt: new Date(), priority: 'high' } as TodoItem,
      timestamp: new Date(),
    };

    ConflictResolutionService.addConflict(conflict);
    ConflictResolutionService.clearConflicts();
    const conflicts = ConflictResolutionService.getConflicts();

    expect(conflicts).toHaveLength(0);
  });
});