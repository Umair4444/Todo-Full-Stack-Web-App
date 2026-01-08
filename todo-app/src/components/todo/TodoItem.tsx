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
      className={`p-4 rounded-lg border ${
        todo.completed
          ? 'bg-secondary/30 border-secondary'
          : 'bg-card hover:bg-accent/50'
      } transition-colors`}
      role="listitem"
      aria-labelledby={`todo-title-${todo.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleToggleCompletion();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCompletion}
          className="p-0 h-auto"
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleCompletion();
            }
          }}
        >
          {todo.completed ? (
            <CheckCircle
              className="h-5 w-5 text-green-500"
              aria-label="Completed todo"
            />
          ) : (
            <Circle
              className="h-5 w-5 text-muted-foreground"
              aria-label="Incomplete todo"
            />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              id={`todo-title-${todo.id}`}
              className={`font-medium truncate ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {todo.title}
            </h3>
            <Badge
              className={`${PRIORITY_COLORS[todo.priority]} text-xs`}
              aria-label={`Priority: ${todo.priority}`}
            >
              {todo.priority}
            </Badge>
          </div>

          {todo.description && (
            <p
              className={`text-sm mb-2 ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}
              id={`todo-desc-${todo.id}`}
            >
              {todo.description}
            </p>
          )}

          <div
            className="flex items-center justify-between text-xs text-muted-foreground"
            aria-label="Todo metadata"
          >
            <span>{t('created')}: {formatDate(todo.createdAt)}</span>
            {new Date(todo.updatedAt).getTime() !== new Date(todo.createdAt).getTime() && (
              <span>{t('updated')}: {formatDate(todo.updatedAt)}</span>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
            aria-label="Edit todo"
            title="Edit todo"
            onKeyDown={(e) => {
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
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            aria-label="Delete todo"
            title="Delete todo"
            onKeyDown={(e) => {
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