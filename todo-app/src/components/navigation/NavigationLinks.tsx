// Navigation links component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();

  return (
    <div className={`flex ${flexDirection} ${spacing}`}>
      <NavigationLink href="/">{t('home')}</NavigationLink>
      <NavigationLink href="/todo-app">{t('todoApp')}</NavigationLink>
      <NavigationLink href="/about">{t('about')}</NavigationLink>
      <NavigationLink href="/contact">{t('contact')}</NavigationLink>
    </div>
  );
};