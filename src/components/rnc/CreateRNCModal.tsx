import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { RNCModalContent } from "./modal/RNCModalContent";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { BasicInfoTab, BasicInfoTabRef } from "./tabs/BasicInfoTab";
import { AdditionalInfoTab, AdditionalInfoTabRef } from "./tabs/AdditionalInfoTab";
import { ProductsTab, ProductsTabRef } from "./tabs/ProductsTab";
import { ContactTab, ContactTabRef } from "./tabs/ContactTab";
import { AttachmentsTab, AttachmentsTabRef } from "./tabs/AttachmentsTab";
import { supabase } from "@/lib/supabase";
import { RncStatusEnum, WorkflowStatusEnum, CreateRNCProduct, CreateRNCContact } from "@/types/rnc";

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

  type ValidatableTabRef = BasicInfoTabRef | AdditionalInfoTabRef | ProductsTabRef | ContactTabRef;
  
  // Use useRef instead of createRef to persist refs between renders
  const refs = React.useRef<TabRefs>({
    basicInfoRef: React.createRef<BasicInfoTabRef>(),
    additionalInfoRef: React.createRef<AdditionalInfoTabRef>(),
    productsRef: React.createRef<ProductsTabRef>(),
    contactRef: React.createRef<ContactTabRef>(),
    attachmentsRef: React.createRef<AttachmentsTabRef>()
  });

  // Keep track of mounted status
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Load saved form data when component mounts
  React.useEffect(() => {
    if (!mounted) return;

    try {
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
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, [mounted]);

  const validateTab = async (ref: React.RefObject<ValidatableTabRef>, tabName: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!ref.current) {
        console.error(`${tabName} ref is null`);
        resolve(false);
        return;
      }

      // Use setTimeout to ensure validation happens after render
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
    const loadingToast = toast.loading('Criando RNC...');
  
    try {
      console.log('Starting form validation...');

      // Wait for next render cycle before validating
      await new Promise(resolve => setTimeout(resolve, 0));

      // Validate all tabs sequentially
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

      // Get form data with proper null checks
      const basicData = refs.current.basicInfoRef.current?.getFormData();
      if (!basicData) throw new Error('Dados básicos não encontrados');
  
      const additionalData = refs.current.additionalInfoRef.current?.getFormData();
      if (!additionalData) throw new Error('Dados adicionais não encontrados');
  
      const productsData = refs.current.productsRef.current?.getFormData();
      if (!productsData) throw new Error('Dados dos produtos não encontrados');
  
      const contactData = refs.current.contactRef.current?.getFormData();
      if (!contactData) throw new Error('Dados de contato não encontrados');
  
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
  
      // Transform products to match RNCProduct type
      const transformedProducts: CreateRNCProduct[] = productsData.map(product => ({
        name: product.name || '',
        weight: product.weight || 0
      }));
  
      // Transform contact to match RNCContact type
      const transformedContact: CreateRNCContact = {
        name: contactData.name || '',
        phone: contactData.phone || '',
        email: contactData.email
      };
  
      // Create RNC with transformed data
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
        products: transformedProducts,
        contacts: [transformedContact],
        status: RncStatusEnum.pending,
        workflow_status: WorkflowStatusEnum.open,
        created_by: user.id,
        assigned_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Handle attachments after RNC is created
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

        {/* Keep all tabs mounted but hidden */}
        <div style={{ display: 'none' }}>
          <BasicInfoTab setProgress={() => {}} ref={refs.current.basicInfoRef} />
          <AdditionalInfoTab setProgress={() => {}} ref={refs.current.additionalInfoRef} />
          <ProductsTab setProgress={() => {}} ref={refs.current.productsRef} />
          <ContactTab setProgress={() => {}} ref={refs.current.contactRef} />
          <AttachmentsTab setProgress={() => {}} ref={refs.current.attachmentsRef} />
        </div>

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

