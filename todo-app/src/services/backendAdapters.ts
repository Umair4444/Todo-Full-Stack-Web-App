// src/services/backendAdapters.ts
// Adapter functions to convert between frontend and backend data structures

import { TodoItem } from '@/lib/types';

// Convert backend todo response to frontend TodoItem
export function backendToFrontendTodo(backendTodo: any): TodoItem {
  // Validate and normalize priority value
  let priority: 'low' | 'medium' | 'high' = 'medium'; // Default value

  if (typeof backendTodo.priority === 'string') {
    const normalizedPriority = backendTodo.priority.toLowerCase();
    if (normalizedPriority === 'low' || normalizedPriority === 'medium' || normalizedPriority === 'high') {
      priority = normalizedPriority;
    }
  } else if (typeof backendTodo.priority === 'number') {
    // Handle numeric priority values (e.g., 0=low, 1=medium, 2=high or similar mapping)
    switch (backendTodo.priority) {
      case 0:
        priority = 'low';
        break;
      case 1:
        priority = 'medium';
        break;
      case 2:
        priority = 'high';
        break;
      default:
        priority = 'medium'; // Default fallback
    }
  } else if (backendTodo.priority === null || backendTodo.priority === undefined) {
    priority = 'medium'; // Default when priority is null or undefined
  }

  return {
    id: backendTodo.id.toString(), // Backend uses integer IDs, frontend expects strings
    title: backendTodo.title,
    description: backendTodo.description,
    completed: backendTodo.is_completed, // Backend uses snake_case, frontend uses camelCase
    createdAt: new Date(backendTodo.created_at),
    updatedAt: new Date(backendTodo.updated_at),
    priority: priority, // Validated priority
    dueDate: backendTodo.due_date ? new Date(backendTodo.due_date) : undefined,
  };
}

// Convert frontend TodoItem to backend todo request
export function frontendToBackendTodo(frontendTodo: Partial<TodoItem>): any {
  return {
    title: frontendTodo.title,
    description: frontendTodo.description,
    is_completed: frontendTodo.completed, // Convert camelCase to snake_case for backend
    priority: frontendTodo.priority,
    due_date: frontendTodo.dueDate?.toISOString(),
  };
}

// Convert frontend TodoItem to backend update request
export function frontendToBackendUpdate(frontendTodo: Partial<TodoItem>): any {
  const updateObj: any = {};
  
  if (frontendTodo.title !== undefined) updateObj.title = frontendTodo.title;
  if (frontendTodo.description !== undefined) updateObj.description = frontendTodo.description;
  if (frontendTodo.completed !== undefined) updateObj.is_completed = frontendTodo.completed;
  if (frontendTodo.priority !== undefined) updateObj.priority = frontendTodo.priority;
  if (frontendTodo.dueDate !== undefined) updateObj.due_date = frontendTodo.dueDate.toISOString();
  
  return updateObj;
}