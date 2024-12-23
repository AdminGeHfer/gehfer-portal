import { Progress } from "@/components/ui/progress";

interface InitializationProgressProps {
  stage: string;
  progress: number;
}

export const InitializationProgress = ({ stage, progress }: InitializationProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{stage}</span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};