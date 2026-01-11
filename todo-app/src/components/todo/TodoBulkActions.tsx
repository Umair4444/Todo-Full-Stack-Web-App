'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2Icon, XIcon, CheckIcon, Loader2Icon } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface TodoBulkActionsProps {
  todoIds: string[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  isBulkDeleteActive: boolean;
  setIsBulkDeleteActive: (active: boolean) => void;
}

export function TodoBulkActions({ todoIds, selectedIds, setSelectedIds, isBulkDeleteActive, setIsBulkDeleteActive }: TodoBulkActionsProps) {
  const { actions, loading } = useAppStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleSelectAll = () => {
    if (selectedIds.length === todoIds.length) {
      // If all are selected, deselect all
      setSelectedIds([]);
    } else {
      // If not all are selected, select all
      setSelectedIds([...todoIds]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      // Show progress during deletion
      setProgress(30);

      await actions.bulkDeleteTodos(selectedIds);

      setProgress(100);
      setTimeout(() => {
        setSelectedIds([]); // Clear selection after successful deletion
        setShowConfirmation(false);
        setIsBulkDeleteActive(false); // Deactivate bulk delete mode after successful deletion
        setProgress(0); // Reset progress
      }, 500);
    } catch (error) {
      console.error('Error deleting todos:', error);
      setProgress(0); // Reset progress on error
    }
  };

  const areAllSelected = selectedIds.length > 0 && selectedIds.length === todoIds.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < todoIds.length;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-background to-secondary/30 border border-border rounded-xl shadow-xl p-5 backdrop-blur-lg bg-opacity-95 transition-all duration-300">
        {progress > 0 && (
          <div className="mb-3">
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Checkbox
                id="select-all"
                checked={areAllSelected}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all todos"
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 transition-transform duration-200 hover:scale-110"
              />
              {(someSelected || areAllSelected) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {someSelected ? (
                    <div className="h-1.5 w-3 bg-current rounded-sm"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
              )}
            </div>

            <div>
              <span className="font-semibold text-lg">
                {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
              </span>
              <div className="text-xs text-muted-foreground">
                {Math.round((selectedIds.length / todoIds.length) * 100)}% of visible items
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
              className="ml-2"
            >
              {areAllSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {!showConfirmation && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedIds([]);
                  setIsBulkDeleteActive(false);
                }}
                className="flex items-center gap-1 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <XIcon className="h-4 w-4" />
                Cancel
              </Button>
            )}

            {!showConfirmation ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowConfirmation(true)}
                disabled={loading}
                className="flex items-center gap-1 bg-destructive/90 hover:bg-destructive text-destructive-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.03]"
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-destructive/10 p-3 rounded-lg border border-destructive/30 animate-in fade-in zoom-in-95">
                <span className="text-sm font-medium">
                  Delete {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}?
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="flex items-center gap-1 bg-destructive hover:bg-destructive/90"
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : 'Yes, Delete'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  No, Keep
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}