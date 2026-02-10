"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get("returnTo") || "/admin/dashboard";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/direct/platform/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.error === "RATE_LIMITED") {
          setLoginError("Too many login attempts. Please try again later.");
        } else if (data.error === "INVALID_CREDENTIALS" || data.error === "AUTH_FAILED") {
          setLoginError("Invalid email or password.");
        } else if (data.error === "SERVICE_CONFIG_ERROR") {
          setLoginError("Authentication service error. Please contact support.");
        } else {
          setLoginError(data.message || "Authentication failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Login successful — redirect to dashboard
      router.push(returnTo);
    } catch {
      setLoginError("Unable to connect to authentication service. Please try again.");
      setIsLoading(false);
    }
  }

  const displayError = loginError || (error === "session_expired"
    ? "Your session has expired. Please sign in again."
    : error === "auth_failed"
      ? "Authentication failed. Please try again."
      : error
        ? "An error occurred. Please try again."
        : null);

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
            {displayError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive mb-4" role="alert">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tesserix.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

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
