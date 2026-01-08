// Navigation links component
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ href, children, className = '' }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground hover:bg-accent'
      } ${className}`}
    >
      {children}
    </Link>
  );
};

interface NavigationLinksProps {
  orientation?: 'horizontal' | 'vertical';
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({ 
  orientation = 'horizontal' 
}) => {
  const flexDirection = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
  const spacing = orientation === 'horizontal' ? 'space-x-1' : 'space-y-1';
  
  return (
    <div className={`flex ${flexDirection} ${spacing}`}>
      <NavigationLink href="/">Home</NavigationLink>
      <NavigationLink href="/todo-app">Todo App</NavigationLink>
      <NavigationLink href="/about">About</NavigationLink>
      <NavigationLink href="/contact">Contact</NavigationLink>
    </div>
  );
};