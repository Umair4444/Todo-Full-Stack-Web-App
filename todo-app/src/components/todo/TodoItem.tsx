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
}

export const TodoItemComponent: React.FC<TodoItemProps> = ({ todo, isSelected = false, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const [editedPriority, setEditedPriority] = useState(todo.priority);

  const { actions } = useAppStore();

  const handleToggle = async () => {
    try {
      // Optimistically update the UI
      actions.toggleTodoCompletion(todo.id);

      // Call the API to update the todo
      // In a real implementation, you would call the API here
      // await toggleTodoCompletion(todo.id);

      toast.success('Task updated successfully');
    } catch (error) {
      // Revert the optimistic update if the API call fails
      actions.toggleTodoCompletion(todo.id);
      toast.error('Failed to update task');
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
    <Card className={`transition-all ${todo.completed ? 'opacity-70' : ''} ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            {/* Selection checkbox for bulk operations */}
            {onSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                aria-label={`Select todo ${todo.id}`}
              />
            )}

            {/* Completion checkbox */}
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggle}
              className="mt-1"
              aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
            />
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold"
                />
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="min-h-[80px]"
                />
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
            ) : (
              <div>
                <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-muted-foreground ${todo.completed ? 'line-through' : ''}`}>
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {todo.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit task"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
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