import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { RNCModalContent } from "./modal/RNCModalContent";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum, WorkflowStatusEnum } from "@/types/rnc";
import { AdditionalInfoFormData } from "./tabs/AdditionalInfoTab";

interface CreateRNCModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabRefs {
  basicInfoRef: React.RefObject<{
    validate: () => Promise<boolean>;
    getFormData: () => {
      company_code: string;
      company: string;
      document: string;
      type: RncTypeEnum;
      department: RncDepartmentEnum;
      responsible: string;
      status: RncStatusEnum;
      workflow_status: WorkflowStatusEnum;
      assigned_by: string;
      assigned_to?: string;
      assigned_at: string;
      created_by: string;
      created_at: string;
      updated_at: string;
    };
    setFormData: (data: any) => void;
  }>;
  additionalInfoRef: React.RefObject<{
    validate: () => Promise<boolean>;
    getFormData: () => AdditionalInfoFormData;
    setFormData: (data: any) => void;
  }>;
  productsRef: React.RefObject<{
    validate: () => Promise<boolean>;
    getFormData: () => Array<{
      id: string;
      rnc_id: string;
      name: string;
      weight: number;
    }>;
    setFormData: (data: any) => void;
  }>;
  contactRef: React.RefObject<{
    validate: () => Promise<boolean>;
    getFormData: () => {
      id: string;
      rnc_id: string;
      name: string;
      phone: string;
      email?: string;
    };
    setFormData: (data: any) => void;
  }>;
  attachmentsRef: React.RefObject<{
    getFiles: () => File[];
    setFormData?: (data: any) => void;
  }>;
}

export function CreateRNCModal({ open, onClose }: CreateRNCModalProps) {
  const [activeTab, setActiveTab] = React.useState("basic");
  
  const refs: TabRefs = {
    basicInfoRef: React.useRef(null),
    additionalInfoRef: React.useRef(null),
    productsRef: React.useRef(null),
    contactRef: React.useRef(null),
    attachmentsRef: React.useRef(null),
  };

  React.useEffect(() => {
    console.log('CreateRNCModal mounted, refs initialized:', refs);
  }, []);

  // Load saved form data when component mounts
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('rncFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Loading saved form data:', parsedData);
        
        Object.entries(refs).forEach(([key, ref]) => {
          const tabKey = key.replace('Ref', '');
          if (ref.current && parsedData[tabKey]) {
            console.log(`Setting ${tabKey} data:`, parsedData[tabKey]);
            ref.current.setFormData?.(parsedData[tabKey]);
          }
        });
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, []);

  const handleSave = async () => {
    const loadingToast = toast.loading('Criando RNC...');
  
    try {
      console.log('Starting form validation...');
      console.log('Current refs:', refs);
  
      // Validate each tab individually with detailed logging
      const validationResults = {
        basic: false,
        additional: false,
        products: false,
        contact: false
      };
  
      // Basic Info Validation
      if (refs.basicInfoRef.current) {
        console.log('Validating basic info...');
        validationResults.basic = await refs.basicInfoRef.current.validate();
        console.log('Basic info validation result:', validationResults.basic);
      }
  
      // Additional Info Validation
      if (refs.additionalInfoRef.current) {
        console.log('Validating additional info...');
        validationResults.additional = await refs.additionalInfoRef.current.validate();
        console.log('Additional info validation result:', validationResults.additional);
      }
  
      // Products Validation
      if (refs.productsRef.current) {
        console.log('Validating products...');
        validationResults.products = await refs.productsRef.current.validate();
        console.log('Products validation result:', validationResults.products);
      }
  
      // Contact Validation
      if (refs.contactRef.current) {
        console.log('Validating contact...');
        validationResults.contact = await refs.contactRef.current.validate();
        console.log('Contact validation result:', validationResults.contact);
      }
  
      console.log('All validation results:', validationResults);
  
      const invalidTabs = Object.entries(validationResults)
        .filter(([_, isValid]) => !isValid)
        .map(([tab]) => tab);
  
      if (invalidTabs.length > 0) {
        console.log('Invalid tabs found:', invalidTabs);
        toast.dismiss(loadingToast);
        toast.error(`Por favor, verifique os campos nas abas: ${invalidTabs.join(', ')}`);
        return;
      }
  
      // Get form data with detailed logging
      console.log('Getting form data...');
      
      const basicData = refs.basicInfoRef.current?.getFormData();
      console.log('Basic data retrieved:', basicData);
  
      const additionalData = refs.additionalInfoRef.current?.getFormData();
      console.log('Additional data retrieved:', additionalData);
  
      const productsData = refs.productsRef.current?.getFormData();
      console.log('Products data retrieved:', productsData);
  
      const contactData = refs.contactRef.current?.getFormData();
      console.log('Contact data retrieved:', contactData);
  
      if (!basicData || !additionalData || !productsData || !contactData) {
        throw new Error('Dados do formulário incompletos');
      }

      // Create RNC using service
      const rnc = await rncService.create({
        ...basicData,
        description: additionalData.description,
        korp: additionalData.korp,
        nfv: additionalData.nfv,
        nfd: additionalData.nfd,
        city: additionalData.city,
        conclusion: additionalData.conclusion,
        products: productsData,
        contacts: [contactData],
      });

      // Upload attachments if any
      const attachmentsData = refs.attachmentsRef.current?.getFiles();
      if (attachmentsData?.length) {
        for (const file of attachmentsData) {
          await rncService.uploadAttachment(rnc.id, file);
        }
      }

      toast.dismiss(loadingToast);
      toast.success('RNC criada com sucesso!');
      localStorage.removeItem('rncFormData');
      onClose();
    } catch (error) {
      console.error('Error creating RNC:', error);
      toast.dismiss(loadingToast);
      toast.error('Erro ao criar RNC');
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

        <RNCModalContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onBack={() => setActiveTab("basic")}
          onNext={() => setActiveTab("additional")}
          onSave={handleSave}
          setProgress={() => {}}
          refs={refs}
        />
      </DialogContent>
    </Dialog>
  );
}
