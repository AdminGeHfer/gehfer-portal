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
  setFormData: (data: { files?: File[] }) => void;
};

export const AttachmentsTab = React.forwardRef<AttachmentsTabRef, AttachmentsTabProps>(
  ({ setProgress }, ref) => {
    const [files, setFiles] = useState<File[]>([]);

    React.useImperativeHandle(ref, () => ({
      getFiles: () => {
        console.log('Getting attachment files:', files);
        return files;
      },
      setFormData: (data: { files?: File[] }) => {
        try {
          console.log('Setting attachment files:', data.files);
          if (data.files) {
            setFiles(data.files);
            setProgress(data.files.length > 0 ? 100 : 0);
          }
        } catch (error) {
          console.error('Error setting attachment files:', error);
        }
      }
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files && e.target.files[0]) {
          const newFile = e.target.files[0];
          console.log('New file selected:', newFile.name);
          setFiles(prev => {
            const updated = [...prev, newFile];
            setProgress(updated.length > 0 ? 100 : 0);
            return updated;
          });
        }
      } catch (error) {
        console.error('Error handling file change:', error);
      }
    };

    const removeFile = (index: number) => {
      try {
        console.log('Removing file at index:', index);
        setFiles(prev => {
          const updated = prev.filter((_, i) => i !== index);
          setProgress(updated.length > 0 ? 100 : 0);
          return updated;
        });
      } catch (error) {
        console.error('Error removing file:', error);
      }
    };

    React.useEffect(() => {
      try {
        const currentData = localStorage.getItem('rncFormData');
        if (currentData) {
          const parsedData = JSON.parse(currentData);
          localStorage.setItem('rncFormData', JSON.stringify({
            ...parsedData,
            attachments: { files }
          }));
        }
      } catch (error) {
        console.error('Error saving attachments data:', error);
      }
    }, [files]);

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
