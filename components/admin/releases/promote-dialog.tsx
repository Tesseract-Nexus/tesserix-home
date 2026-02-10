"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { VersionChips } from "./version-chips";
import { promoteService, type ServiceInfo } from "@/lib/api/releases";

interface PromoteDialogProps {
  service: ServiceInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function bumpPatch(version: string): string {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return "";
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function PromoteDialog({
  service,
  open,
  onOpenChange,
  onSuccess,
}: PromoteDialogProps) {
  const currentVersion = service?.latestRelease?.version ?? null;
  const defaultVersion =
    currentVersion && /^\d+\.\d+\.\d+$/.test(currentVersion)
      ? bumpPatch(currentVersion)
      : "";

  const [version, setVersion] = useState(defaultVersion);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    version: string;
    repo: string;
  } | null>(null);

  // Reset state when dialog opens with new service
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const v =
        currentVersion && /^\d+\.\d+\.\d+$/.test(currentVersion)
          ? bumpPatch(currentVersion)
          : "";
      setVersion(v);
      setError(null);
      setSuccessInfo(null);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async () => {
    if (!service || !version) return;

    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      setError("Version must be in semver format (e.g. 1.2.3)");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await promoteService(service.name, version);

    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSuccessInfo({ version: result.data.version, repo: result.data.repo });
      onSuccess();
    }
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Promote {service.displayName}</DialogTitle>
          <DialogDescription>
            Trigger a release build via workflow_dispatch
          </DialogDescription>
        </DialogHeader>

        {successInfo ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-sm font-medium">
              Release v{successInfo.version} triggered
            </p>
            <a
              href={`https://github.com/${successInfo.repo}/actions`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View in GitHub Actions
              <ExternalLink className="h-3 w-3" />
            </a>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="mt-2"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {/* Current version */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Current release:</span>
                {currentVersion ? (
                  <Badge variant="outline" className="font-mono">
                    v{currentVersion}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </div>

              {/* Version input */}
              <div className="space-y-2">
                <Label htmlFor="version">New Version</Label>
                <Input
                  id="version"
                  placeholder="1.2.3"
                  value={version}
                  onChange={(e) => {
                    setVersion(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  className="font-mono"
                />
              </div>

              {/* Suggestion chips */}
              <VersionChips
                currentVersion={currentVersion}
                onSelect={setVersion}
              />

              {/* Error */}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!version || isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Promote
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
