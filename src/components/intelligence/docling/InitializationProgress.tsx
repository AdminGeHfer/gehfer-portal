import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Stage {
  name: string;
  weight: number;
}

interface InitializationProgressProps {
  stage: string;
  progress: number;
  stages: Stage[];
}

export const InitializationProgress = ({ stage, progress, stages }: InitializationProgressProps) => {
  const getStageStatus = (stageName: string) => {
    const currentStageIndex = stages.findIndex(s => s.name === stage);
    const thisStageIndex = stages.findIndex(s => s.name === stageName);
    
    if (progress === 100) return 'completed';
    if (thisStageIndex < currentStageIndex) return 'completed';
    if (thisStageIndex === currentStageIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{stage}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      
      <div className="space-y-2">
        {stages.map((s, index) => {
          const status = getStageStatus(s.name);
          return (
            <div key={index} className="flex items-center space-x-2">
              {status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {status === 'current' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
              {status === 'pending' && <Circle className="h-4 w-4 text-gray-300" />}
              <span className={`text-sm ${
                status === 'completed' ? 'text-green-500' :
                status === 'current' ? 'text-blue-500' :
                'text-gray-500'
              }`}>
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};