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
  const [editedPriority, setEditedPriority] = useState(
    typeof todo.priority === 'string' && todo.priority
      ? (todo.priority as 'low' | 'medium' | 'high')
      : 'medium'
  );

  const { actions } = useAppStore();

  const handleToggle = async () => {
    // Optimistically update the UI immediately
    const previousState = todo.completed;
    try {
      await actions.toggleTodoCompletion(todo.id);
      toast.success(!previousState ? 'Task marked as complete!' : 'Task marked as incomplete');
    } catch (error) {
      // The store action already handles reverting the optimistic update if the API call fails
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
    setEditedPriority(
      typeof todo.priority === 'string' && todo.priority
        ? (todo.priority as 'low' | 'medium' | 'high')
        : 'medium'
    );
    setIsEditing(false);
  };

  return (
    <Card className={`transition-all duration-300 ease-in-out ${
      todo.completed
        ? 'opacity-80 bg-accent/50 border-primary/20'
        : `hover:shadow-xl hover:-translate-y-0.5 ${(
          typeof todo.priority === 'string' &&
          todo.priority &&
          todo.priority === 'high'
        ) ? 'border-l-4 border-l-rose-400' :
           (
             typeof todo.priority === 'string' &&
             todo.priority &&
             todo.priority === 'medium'
           ) ? 'border-l-4 border-l-amber-400' :
           'border-l-4 border-l-emerald-400'}`}
    } ${isSelected ? 'ring-2 ring-primary bg-primary/5 scale-[1.01]' : ''} ${
      isBulkDeleteActive ? 'transition-transform duration-200 hover:scale-[1.02]' : ''
    } animate-in fade-in-50 duration-300`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex items-center gap-3">
            {/* Show selection checkbox when bulk delete is active */}
            {isBulkDeleteActive && onSelect && (
              <div className="flex items-center">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onSelect}
                  aria-label={`Select todo ${todo.id}`}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 transition-transform duration-200 hover:scale-110 data-[state=unchecked]:hover:bg-accent"
                />
              </div>
            )}

            {/* Show completion toggle when bulk delete is not active */}
            {!isBulkDeleteActive && (
              <button
                onClick={handleToggle}
                className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-300 transform hover:scale-110 ${
                  todo.completed
                    ? 'bg-emerald-500 border-emerald-500 shadow-md hover:bg-emerald-600 hover:shadow-lg'
                    : 'border-input hover:border-primary hover:bg-primary/10 hover:shadow-md'
                }`}
                aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                aria-describedby={`todo-title-${todo.id}`}
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
                  className="text-lg font-semibold focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg"
                  autoFocus
                />
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="min-h-[80px] focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg"
                />
                <div className="flex items-center gap-2">
                  <Select value={editedPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditedPriority(value)}>
                    <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg hover:shadow-md">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100">Low Priority</SelectItem>
                      <SelectItem value="medium" className="bg-amber-50 text-amber-800 hover:bg-amber-100">Medium Priority</SelectItem>
                      <SelectItem value="high" className="bg-rose-50 text-rose-800 hover:bg-rose-100">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div>
                <h3 id={`todo-title-${todo.id}`} className={`text-lg font-semibold transition-all duration-200 ${todo.completed ? 'line-through text-muted-foreground' : 'hover:text-primary'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-muted-foreground transition-all duration-200 ${todo.completed ? 'line-through' : 'hover:text-foreground'}`}>
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge
                    className={`${todo.completed ? 'opacity-70' : ''}
                      ${(
                        typeof todo.priority === 'string' &&
                        todo.priority &&
                        todo.priority === 'low'
                      ) ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 hover:shadow-md' :
                        (
                          typeof todo.priority === 'string' &&
                          todo.priority &&
                          todo.priority === 'medium'
                        ) ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 hover:text-amber-900 hover:shadow-md' :
                        'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 hover:text-rose-900 hover:shadow-md'}
                      transition-all duration-200 ease-in-out cursor-default transform hover:-translate-y-0.5`}
                  >
                    {typeof todo.priority === 'string' && todo.priority && typeof todo.priority.charAt === 'function'
                      ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
                      : 'Medium'} {/* Default fallback if priority is not a string or invalid */}
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
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-8 px-3 hover:bg-muted transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
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
                  className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                  aria-label="Edit task"
                  title="Edit task"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 hover:text-destructive transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                  aria-label="Delete task"
                  title="Delete task"
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