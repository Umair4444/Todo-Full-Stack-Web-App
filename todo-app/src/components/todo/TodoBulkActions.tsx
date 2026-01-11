'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2Icon } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface TodoBulkActionsProps {
  todoIds: string[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export function TodoBulkActions({ todoIds, selectedIds, setSelectedIds }: TodoBulkActionsProps) {
  const { actions, loading } = useAppStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === todoIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...todoIds]);
    }
  };

  const toggleSelectTodo = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(todoId => todoId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await actions.bulkDeleteTodos(selectedIds);
      setSelectedIds([]); // Clear selection after successful deletion
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting todos:', error);
    }
  };

  const areAllSelected = selectedIds.length > 0 && selectedIds.length === todoIds.length;

  return (
    <div className="w-full mb-4">
      {/* Select All Controls */}
      <div className="flex items-center gap-3 mb-3 p-3 bg-muted rounded-lg">
        <Checkbox
          id="select-all"
          checked={areAllSelected}
          onCheckedChange={toggleSelectAll}
          aria-label="Select all todos"
        />
        <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {selectedIds.length > 0 
            ? `${selectedIds.length} of ${todoIds.length} selected` 
            : 'Select todos'}
        </label>
        
        {selectedIds.length > 0 && (
          <>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirmation(true)}
              disabled={loading}
              className="ml-auto flex items-center gap-1"
            >
              <Trash2Icon className="h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
            
            {showConfirmation && (
              <div className="ml-2 p-2 bg-destructive/20 rounded-md flex items-center gap-2">
                <span className="text-sm">Delete {selectedIds.length} items?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Confirm'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}