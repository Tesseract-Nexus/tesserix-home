"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Palette,
  Server,
  Shield,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth/auth-context";

type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) || "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
  localStorage.setItem("theme", theme);
}

function ProfileTab() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {user ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="text-sm font-medium">
                  {user.displayName || user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="text-sm font-medium">
                  {user.firstName || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="text-sm font-medium">
                  {user.lastName || "Not set"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Roles</p>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
                {user.roles.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No roles assigned
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Unable to load user information.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  function handleThemeChange(newTheme: Theme) {
    setTheme(newTheme);
    applyTheme(newTheme);
  }

  const themes: { value: Theme; label: string; icon: React.ElementType }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                  theme === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformTab() {
  const environment =
    process.env.NEXT_PUBLIC_ENVIRONMENT ||
    (typeof window !== "undefined" && window.location.hostname.includes("devtest")
      ? "devtest"
      : "production");

  const links = [
    {
      label: "Manage Billing",
      href: "/admin/apps/mark8ly/billing",
      description: "Subscription plans and invoices",
    },
    {
      label: "Feature Flags",
      href: "/admin/feature-flags",
      description: "Toggle features for tenants",
    },
    {
      label: "Email Templates",
      href: "/admin/email-templates",
      description: "Customize notification emails",
    },
    {
      label: "System Health",
      href: "/admin/system-health",
      description: "Service status and uptime",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Information</CardTitle>
          <CardDescription>Environment and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <Badge
                variant={
                  environment === "production" ? "destructive" : "secondary"
                }
                className="mt-1"
              >
                {environment}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="text-sm font-medium">Tesserix Home</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Management</CardTitle>
          <CardDescription>Quick links to platform settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{link.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {link.description}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityTab() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Your current session information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={isAuthenticated ? "success" : "destructive"}>
                {isAuthenticated ? "Authenticated" : "Not authenticated"}
              </Badge>
            </div>
            {user && (
              <div>
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Session management</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <AdminHeader
        title="Settings"
        description="Manage your account and platform settings"
        icon={<Settings className="h-6 w-6 text-muted-foreground" />}
      />

      <main className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="platform" className="gap-2">
              <Server className="h-4 w-4" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>

          <TabsContent value="platform">
            <PlatformTab />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
