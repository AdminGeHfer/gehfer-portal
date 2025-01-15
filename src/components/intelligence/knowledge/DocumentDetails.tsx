import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentVersionList } from "./DocumentVersionList";
import { DocumentChunks } from "./DocumentChunks";
import { useState } from "react";
import * as React from "react";

interface DocumentDetailsProps {
  documentId: string;
}

export function DocumentDetails({ documentId }: DocumentDetailsProps) {
  const [activeTab, setActiveTab] = useState("chunks");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="chunks">Chunks Semânticos</TabsTrigger>
        <TabsTrigger value="versions">Versões</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chunks" className="mt-4">
        <DocumentChunks documentId={documentId} />
      </TabsContent>
      
      <TabsContent value="versions" className="mt-4">
        <DocumentVersionList 
          documentId={documentId}
          onVersionChange={() => setActiveTab("chunks")}
        />
      </TabsContent>
    </Tabs>
  );
}