"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/admin/dashboard";
  const error = searchParams.get("error");

  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Auto-redirect to auth-bff OIDC login unless there's an error to display
    if (!error) {
      setIsRedirecting(true);
      const loginUrl = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
      window.location.href = loginUrl;
    }
  }, [error, returnTo]);

  function handleLogin() {
    setIsRedirecting(true);
    const loginUrl = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
    window.location.href = loginUrl;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </header>

      {/* Main */}
      <main id="main-content" className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.png" alt="Tesserix" width={121} height={36} />
            </Link>
            <CardTitle className="text-2xl">Admin Portal Login</CardTitle>
            <CardDescription>
              Sign in to manage tenants, tickets, and platform settings.
              <span className="block mt-1 text-xs">
                For Tesserix staff and administrators only.
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive mb-4" role="alert">
                {error === "session_expired"
                  ? "Your session has expired. Please sign in again."
                  : error === "auth_failed"
                    ? "Authentication failed. Please try again."
                    : "An error occurred. Please try again."}
              </div>
            )}

            {isRedirecting ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Sign in
              </button>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Need help?{" "}
                <Link href="/contact" className="text-foreground hover:underline">
                  Contact support
                </Link>
              </p>
            </div>

            {/* Customer login note */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Are you a Mark8ly customer?{" "}
                <a
                  href="https://mark8ly.com/login"
                  className="text-foreground hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to customer portal →
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Tesserix. All rights reserved.</p>
      </footer>
    </div>
  );
}
