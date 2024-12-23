import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RetryButtonProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export const RetryButton = ({ onRetry, isRetrying }: RetryButtonProps) => {
  return (
    <Button 
      onClick={onRetry} 
      disabled={isRetrying}
      variant="outline"
      className="mt-4"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
      {isRetrying ? 'Retrying...' : 'Retry'}
    </Button>
  );
};