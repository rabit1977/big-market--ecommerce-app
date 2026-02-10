'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';

export default function MigrationPage() {
  const backfillCreatedAt = useMutation(api.users.backfillCreatedAt);
  const [result, setResult] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runMigration = async () => {
    setIsRunning(true);
    try {
      const response = await backfillCreatedAt();
      setResult(response.message);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-black mb-4">Database Migration</h1>
        <p className="text-muted-foreground mb-6">
          This will add the <code className="bg-muted px-2 py-1 rounded">createdAt</code> field to all users who don't have it.
        </p>
        
        <Button 
          onClick={runMigration} 
          disabled={isRunning}
          className="w-full h-12 text-lg font-bold"
        >
          {isRunning ? 'Running Migration...' : 'Run Migration'}
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-bold">{result}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Note:</strong> After running this migration, refresh your listing page to see the correct "Member since" date.
          </p>
        </div>
      </div>
    </div>
  );
}
