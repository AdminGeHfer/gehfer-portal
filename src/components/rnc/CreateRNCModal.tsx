import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { AdditionalInfoTab } from "./tabs/AdditionalInfoTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { ContactTab } from "./tabs/ContactTab";
import { AttachmentsTab } from "./tabs/AttachmentsTab";

interface CreateRNCModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRNCModal({ open, onClose }: CreateRNCModalProps) {
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-blue-100 pb-4 dark:border-blue-900">
          <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">Criar RNC</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-blue-50 dark:bg-blue-900/50">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="additional">Informações Complementares</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="attachments">Anexos</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoTab setProgress={setProgress} />
          </TabsContent>

          <TabsContent value="additional">
            <AdditionalInfoTab setProgress={setProgress} />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab setProgress={setProgress} />
          </TabsContent>

          <TabsContent value="contact">
            <ContactTab setProgress={setProgress} />
          </TabsContent>

          <TabsContent value="attachments">
            <AttachmentsTab setProgress={setProgress} />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <p className="text-sm text-blue-600 dark:text-blue-400">* Campos obrigatórios</p>
          <Progress value={progress} className="h-2 bg-blue-100 dark:bg-blue-900" />
        </div>
      </DialogContent>
    </Dialog>
  );
}