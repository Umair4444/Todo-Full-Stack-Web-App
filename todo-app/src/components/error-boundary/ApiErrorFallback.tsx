// src/components/error-boundary/ApiErrorFallback.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

interface Props {
  error: Error;
  resetError: () => void;
}

const ApiErrorFallback: React.FC<Props> = ({ error, resetError }) => {
  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          API Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Failed to load data: {error.message}
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={resetError} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Request
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiErrorFallback;