// 404 page
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">{t('pageNotFound')}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {t('pageNotFoundDescription')}
      </p>
      <Button asChild>
        <Link href="/">{t('goBackHome')}</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;