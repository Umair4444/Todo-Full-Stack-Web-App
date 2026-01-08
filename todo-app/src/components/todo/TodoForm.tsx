/**
 * TodoForm Component
 *
 * A form component for creating and editing todo items.
 * It handles validation, submission, and error handling.
 *
 * Features:
 * - Title input with validation (required, max 100 chars)
 * - Description textarea with validation (max 500 chars)
 * - Priority selection (low, medium, high)
 * - Completion status checkbox
 * - Form validation using react-hook-form and Zod
 * - Error handling and toast notifications
 *
 * @component
 * @example
 * <TodoForm onSubmitSuccess={() => console.log('Todo added!')} />
 */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { isValidTodoTitle, isValidTodoDescription } from '@/lib/utils';
import { toast } from 'sonner';

// Define the form schema using Zod
const todoSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string()
    .max(500, { message: 'Description must be less than 500 characters' })
    .optional()
    .or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Priority is required',
  }),
  completed: z.boolean().optional(),
});

type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  /** Initial data to populate the form with */
  initialData?: TodoFormValues;
  /** Callback function called when form submission is successful */
  onSubmitSuccess?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  initialData = {
    title: '',
    description: '',
    priority: 'medium',
    completed: false
  },
  onSubmitSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTodo = useAppStore(state => state.actions.addTodo);
  const error = useAppStore(state => state.error);

  // Initialize the form with react-hook-form
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialData,
  });

  // Handle form submission
  const onSubmit = async (data: TodoFormValues) => {
    setIsSubmitting(true);

    try {
      // Submit the todo to the store
      addTodo({
        title: data.title,
        description: data.description || undefined,
        completed: data.completed || false,
        priority: data.priority,
      });

      // Reset the form
      form.reset({
        title: '',
        description: '',
        priority: 'medium',
        completed: false,
      });

      // Call the success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // Show success message
      toast.success('Todo added successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error toast if there's an error in the store
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="What needs to be done?"
                  {...field}
                  className={form.formState.errors.title ? "border-destructive" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add details about this task..."
                  {...field}
                  value={field.value || ""} // Ensure value is never undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="completed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {field.value ? 'Mark as Incomplete' : 'Mark as Completed'}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </Button>
      </form>
    </Form>
  );
};