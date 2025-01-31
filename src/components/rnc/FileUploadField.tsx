import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface FileUploadFieldProps {
label?: string;
accept?: string;
onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
onFileSelect?: (file: File) => void;
maxSize?: number;
loading?: boolean;
}

export const FileUploadField = React.forwardRef<HTMLInputElement, FileUploadFieldProps>(
({ label, accept, onChange }, ref) => {

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="file">{label}</Label>
      <div className="relative">
        <Input
          id="file"
          type="file"
          ref={ref}
          accept={accept}
          onChange={onChange}
          className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
        />
        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Clique ou arraste um arquivo
          </span>
        </div>
      </div>
    </div>
  );
}

);

FileUploadField.displayName = "FileUploadField";