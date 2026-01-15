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
  defaultFilterStatus?: 'all' | 'active' | 'completed';
}

const TodoList: React.FC<TodoListProps> = ({ todos, loading = false, onRefresh, defaultFilterStatus = 'all' }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>(defaultFilterStatus);
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

    const matchesPriority = filterPriority === 'all' || (typeof todo.priority === 'string' && todo.priority === filterPriority);

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
      <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 flex-wrap">
            <Input
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg hover:shadow-md"
            />
            <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'completed') => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg hover:shadow-md">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => setFilterPriority(value)}>
              <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg hover:shadow-md">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low" className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100">Low Priority</SelectItem>
                <SelectItem value="medium" className="bg-amber-50 text-amber-800 hover:bg-amber-100">Medium Priority</SelectItem>
                <SelectItem value="high" className="bg-rose-50 text-rose-800 hover:bg-rose-100">High Priority</SelectItem>
              </SelectContent>
            </Select>
            {onRefresh && (
              <Button
                variant="outline"
                onClick={onRefresh}
                disabled={loading}
                className="transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
              >
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
            className="flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
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
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
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