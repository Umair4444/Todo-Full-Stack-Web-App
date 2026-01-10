// src/components/auth/AuthNavigation.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-primary-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-xs font-medium">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
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