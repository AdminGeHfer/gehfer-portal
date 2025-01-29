import * as React from "react";
import { useState } from "react";
import { FileUploadField } from "@/components/portaria/FileUploadField";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentsTabProps {
  setProgress: (progress: number) => void;
}

export type AttachmentsTabRef = {
  getFiles: () => File[];
};

export const AttachmentsTab = React.forwardRef<AttachmentsTabRef, AttachmentsTabProps>(
  ({ setProgress }, ref) => {
    const [files, setFiles] = useState<File[]>([]);

    React.useImperativeHandle(ref, () => ({
      getFiles: () => files
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const newFile = e.target.files[0];
        setFiles([...files, newFile]);
        setProgress(files.length > 0 ? 100 : 0);
      }
    };

    const removeFile = (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      setProgress(newFiles.length > 0 ? 100 : 0);
    };

    return (
      <div className="space-y-4 py-4">
        <FileUploadField
          label="Anexar arquivo"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border border-blue-200 p-2"
            >
              <span className="text-sm text-blue-900 dark:text-blue-100">
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
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
);

AttachmentsTab.displayName = "AttachmentsTab";