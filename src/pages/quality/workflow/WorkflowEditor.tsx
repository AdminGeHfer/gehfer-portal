import React from 'react';
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowEditorCanvas } from "@/components/quality/workflow/editor/WorkflowEditorCanvas";

export default function WorkflowEditor() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Editor de Workflow" />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editor de Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowEditorCanvas />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}