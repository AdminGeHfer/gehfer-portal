import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadFieldProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  value?: File | null;
  accept?: string;
}

export function FileUploadField({ 
  label, 
  onChange, 
  onRemove, 
  value, 
  accept = "image/*" 
}: FileUploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/50">
        <Input
          type="file"
          onChange={onChange}
          accept={accept}
          className="hidden"
          id={`file-${label}`}
        />
        <label 
          htmlFor={`file-${label}`} 
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {value ? (
            <div className="flex items-center justify-between w-full p-2 bg-background rounded">
              <span className="text-sm truncate flex-1">{value.name}</span>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground text-center">
                Clique ou arraste a foto aqui
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
}