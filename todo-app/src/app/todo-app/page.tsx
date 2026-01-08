// Todo application page
import React from 'react';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoList } from '@/components/todo/TodoList';

const TodoAppPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Todo App</h1>
        <p className="text-muted-foreground">Manage your tasks efficiently</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <TodoForm />
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <span className="text-sm text-muted-foreground">
            { /* In a real app, this would show the count of todos */ }
          </span>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default TodoAppPage;