// src/services/sync/conflictResolution.ts
import { TodoItem } from '@/lib/types';

// Types for conflict resolution
export interface Conflict {
  id: string;
  entity: 'TODO';
  localVersion: number;
  serverVersion: number;
  localData: TodoItem;
  serverData: TodoItem;
  timestamp: Date;
}

export enum ResolutionStrategy {
  SERVER_WINS = 'server_wins',
  CLIENT_WINS = 'client_wins',
  MERGE = 'merge',
  CUSTOM = 'custom'
}

/**
 * Service for resolving conflicts between local and server data
 */
class ConflictResolutionService {
  private static conflicts: Conflict[] = [];

  /**
   * Detect conflicts between local and server data
   */
  static detectConflict(localItem: TodoItem, serverItem: TodoItem): boolean {
    // For todo items, we can check the version property if available
    // In a real implementation, this would compare version numbers or timestamps
    if ('version' in localItem && 'version' in serverItem) {
      const localVersion = (localItem as any).version;
      const serverVersion = (serverItem as any).version;
      return localVersion !== serverVersion;
    }
    
    // If no version property, we could compare timestamps or other properties
    return false;
  }

  /**
   * Add a conflict to the conflict list
   */
  static addConflict(conflict: Omit<Conflict, 'timestamp'>): void {
    const newConflict: Conflict = {
      ...conflict,
      timestamp: new Date()
    };
    
    this.conflicts.push(newConflict);
  }

  /**
   * Get all conflicts
   */
  static getConflicts(): Conflict[] {
    return [...this.conflicts];
  }

  /**
   * Resolve a conflict using a specific strategy
   */
  static resolveConflict(conflict: Conflict, strategy: ResolutionStrategy): TodoItem {
    switch (strategy) {
      case ResolutionStrategy.SERVER_WINS:
        // Use server data as the resolution
        return conflict.serverData;
        
      case ResolutionStrategy.CLIENT_WINS:
        // Use local data as the resolution
        return conflict.localData;
        
      case ResolutionStrategy.MERGE:
        // Merge the differences between local and server data
        return this.mergeData(conflict.localData, conflict.serverData);
        
      case ResolutionStrategy.CUSTOM:
        // Custom resolution logic would go here
        return this.customResolution(conflict);
        
      default:
        // Default to server wins
        return conflict.serverData;
    }
  }

  /**
   * Merge local and server data
   */
  private static mergeData(local: TodoItem, server: TodoItem): TodoItem {
    // Create a merged todo item based on both local and server data
    // This is a simple merge strategy - in a real app, you might have more sophisticated merging
    return {
      ...server, // Start with server data
      // Override with local changes for specific fields
      title: local.title !== server.title ? local.title : server.title,
      description: local.description !== server.description ? local.description : server.description,
      completed: local.completed !== server.completed ? local.completed : server.completed,
      priority: local.priority !== server.priority ? local.priority : server.priority,
      // Update the timestamp to reflect the merge
      updatedAt: new Date()
    };
  }

  /**
   * Custom resolution logic
   */
  private static customResolution(conflict: Conflict): TodoItem {
    // In a real implementation, this would have custom logic based on the specific conflict
    // For now, we'll default to merging
    return this.mergeData(conflict.localData, conflict.serverData);
  }

  /**
   * Resolve all conflicts using a specific strategy
   */
  static resolveAllConflicts(strategy: ResolutionStrategy): TodoItem[] {
    return this.conflicts.map(conflict => this.resolveConflict(conflict, strategy));
  }

  /**
   * Clear all conflicts
   */
  static clearConflicts(): void {
    this.conflicts = [];
  }

  /**
   * Handle a sync conflict
   */
  static handleSyncConflict(localItem: TodoItem, serverItem: TodoItem): TodoItem {
    if (this.detectConflict(localItem, serverItem)) {
      const conflict: Conflict = {
        id: localItem.id,
        entity: 'TODO',
        localVersion: (localItem as any).version || 1,
        serverVersion: (serverItem as any).version || 1,
        localData: localItem,
        serverData: serverItem,
        timestamp: new Date()
      };
      
      this.addConflict(conflict);
      
      // For now, default to server wins strategy
      // In a real app, you might want to prompt the user for resolution
      return this.resolveConflict(conflict, ResolutionStrategy.SERVER_WINS);
    }
    
    // No conflict detected, return server data
    return serverItem;
  }
}

export default ConflictResolutionService;