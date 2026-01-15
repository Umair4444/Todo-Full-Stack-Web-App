// Personal dashboard page with user information and todo history
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Circle, 
  Clock, 
  Plus, 
  History,
  FileText,
  Activity
} from 'lucide-react';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoList } from '@/components/todo/TodoList';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DashboardPageContent: React.FC = () => {
  const { user } = useAuth();
  const { todos, todoLogs, actions } = useAppStore();
  const [activeTab, setActiveTab] = useState('my-todos');

  // Load todos and logs when component mounts or when active tab changes
  useEffect(() => {
    actions.loadTodos();
    actions.loadTodoLogs();
  }, [actions, activeTab]);

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          Personal Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">Manage your tasks and view your activity</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="my-todos" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            My Todos
          </TabsTrigger>
          <TabsTrigger value="all-tasks" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* My Todos Tab */}
        <TabsContent value="my-todos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTodos}</div>
                <p className="text-xs text-muted-foreground">All your tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTodos}</div>
                <p className="text-xs text-muted-foreground">Finished tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTodos}</div>
                <p className="text-xs text-muted-foreground">Tasks to complete</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Add New Task</CardTitle>
                  <CardDescription>Create a new todo item</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <TodoForm onTodoAdded={() => actions.loadTodos()} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Active Tasks</CardTitle>
                  <CardDescription>Manage your current todo items</CardDescription>
                </div>
                <Badge variant="outline">{pendingTodos} pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <TodoList
                todos={todos}
                defaultFilterStatus="active"
                onRefresh={() => actions.loadTodos()}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Tasks Tab */}
        <TabsContent value="all-tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTodos}</div>
                <p className="text-xs text-muted-foreground">All your tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTodos}</div>
                <p className="text-xs text-muted-foreground">Finished tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTodos}</div>
                <p className="text-xs text-muted-foreground">Tasks to complete</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>View all your todo items</CardDescription>
                </div>
                <Badge variant="outline">{totalTodos} total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <TodoList
                todos={todos}
                onRefresh={() => actions.loadTodos()}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Completed Tasks</CardTitle>
                  <CardDescription>Your finished todo items</CardDescription>
                </div>
                <Badge variant="outline">{completedTodos} completed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <TodoList
                todos={todos}
                defaultFilterStatus="completed"
                onRefresh={() => actions.loadTodos()}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>Your todo actions timeline</CardDescription>
                </div>
                <Badge variant="outline">{todoLogs.length} records</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {todoLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No activity yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Your todo actions will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todoLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-start p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className={`mr-4 mt-1 h-3 w-3 rounded-full ${
                        log.action === 'CREATE' ? 'bg-green-500' :
                        log.action === 'UPDATE' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{log.action.toLowerCase()}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {log.action === 'CREATE' && `Created: ${log.new_state?.title}`}
                          {log.action === 'UPDATE' && `Updated: ${log.new_state?.title || log.previous_state?.title}`}
                          {log.action === 'DELETE' && `Deleted: ${log.previous_state?.title}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center flex-col space-y-4 pb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.email}`} alt={user?.email} />
                <AvatarFallback>
                  {user?.first_name?.charAt(0)}
                  {user?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.email}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Status:</span>
                    <span className={user?.is_active ? "text-green-600" : "text-red-600"}>
                      {user?.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs">{user?.id}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
};

export default DashboardPage;