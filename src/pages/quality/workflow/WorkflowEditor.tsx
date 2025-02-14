import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowEditorCanvas } from "@/components/quality/workflow/editor/WorkflowEditorCanvas";
import { Button } from "@/components/ui/button";

export default function WorkflowEditor() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Editor do Fluxo de Notificações" />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editor do Fluxo de Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowEditorCanvas />
          </CardContent>
        </Card>
      </main>
      
      <footer className="fixed bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex justify-center items-center bg-background/80 backdrop-blur-sm gap-3">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://admingehfer.github.io/gehfer-portal-docs/license" rel="noreferrer" target="_blank"> © 2025 GeHfer </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://admingehfer.github.io/gehfer-portal-docs" rel="noreferrer" target="_blank"> Sobre </a>
          </Button>
        </div>
      </footer>
    </div>
  );
}