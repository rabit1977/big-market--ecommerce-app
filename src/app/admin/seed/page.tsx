"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAction, useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function SeedPage() {
  const seedAction = useAction(api.seedMacedonian.seedMacedonianCategories);
  const count = useQuery(api.seedSelected.getCount);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number; message?: string } | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await seedAction();
      setResult(res);
    } catch (err: any) {
      setResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card className="border-2">
        <CardHeader>
          <CardTitle>System Seeding</CardTitle>
          <CardDescription>
            Populate the database with the selected Google Product Taxonomy (Animals & Apparel).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Current Categories</p>
              <p className="text-2xl font-bold">{count ?? "..."}</p>
            </div>
            <Button 
              onClick={handleSeed} 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Start Seeding"
              )}
            </Button>
          </div>

          {result && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${result.success ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
              {result.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Seeded {result.count} categories and linked parents.</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-semibold">Failed</p>
                    <p className="text-sm">{result.message}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
