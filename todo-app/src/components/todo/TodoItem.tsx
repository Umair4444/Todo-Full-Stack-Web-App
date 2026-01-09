/**
 * TodoItem Component
 *
 * A component representing a single todo item with accessibility features.
 * Allows users to mark as complete/incomplete, edit, and delete todos.
 *
 * @component
 * @param {Object} props - Component props
 * @param {TodoItem} props.todo - The todo item to display
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TodoItem as TodoItemType } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { PRIORITY_COLORS } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';

interface TodoItemProps {
  /** The todo item to display */
  todo: TodoItemType;
}

const TodoItemComponent: React.FC<TodoItemProps> = ({ todo }) => {
  const { t } = useTranslation();
  const updateTodo = useAppStore(state => state.actions.updateTodo);
  const deleteTodo = useAppStore(state => state.actions.deleteTodo);
  const toggleTodoCompletion = useAppStore(state => state.actions.toggleTodoCompletion);

  const handleToggleCompletion = () => {
    toggleTodoCompletion(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    // In a real implementation, this would open an edit modal or form
    console.log('Edit todo:', todo.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-5 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-secondary/20 border-secondary/50 shadow-sm'
          : 'bg-card hover:shadow-md border-border'
      }`}
      role="listitem"
      aria-labelledby={`todo-title-${todo.id}`}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleToggleCompletion();
        }
      }}
    >
      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleCompletion}
          className={`h-8 w-8 rounded-full flex-shrink-0 mt-0.5 ${
            todo.completed
              ? 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20'
              : 'border-2 hover:border-primary'
          }`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleCompletion();
            }
          }}
        >
          {todo.completed ? (
            <CheckCircle
              className="h-4 w-4"
              aria-label="Completed todo"
            />
          ) : (
            <div className="h-4 w-4 rounded-full border border-current" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3
              id={`todo-title-${todo.id}`}
              className={`font-semibold truncate ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
            >
              {todo.title}
            </h3>
            <Badge
              className={`${PRIORITY_COLORS[todo.priority]} text-xs px-2 py-1 h-6 flex-shrink-0`}
              aria-label={`Priority: ${todo.priority}`}
            >
              {t(`${todo.priority}Priority`)}
            </Badge>
          </div>

          {todo.description && (
            <p
              className={`text-sm mb-2.5 ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}
              id={`todo-desc-${todo.id}`}
            >
              {todo.description}
            </p>
          )}

          <div
            className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"
            aria-label="Todo metadata"
          >
            <time dateTime={todo.createdAt.toISOString()} className="flex items-center gap-1">
              <span>{t('created')}:</span>
              <span className="font-medium">{formatDate(todo.createdAt)}</span>
            </time>
            {new Date(todo.updatedAt).getTime() !== new Date(todo.createdAt).getTime() && (
              <time dateTime={todo.updatedAt.toISOString()} className="flex items-center gap-1">
                <span>{t('updated')}:</span>
                <span className="font-medium">{formatDate(todo.updatedAt)}</span>
              </time>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Edit todo"
            title="Edit todo"
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEdit();
              }
            }}
          >
            <Edit3
              className="h-4 w-4"
              aria-label="Edit icon"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Delete todo"
            title="Delete todo"
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDelete();
              }
            }}
          >
            <Trash2
              className="h-4 w-4"
              aria-label="Delete icon"
            />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const TodoItem = React.memo(TodoItemComponent);