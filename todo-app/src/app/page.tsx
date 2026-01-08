// Home page
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome to TodoApp
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          A modern and vibrant todo application to help you organize your life, boost productivity, and achieve your goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/todo-app">Get Started</Link>
          </Button>

          <Button variant="outline" asChild size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border glass-effect">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-xl font-semibold mb-2">Easy Task Management</h3>
            <p className="text-muted-foreground">
              Create, update, and manage your tasks with a simple and intuitive interface.
            </p>
          </div>

          <div className="p-6 rounded-lg border glass-effect">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Modern UI</h3>
            <p className="text-muted-foreground">
              Enjoy a beautiful, responsive design with dark/light mode support.
            </p>
          </div>

          <div className="p-6 rounded-lg border glass-effect">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
            <p className="text-muted-foreground">
              Available in English and Urdu to serve a diverse community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
