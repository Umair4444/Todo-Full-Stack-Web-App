// Home page
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          {t("welcomeToTodoApp")}
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          {t("modernAndVibrantTodoApp")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/todo-app">{t("getStarted")}</Link>
          </Button>

          <Button variant="outline" asChild size="lg">
            <Link href="/about">{t("learnMore")}</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border glass-effect">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              {t("easyTaskManagement")}
            </h3>
            <p className="text-muted-foreground">{t("createAndUpdateTasks")}</p>
          </div>

          <div className="p-6 rounded-lg border glass-effect">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold mb-2">{t("modernUI")}</h3>
            <p className="text-muted-foreground">{t("enjoyBeautifulDesign")}</p>
          </div>

          <div className="p-6 rounded-lg border glass-effect">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-xl font-semibold mb-2">{t("multiLanguage")}</h3>
            <p className="text-muted-foreground">
              {t("availableInEnglishAndUrdu")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
