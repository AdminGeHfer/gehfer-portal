import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface InitializationErrorProps {
  error: string;
  detailedError: string | null;
  onRetry: () => void;
  onReconfigureKey: () => void;
  isRetrying: boolean;
}

export const InitializationError = ({
  error,
  detailedError,
  onRetry,
  onReconfigureKey,
  isRetrying
}: InitializationErrorProps) => {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Initialization Error</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>{error}</p>
          {detailedError && (
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer">Technical Details</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">
                {detailedError}
              </pre>
            </details>
          )}
          <div className="space-y-2">
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              variant="outline"
              className="w-full"
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </Button>
            <Button
              variant="outline"
              onClick={onReconfigureKey}
              className="w-full"
            >
              <Info className="mr-2 h-4 w-4" />
              Reconfigure OpenAI API Key
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};