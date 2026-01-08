// About page
'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">{t('aboutTodoApp')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('learnMoreAboutOurMission')}
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('ourStory')}</h2>
        <p className="text-muted-foreground mb-4">
          {t('aboutOurCompany')}
        </p>
        <p className="text-muted-foreground">
          {t('aboutOurCompany')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-3">{t('ourMission')}</h3>
          <p className="text-muted-foreground">
            {t('ourMission')}
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-3">{t('ourVision')}</h3>
          <p className="text-muted-foreground">
            {t('ourVision')}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('features')}</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{t('addNewTask')}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{t('todoApp')}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{t('multiLanguage')}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{t('priority')}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{t('todoApp')}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{t('todoApp')}</span>
          </li>
        </ul>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('ourTeam')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold">{"Alex Johnson"}</h3>
            <p className="text-sm text-muted-foreground">{"Frontend Developer"}</p>
          </div>
          <div className="text-center">
            <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold">{"Maria Garcia"}</h3>
            <p className="text-sm text-muted-foreground">{"UI/UX Designer"}</p>
          </div>
          <div className="text-center">
            <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold">{"Samuel Chen"}</h3>
            <p className="text-sm text-muted-foreground">{"Backend Developer"}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-semibold mb-4">{t('aboutOurCompany')}</h2>
        <p className="text-muted-foreground mb-4">
          {t('aboutOurCompany')}
        </p>
        <p className="text-muted-foreground">
          {t('aboutOurCompany')}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;