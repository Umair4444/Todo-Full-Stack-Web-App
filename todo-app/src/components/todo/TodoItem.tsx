// src/components/todo/TodoItem.tsx
import React, { useState } from 'react';
import { TodoItem as TodoItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Save, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

interface TodoItemProps {
  todo: TodoItemType;
  isSelected?: boolean;
  onSelect?: () => void;
  isBulkDeleteActive?: boolean;
}

export const TodoItemComponent: React.FC<TodoItemProps> = ({ todo, isSelected = false, onSelect, isBulkDeleteActive = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const [editedPriority, setEditedPriority] = useState(todo.priority);

  const { actions } = useAppStore();

  const handleToggle = async () => {
    // Optimistically update the UI immediately
    const previousState = todo.completed;
    actions.toggleTodoCompletion(todo.id);

    try {
      // Call the API to update the todo
      await import('@/services/todoApi').then(api => api.toggleTodoCompletion(todo.id));

      toast.success(!previousState ? 'Task marked as complete!' : 'Task marked as incomplete');
    } catch (error) {
      // Revert the optimistic update if the API call fails
      actions.toggleTodoCompletion(todo.id);
      toast.error('Failed to update task. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      // Call the API to delete the todo
      // In a real implementation, you would call the API here
      // await deleteTodo(todo.id);

      // Update the local state
      actions.deleteTodo(todo.id);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleSave = async () => {
    try {
      // Update the todo with the edited values
      const updatedTodo = {
        ...todo,
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority as 'low' | 'medium' | 'high',
      };

      // Call the API to update the todo
      // In a real implementation, you would call the API here
      // await updateTodo(todo.id, updatedTodo);

      // Update the local state
      actions.updateTodo(todo.id, updatedTodo);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleCancel = () => {
    // Reset the edited values to the original values
    setEditedTitle(todo.title);
    setEditedDescription(todo.description || '');
    setEditedPriority(todo.priority);
    setIsEditing(false);
  };

  return (
    <Card className={`transition-all duration-300 ${
      todo.completed ? 'opacity-80 bg-accent/50 border-primary/20' : 'hover:shadow-md'
    } ${isSelected ? 'ring-2 ring-primary bg-primary/5 scale-[1.01]' : ''} ${
      isBulkDeleteActive ? 'transition-transform duration-200 hover:scale-[1.02]' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            {/* Show selection checkbox when bulk delete is active */}
            {isBulkDeleteActive && onSelect && (
              <div className="flex items-center">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onSelect}
                  aria-label={`Select todo ${todo.id}`}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 transition-transform duration-200 hover:scale-110"
                />
              </div>
            )}

            {/* Show completion toggle when bulk delete is not active */}
            {!isBulkDeleteActive && (
              <button
                onClick={handleToggle}
                className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${
                  todo.completed
                    ? 'bg-primary border-primary shadow-md'
                    : 'border-input hover:border-primary/70'
                }`}
                aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {todo.completed && (
                  <span className="animate-in fade-in zoom-in duration-200">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold"
                  autoFocus
                />
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="min-h-[80px]"
                />
                <div className="flex items-center gap-2">
                  <Select value={editedPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditedPriority(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-muted-foreground ${todo.completed ? 'line-through' : ''}`}>
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge
                    variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}
                    className={`${todo.completed ? 'opacity-70' : ''}`}
                  >
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {todo.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="h-8 px-3">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-3">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                  aria-label="Edit task"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};