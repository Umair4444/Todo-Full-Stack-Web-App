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
  isVertical?: boolean;
  onCloseMenu?: () => void; // Callback to close the mobile menu
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ href, children, className = '', isVertical = false, onCloseMenu }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Use larger text and padding for vertical (mobile) orientation
  const textSize = isVertical ? 'text-lg' : 'text-sm';
  const paddingClass = isVertical ? 'px-6 py-4' : 'px-3 py-2';

  const handleClick = () => {
    if (onCloseMenu) {
      onCloseMenu();
    }
  };

  return (
    <Link
      href={href}
      className={`${paddingClass} ${textSize} rounded-md font-medium transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-accent'
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

interface NavigationLinksProps {
  orientation?: 'horizontal' | 'vertical';
  onCloseMenu?: () => void; // Callback to close the mobile menu
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({
  orientation = 'horizontal',
  onCloseMenu
}) => {
  const flexDirection = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
  const spacing = orientation === 'horizontal' ? 'space-x-1' : 'space-y-2'; // Increased vertical spacing
  const isVertical = orientation === 'vertical';
  const { t } = useTranslation();

  return (
    <div className={`flex ${flexDirection} ${spacing}`}>
      <NavigationLink href="/" isVertical={isVertical} onCloseMenu={onCloseMenu}>{t('home')}</NavigationLink>
      <NavigationLink href="/todo-app" isVertical={isVertical} onCloseMenu={onCloseMenu}>{t('todoApp')}</NavigationLink>
      <NavigationLink href="/about" isVertical={isVertical} onCloseMenu={onCloseMenu}>{t('about')}</NavigationLink>
      <NavigationLink href="/contact" isVertical={isVertical} onCloseMenu={onCloseMenu}>{t('contact')}</NavigationLink>
    </div>
  );
};