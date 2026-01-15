// src/components/auth/AuthNavigation.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserIcon, LogOutIcon, SettingsIcon, UserRound, HomeIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AuthNavigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
  };

  if (isAuthenticated && user) {
    // Authenticated user view
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full overflow-hidden p-0 hover:bg-accent transition-all duration-200"
            aria-label="User menu"
          >
            <Avatar className="h-full w-full">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.first_name || user?.email}&backgroundColor=b6e6a1&fontSize=36`}
                alt={`${user?.first_name || user?.email} avatar`}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-0" align="end" forceMount>
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.first_name || user?.email}&backgroundColor=b6e6a1&fontSize=36`}
                  alt={`${user?.first_name || user?.email} avatar`}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.email}
                </p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-1">
            <DropdownMenuItem
              onClick={() => router.push('/todo-app/profile')}
              className="cursor-pointer"
            >
              <UserRound className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/todo-app')}
              className="cursor-pointer"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    // Guest user view
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => router.push('/login')}
        >
          Login
        </Button>
        <Button
          onClick={() => router.push('/register')}
        >
          Register
        </Button>
      </div>
    );
  }
};

export default AuthNavigation;