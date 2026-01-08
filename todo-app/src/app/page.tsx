// Home page
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className=" mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block p-1 mb-6 rounded-full bg-gradient-to-r from-primary to-blue-500">
          <div className="bg-background rounded-full px-4 py-1.5">
            <span className="text-sm font-medium text-primary">{t("newFeature")}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-5 pb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          {t("welcomeToTodoApp")}
        </h1>

        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          {t("modernAndVibrantTodoApp")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/todo-app" className="flex items-center gap-2">
              <span>🚀</span>
              {t("getStarted")}
            </Link>
          </Button>

          <Button variant="outline" asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/about" className="flex items-center gap-2">
              <span>ℹ️</span>
              {t("learnMore")}
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="p-4 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <div className="text-2xl">📝</div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold mb-3">
              {t("easyTaskManagement")}
            </h3>
            <p className="text-muted-foreground text-sm lg:text-base">{t("createAndUpdateTasks")}</p>
          </div>

          <div className="p-4 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <div className="text-2xl">🎨</div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold mb-3">{t("modernUI")}</h3>
            <p className="text-muted-foreground text-sm lg:text-base">{t("enjoyBeautifulDesign")}</p>
          </div>

          <div className="p-4 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <div className="text-2xl">🌐</div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold mb-3">{t("multiLanguage")}</h3>
            <p className="text-muted-foreground text-sm lg:text-base">
              {t("availableInEnglishAndUrdu")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
