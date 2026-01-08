// Todo list component with filtering and loading states
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TodoItem } from './TodoItem';
import { TodoItem as TodoItemType } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { TodoSkeleton } from './TodoSkeleton';
import { useTranslation } from '@/lib/i18n';

export const TodoList: React.FC = () => {
  const { t } = useTranslation();
  const todos = useAppStore(state => state.todos);
  const loading = useAppStore(state => state.loading);
  const setFilterStatus = useAppStore(state => state.actions.setFilterStatus);
  const setFilterPriority = useAppStore(state => state.actions.setFilterPriority);
  const setSearchTerm = useAppStore(state => state.actions.setSearchTerm);
  const filters = useAppStore(state => state.filters);
  const searchTerm = useAppStore(state => state.searchTerm);

  // Apply filters to todos
  const filteredTodos = todos.filter(todo => {
    // Filter by status
    if (filters.status === 'active' && todo.completed) return false;
    if (filters.status === 'completed' && !todo.completed) return false;

    // Filter by priority
    if (filters.priority !== 'all' && todo.priority !== filters.priority) return false;

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        todo.title.toLowerCase().includes(lowerSearchTerm) ||
        (todo.description && todo.description.toLowerCase().includes(lowerSearchTerm))
      );
    }

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-muted/30 rounded-xl border">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchTodos')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-11"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.status}
              onValueChange={(value: 'all' | 'active' | 'completed') => setFilterStatus(value)}
            >
              <SelectTrigger className="w-auto min-w-[120px] h-11">
                <SelectValue placeholder={t('all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="completed">{t('completed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={filters.priority}
            onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => setFilterPriority(value)}
          >
            <SelectTrigger className="w-auto min-w-[120px] h-11">
              <SelectValue placeholder={t('allPriorities')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allPriorities')}</SelectItem>
              <SelectItem value="low">{t('priority_low')}</SelectItem>
              <SelectItem value="medium">{t('priority_medium')}</SelectItem>
              <SelectItem value="high">{t('priority_high')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Todo items */}
      <div className="space-y-4">
        <AnimatePresence>
          {loading ? (
            // Show skeleton loading UI when loading
            <TodoSkeleton />
          ) : filteredTodos.length > 0 ? (
            filteredTodos.map(todo => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TodoItem todo={todo} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <div className="text-4xl">📋</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('noTodosFound')}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {!searchTerm
                  ? t('addYourFirstTask')
                  : `${t('noTodosMatchFilters')} "${searchTerm}"`}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};