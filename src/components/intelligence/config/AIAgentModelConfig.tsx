import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface AIAgentModelConfigProps {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  stopSequences: string[];
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  onTopPChange: (value: number) => void;
  onTopKChange: (value: number) => void;
  onStopSequencesChange: (value: string[]) => void;
}

export const AIAgentModelConfig = ({
  temperature,
  maxTokens,
  topP,
  topK,
  stopSequences,
  onTemperatureChange,
  onMaxTokensChange,
  onTopPChange,
  onTopKChange,
  onStopSequencesChange,
}: AIAgentModelConfigProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Temperatura ({temperature})</Label>
        <Slider
          value={[temperature]}
          onValueChange={([value]) => onTemperatureChange(value)}
          min={0}
          max={2}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <Label>Máximo de Tokens</Label>
        <Input
          type="number"
          value={maxTokens}
          onChange={(e) => onMaxTokensChange(Number(e.target.value))}
          min={1}
          max={32000}
        />
      </div>

      <div className="space-y-2">
        <Label>Top P ({topP})</Label>
        <Slider
          value={[topP]}
          onValueChange={([value]) => onTopPChange(value)}
          min={0}
          max={1}
          step={0.05}
        />
      </div>

      <div className="space-y-2">
        <Label>Top K</Label>
        <Input
          type="number"
          value={topK}
          onChange={(e) => onTopKChange(Number(e.target.value))}
          min={1}
          max={100}
        />
      </div>

      <div className="space-y-2">
        <Label>Sequências de Parada</Label>
        <Input
          value={stopSequences.join(", ")}
          onChange={(e) => onStopSequencesChange(e.target.value.split(", "))}
          placeholder="Ex: stop, end, finish"
        />
      </div>
    </div>
  );
};