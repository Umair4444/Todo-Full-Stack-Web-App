// src/components/todo/TodoForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

interface TodoFormProps {
  onTodoAdded?: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  
  const { actions } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    setLoading(true);
    try {
      // Create the new todo object
      const newTodo = {
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority,
        dueDate: undefined, // Could be added if needed
      };
      
      // Add to local state (optimistic update)
      actions.addTodo(newTodo);
      
      // In a real implementation, you would call the API here:
      // const createdTodo = await createTodo(newTodo);
      // And then update the local state with the server response
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      
      toast.success('Task added successfully');
      
      if (onTodoAdded) {
        onTodoAdded();
      }
    } catch (error) {
      toast.error('Failed to add task');
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
        <CardDescription>Create a new task to stay organized</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              maxLength={100}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details (optional)..."
              className="min-h-[80px] focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg"
              maxLength={500}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 border-2 border-input focus:border-primary rounded-lg hover:shadow-md">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100">Low Priority</SelectItem>
                  <SelectItem value="medium" className="bg-amber-50 text-amber-800 hover:bg-amber-100">Medium Priority</SelectItem>
                  <SelectItem value="high" className="bg-rose-50 text-rose-800 hover:bg-rose-100">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
            >
              {loading ? 'Adding Task...' : 'Add Task'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export { TodoForm };