import * as React from "react";
import { useState } from "react";
import { FileUploadField } from "@/components/portaria/FileUploadField";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentsTabProps {
  setProgress: (progress: number) => void;
}

interface FileItem {
  id: string;
  file: File;
}

export function AttachmentsTab({ setProgress }: AttachmentsTabProps) {
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = {
        id: Math.random().toString(),
        file: e.target.files[0],
      };
      setFiles([...files, newFile]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  React.useEffect(() => {
    setProgress(files.length > 0 ? 100 : 0);
  }, [files, setProgress]);

  return (
    <div className="space-y-4 py-4">
      <FileUploadField
        label="Anexar arquivo"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-md border border-blue-200 p-2"
          >
            <span className="text-sm text-blue-900 dark:text-blue-100">
              {file.file.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(file.id)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}