import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { RNCModalContent } from "./modal/RNCModalContent";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { BasicInfoTabRef } from "./tabs/BasicInfoTab";
import { AdditionalInfoTabRef } from "./tabs/AdditionalInfoTab";
import { ProductsTabRef } from "./tabs/ProductsTab";
import { ContactTabRef } from "./tabs/ContactTab";
import { AttachmentsTabRef } from "./tabs/AttachmentsTab";
import { supabase } from "@/lib/supabase";
import { RncStatusEnum, WorkflowStatusEnum } from "@/types/rnc";

interface CreateRNCModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabRefs {
  basicInfoRef: React.RefObject<BasicInfoTabRef>;
  additionalInfoRef: React.RefObject<AdditionalInfoTabRef>;
  productsRef: React.RefObject<ProductsTabRef>;
  contactRef: React.RefObject<ContactTabRef>;
  attachmentsRef: React.RefObject<AttachmentsTabRef>;
}

export function CreateRNCModal({ open, onClose }: CreateRNCModalProps) {
  const [activeTab, setActiveTab] = React.useState("basic");
  const [isReady, setIsReady] = React.useState(false);

  type ValidatableTabRef = BasicInfoTabRef | AdditionalInfoTabRef | ProductsTabRef | ContactTabRef;
  
  const refs = React.useRef<TabRefs>({
    basicInfoRef: React.createRef<BasicInfoTabRef>(),
    additionalInfoRef: React.createRef<AdditionalInfoTabRef>(),
    productsRef: React.createRef<ProductsTabRef>(),
    contactRef: React.createRef<ContactTabRef>(),
    attachmentsRef: React.createRef<AttachmentsTabRef>()
  });

  const validateRefs = () => {
    console.log('Validating refs:', {
      basicInfoRef: !!refs.current.basicInfoRef.current,
      additionalInfoRef: !!refs.current.additionalInfoRef.current,
      productsRef: !!refs.current.productsRef.current,
      contactRef: !!refs.current.contactRef.current,
      attachmentsRef: !!refs.current.attachmentsRef.current
    });
    
    return Object.values(refs.current).every(ref => !!ref.current);
  };

  const [, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const initializeForm = async () => {
      try {
        console.log('Initializing form...');
        
        // Wait for refs to be ready
        const checkRefs = setInterval(() => {
          if (validateRefs()) {
            clearInterval(checkRefs);
            setIsReady(true);
            
            // Load saved data
            const savedData = localStorage.getItem('rncFormData');
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              console.log('Loading saved form data:', parsedData);
              
              Object.entries(refs.current).forEach(([key, ref]) => {
                const tabKey = key.replace('Ref', '');
                if (ref.current && parsedData[tabKey]) {
                  console.log(`Setting ${tabKey} data:`, parsedData[tabKey]);
                  ref.current.setFormData?.(parsedData[tabKey]);
                }
              });
            }
          }
        }, 100);

        // Cleanup interval after 5 seconds if refs aren't ready
        setTimeout(() => clearInterval(checkRefs), 5000);
      } catch (error) {
        console.error('Error initializing form:', error);
      }
    };

    initializeForm();
  }, [open]);

  const validateTab = async (ref: React.RefObject<ValidatableTabRef>, tabName: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!ref.current) {
        console.error(`${tabName} ref is null`);
        resolve(false);
        return;
      }

      setTimeout(async () => {
        try {
          console.log(`Validating ${tabName}...`);
          const result = await ref.current?.validate();
          console.log(`${tabName} validation result:`, result);
          resolve(result || false);
        } catch (error) {
          console.error(`Error validating ${tabName}:`, error);
          resolve(false);
        }
      }, 0);
    });
  };

  const handleSave = async () => {
    if (!isReady) {
      console.error('Form not ready for submission');
      toast.error('Formulário não está pronto para envio');
      return;
    }

    const loadingToast = toast.loading('Criando RNC...');
  
    try {
      console.log('Starting form submission...', {
        refsState: refs.current,
        isReady
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      const validationResults = {
        basic: await validateTab(refs.current.basicInfoRef, 'basic'),
        additional: await validateTab(refs.current.additionalInfoRef, 'additional'),
        products: await validateTab(refs.current.productsRef, 'products'),
        contact: await validateTab(refs.current.contactRef, 'contact')
      };

      console.log('Validation results:', validationResults);

      const invalidTabs = Object.entries(validationResults)
        .filter(([, isValid]) => !isValid)
        .map(([tab]) => tab);

      if (invalidTabs.length > 0) {
        console.log('Invalid tabs found:', invalidTabs);
        toast.dismiss(loadingToast);
        toast.error(`Por favor, verifique os campos nas abas: ${invalidTabs.join(', ')}`);
        return;
      }

      const basicData = refs.current.basicInfoRef.current?.getFormData();
      if (!basicData) throw new Error('Dados básicos não encontrados');
  
      const additionalData = refs.current.additionalInfoRef.current?.getFormData();
      if (!additionalData) throw new Error('Dados adicionais não encontrados');
  
      const productsData = refs.current.productsRef.current?.getFormData();
      if (!productsData) throw new Error('Dados dos produtos não encontrados');
  
      const contactData = refs.current.contactRef.current?.getFormData();
      if (!contactData) throw new Error('Dados de contato não encontrados');
  
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const rnc = await rncService.create({
        company_code: basicData.company_code,
        company: basicData.company,
        document: basicData.document,
        type: basicData.type,
        department: basicData.department,
        responsible: basicData.responsible,
        description: additionalData.description,
        korp: additionalData.korp,
        nfv: additionalData.nfv,
        nfd: additionalData.nfd,
        city: additionalData.city,
        conclusion: additionalData.conclusion,
        products: productsData,
        contacts: [contactData],
        status: RncStatusEnum.pending,
        workflow_status: WorkflowStatusEnum.open,
        created_by: user.id,
        assigned_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      const attachmentsData = refs.current.attachmentsRef.current?.getFiles();
      if (attachmentsData?.length) {
        await Promise.all(attachmentsData.map(file => 
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
    }
  };

    // Only render content when ready
    if (!isReady && open) {
      return (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <div>Carregando formulário...</div>
          </DialogContent>
        </Dialog>
      );
    }

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

        <RNCModalContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSave={handleSave}
          setProgress={() => {}}
          refs={refs.current}
        />
      </DialogContent>
    </Dialog>
  );
}