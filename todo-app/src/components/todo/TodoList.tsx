// src/components/todo/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { TodoItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TodoItemComponent } from './TodoItem';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { TodoBulkActions } from './TodoBulkActions';
import { useSelection } from '@/hooks/useSelection';
import { Trash2Icon } from 'lucide-react';

interface TodoListProps {
  todos: TodoItem[];
  loading?: boolean;
  onRefresh?: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, loading = false, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkDeleteActive, setIsBulkDeleteActive] = useState(false);
  const { selectedItems, toggleSelection, selectAll, clearSelection, isSelected } = useSelection<string>();
  const itemsPerPage = 5;

  // Apply filters to todos
  const filteredTodos = todos.filter(todo => {
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && !todo.completed) ||
      (filterStatus === 'completed' && todo.completed);

    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;

    const matchesSearch = searchTerm === '' ||
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Extract IDs of filtered todos for bulk actions
  const filteredTodoIds = filteredTodos.map(todo => todo.id);

  // Pagination
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    // Clear selection when filters change
    clearSelection();
  }, [filterStatus, filterPriority, searchTerm, clearSelection]);

  // Deactivate bulk delete mode when all selections are cleared
  useEffect(() => {
    if (isBulkDeleteActive && selectedItems.length === 0) {
      // Delay deactivation slightly to allow for UI updates
      const timer = setTimeout(() => {
        setIsBulkDeleteActive(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedItems.length, isBulkDeleteActive]);

  return (
    <div className="pb-32"> {/* Add padding to account for floating bulk actions bar */}
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Input
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'completed') => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => setFilterPriority(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            {onRefresh && (
              <Button variant="outline" onClick={onRefresh} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            )}
          <Button
            variant="outline"
            onClick={() => {
              if (isBulkDeleteActive) {
                // If currently in bulk delete mode, exit it
                setIsBulkDeleteActive(false);
                clearSelection(); // Clear any selections when exiting
              } else {
                // If not in bulk delete mode, enter it
                setIsBulkDeleteActive(true);
                // Auto-select the first item if available
                if (filteredTodoIds.length > 0) {
                  toggleSelection(filteredTodoIds[0]);
                }
              }
            }}
            className="flex items-center gap-2"
          >
            <Trash2Icon className="h-4 w-4" />
            {isBulkDeleteActive ? 'Cancel Bulk Delete' : 'Bulk Delete'}
          </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions Component - only show when bulk delete is active and items are selected */}
          {isBulkDeleteActive && selectedItems.length > 0 && (
            <TodoBulkActions
              todoIds={filteredTodoIds}
              selectedIds={selectedItems}
              setSelectedIds={(ids) => {
                // Use the hook's setter if available, otherwise update state directly
                // For this implementation, we'll update the hook's state
                // Since we can't directly set the hook's state, we'll clear and re-add
                clearSelection();
                ids.forEach(id => toggleSelection(id));
              }}
              isBulkDeleteActive={isBulkDeleteActive}
              setIsBulkDeleteActive={setIsBulkDeleteActive}
            />
          )}

          {paginatedTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? 'Loading tasks...' : 'No tasks found. Create your first task!'}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedTodos.map(todo => (
                <TodoItemComponent
                  key={todo.id}
                  todo={todo}
                  isSelected={isSelected(todo.id)}
                  onSelect={() => toggleSelection(todo.id)}
                  isBulkDeleteActive={isBulkDeleteActive}
                />
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { TodoList };