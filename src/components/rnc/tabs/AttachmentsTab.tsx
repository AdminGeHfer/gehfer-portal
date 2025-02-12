import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FileUploadField } from "@/components/rnc/FileUploadField";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AttachmentsTab = () => {
  const { setValue, watch } = useFormContext();
  const attachments = watch('attachments');
  const files: File[] = Array.isArray(attachments) ? attachments : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const newFile = e.target.files[0];
        const currentFiles = Array.isArray(files) ? files : [];
        setValue('attachments', [...currentFiles, newFile], { 
          shouldValidate: true,
          shouldDirty: true 
        });
      }
    } catch (error) {
      console.error('Error handling file change:', error);
    }
  };

  const removeFile = (index: number) => {
    try {
      const currentFiles = Array.isArray(files) ? files : [];
      setValue(
        'attachments', 
        currentFiles.filter((_: File, i: number) => i !== index),
        { shouldValidate: true }
      );
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
          attachments: files
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
        accept=".pdf,.jpg,.jpeg,.png,.mp4,.mpeg,.ogg,.webm"
      />

      <div className="space-y-2">
        {Array.isArray(files) && files.map((file: File, index: number) => (
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
};