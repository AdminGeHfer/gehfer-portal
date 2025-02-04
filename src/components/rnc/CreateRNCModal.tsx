import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { RNCModalContent } from "./modal/RNCModalContent";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { supabase } from "@/lib/supabase";
import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum, WorkflowStatusEnum } from "@/types/rnc";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRNCFormData, createRNCSchema } from "@/schemas/rncValidation";

interface CreateRNCModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRNCModal({ open, onClose }: CreateRNCModalProps) {
  const [activeTab, setActiveTab] = React.useState("basic");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize form context
  const methods = useForm<CreateRNCFormData>({
    resolver: zodResolver(createRNCSchema),
    mode: "onChange",
    defaultValues: {
      company_code: '',
      company: '',
      document: '',
      description: '',
      type: RncTypeEnum.company_complaint,
      department: RncDepartmentEnum.logistics,
      responsible: '',
      korp: '',
      nfv: '',
      nfd: '',
      city: '',
      attachments: [],
      products: [],
      contacts: []
    }
  });

  React.useEffect(() => {
    if (!open) return;

    // Load saved form data
    const savedData = localStorage.getItem('rncFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      methods.reset(parsedData);
    }
  }, [open, methods]);

  const handleSave = async (formData: CreateRNCFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading('Criando RNC...');
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
  
      // Validate and structure products
      const validatedProducts = formData.products
        .filter(product => product.name && product.weight) // Only include products with required fields
        .map(product => ({
          name: product.name,
          weight: product.weight
        }));
  
      // Validate and structure contacts
      const validatedContacts = formData.contacts
        .filter(contact => contact.name && contact.phone) // Only include contacts with required fields
        .map(contact => ({
          name: contact.name,
          phone: contact.phone,
          email: contact.email || undefined // Make email truly optional
        }));
  
      // Filter out any invalid attachments
      const validAttachments = (formData.attachments || [])
        .filter((file): file is File => file instanceof File);
  
      const rnc = await rncService.create({
        company_code: formData.company_code,
        company: formData.company,
        document: formData.document,
        description: formData.description,
        type: formData.type,
        department: formData.department,
        responsible: formData.responsible,
        korp: formData.korp,
        nfv: formData.nfv,
        nfd: formData.nfd || undefined,
        city: formData.city || undefined,
        status: RncStatusEnum.pending,
        workflow_status: WorkflowStatusEnum.open,
        created_by: user.id,
        assigned_by: user.id,
        created_at: new Date().toISOString(),
        products: validatedProducts,
        contacts: validatedContacts,
        attachments: validAttachments
      });
  
      // Handle attachments upload after RNC creation
      if (validAttachments.length) {
        await Promise.all(validAttachments.map(file => 
          rncService.uploadAttachment(rnc.id, file)
        ));
      }
  
      toast.dismiss(loadingToast);
      toast.success('RNC criada com sucesso!');
      localStorage.removeItem('rncFormData');
      onClose();
    } catch (error) {
      console.error('Error creating RNC:', error);
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar RNC');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-blue-100 pb-4 dark:border-blue-900">
          <div className="flex-1 text-center">
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Criar RNC
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <FormProvider {...methods}>
          <RNCModalContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSave={handleSave}
            isSubmitting={isSubmitting}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
