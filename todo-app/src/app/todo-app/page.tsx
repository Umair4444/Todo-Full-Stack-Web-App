// Todo application page
'use client';

import React from 'react';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoList } from '@/components/todo/TodoList';
import { useTranslation } from '@/lib/i18n';

const TodoAppPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <h1 className="text-3xl md:text-4xl font-bold pb-1 lg:pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            {t('todoApp')}
          </h1>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
            {t('newFeature')}
          </span>
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {t('manageYourTasks')}
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-lg border p-5 sm:px-7 sm:py-4 mb-8 transition-all hover:shadow-xl">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b">
          <div className="p-2 rounded-lg bg-primary/10">
            <div className="h-6 w-6 text-primary">📝</div>
          </div>
          <h2 className="text-2xl font-bold">{t('addNewTask')}</h2>
        </div>
        <TodoForm />
      </div>

      <div className="bg-card rounded-2xl shadow-lg border p-5 sm:p-7 transition-all hover:shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <div className="h-6 w-6 text-primary">📋</div>
            </div>
            <h2 className="text-2xl font-bold">{t('yourTasks')}</h2>
          </div>
          <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
            { /* In a real app, this would show the count of todos */ }
          </span>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default TodoAppPage;