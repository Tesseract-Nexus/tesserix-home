"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-semibold text-foreground">Error</h1>
          <h2 className="text-2xl font-medium text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          {/* Temporary: show error details for debugging */}
          <div className="mt-4 max-w-lg mx-auto text-left rounded-lg bg-muted p-4 text-xs font-mono overflow-auto max-h-48">
            <p className="text-destructive font-semibold">{error.message}</p>
            {error.stack && (
              <pre className="mt-2 text-muted-foreground whitespace-pre-wrap break-words">{error.stack}</pre>
            )}
          </div>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
