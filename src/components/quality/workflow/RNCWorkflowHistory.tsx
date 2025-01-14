import React from "react";
import { RNCTimeline } from "../RNCTimeline";

interface RNCWorkflowHistoryProps {
  rncId: string;
}

export function RNCWorkflowHistory({ rncId }: RNCWorkflowHistoryProps) {
  return <RNCTimeline rncId={rncId} />;
}