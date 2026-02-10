"use client";

import Link from "next/link";
import { Lock, MoreHorizontal, Pencil, Copy, Send, Trash2, Variable } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type EmailTemplate, type TemplateStatus } from "@/lib/api/email-templates";

function statusVariant(status: TemplateStatus): "success" | "destructive" | "secondary" {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "destructive";
    case "draft":
    default:
      return "secondary";
  }
}

interface TemplateCardProps {
  template: EmailTemplate;
  basePath: string;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TemplateCard({ template, basePath, onDuplicate, onDelete }: TemplateCardProps) {
  const isSystem = template.is_system;
  const variableCount = template.variables?.length || 0;

  return (
    <div
      className={`rounded-lg border p-4 transition-colors hover:bg-muted/30 ${
        isSystem ? "bg-muted/20 border-muted" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isSystem && <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
            <Link
              href={`${basePath}/${template.id}`}
              className="font-medium text-sm hover:underline truncate"
            >
              {template.name}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-1">
            {template.subject || "No subject"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={statusVariant(template.status)} className="text-[10px] px-1.5 py-0">
              {template.status}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {template.type}
            </Badge>
            {isSystem && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                System
              </Badge>
            )}
            {variableCount > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Variable className="h-3 w-3" />
                {variableCount}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/${template.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                {isSystem ? "View" : "Edit"}
              </Link>
            </DropdownMenuItem>
            {onDuplicate && (
              <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/${template.id}?test=true`}>
                <Send className="mr-2 h-4 w-4" />
                Test Send
              </Link>
            </DropdownMenuItem>
            {!isSystem && onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(template.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
