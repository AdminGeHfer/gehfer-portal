import { supabase } from '@/lib/supabase';
import { 
  CreateRNCInput, 
  RncStatusEnum, 
  WorkflowStatusEnum, 
  type RNC, 
  type RNCAttachment,
  type CreateRNCProduct,
  type CreateRNCContact,
} from '@/types/rnc';

// Custom error classes for better error handling
export class RNCError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'RNCError';
  }
}

export class ValidationError extends RNCError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

// Validation functions
const validateDocument = (document: string): boolean => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  const cpfNoFormat = /^\d{11}$/;
  const cnpjNoFormat = /^\d{14}$/;
  
  return cpfRegex.test(document) || 
         cnpjRegex.test(document) || 
         cpfNoFormat.test(document) || 
         cnpjNoFormat.test(document);
};

const validateAttachment = (file: File): void => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  
  if (file.size > MAX_SIZE) {
    throw new ValidationError('Arquivo muito grande. Máximo permitido: 10MB');
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError('Tipo de arquivo não permitido. Use: JPG, PNG ou PDF');
  }
};

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^\x20-\x7E]/g, '');
};

export const rncService = {
  async create(data: CreateRNCInput): Promise<RNC> {
    console.log('Data received in rncService:',data);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new RNCError('Usuário não autenticado');

      // Validate document
      if (!validateDocument(data.document)) {
        throw new ValidationError('Formato de documento inválido');
      }

      // Start transaction for RNC creation
      const { data: rncData, error: rncError } = await supabase
        .from('rncs')
        .insert([{
          company_code: data.company_code,
          company: data.company,
          document: data.document,
          description: data.description,
          type: data.type,
          department: data.department,
          responsible: data.responsible,
          korp: data.korp,
          nfv: data.nfv,
          nfd: data.nfd,
          status: RncStatusEnum.pending,
          workflow_status: WorkflowStatusEnum.open,
          assigned_by: user.id,
          assigned_at: new Date().toISOString(),
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (rncError) throw new RNCError(`Error creating RNC: ${rncError.message}`, rncError.code);
      if (!rncData) throw new RNCError('Failed to create RNC');

      const rnc: RNC = {
        ...rncData,
        type: data.type, // Use the validated type from input
        department: data.department, // Use the validated department from input
        status: RncStatusEnum.pending,
        workflow_status: WorkflowStatusEnum.open
      };

      // Create contacts within the same transaction
      for (const contact of data.contacts) {
        const { error: contactError } = await this.createContact(rnc.id, contact);
        if (contactError) {
          // Rollback by deleting the RNC
          await supabase.from('rncs').delete().eq('id', rnc.id);
          throw new RNCError(`Error creating contact: ${contactError.message}`);
        }
      }

      // Create products within the same transaction
      for (const product of data.products) {
        const { error: productError } = await this.createProduct(rnc.id, product);
        if (productError) {
          // Rollback by deleting the RNC and related contacts
          await supabase.from('rncs').delete().eq('id', rnc.id);
          throw new RNCError(`Error creating product: ${productError.message}`);
        }
      }

      return rnc;
    } catch (error) {
      console.error('Error in RNC creation:', error);
      if (error instanceof RNCError) throw error;
      throw new RNCError('Unexpected error creating RNC');
    }
  },

  async createContact(rncId: string, data: CreateRNCContact) {
    try {
      const { data: contact, error } = await supabase
        .from('rnc_contacts')
        .insert([{
          rnc_id: rncId,
          name: data.name,
          phone: data.phone,
          email: data.email
        }])
        .select()
        .single();

      return { contact, error };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new RNCError('Failed to create contact');
    }
  },

  async createProduct(rncId: string, data: CreateRNCProduct) {
    try {
      const { data: product, error } = await supabase
        .from('rnc_products')
        .insert([{
          rnc_id: rncId,
          name: data.name,
          weight: data.weight
        }])
        .select()
        .single();

      return { product, error };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new RNCError('Failed to create product');
    }
  },

  async uploadAttachment(rncId: string, file: File): Promise<RNCAttachment> {
    try {
      // Validate file before upload
      validateAttachment(file);
      
      // Sanitize filename
      const sanitizedName = sanitizeFilename(file.name);
      const filePath = `rnc-${rncId}/${crypto.randomUUID()}-${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('rnc-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new RNCError(`Upload failed: ${uploadError.message}`);

      const { data: attachment, error: dbError } = await supabase
        .from('rnc_attachments')
        .insert({
          rnc_id: rncId,
          filename: sanitizedName,
          filesize: file.size,
          content_type: file.type,
          file_path: filePath,
          created_by: (await supabase.auth.getUser())?.data?.user?.id,
        })
        .select()
        .single();

      if (dbError) {
        // Cleanup uploaded file if database insert fails
        await supabase.storage
          .from('rnc-attachments')
          .remove([filePath]);
          
        throw dbError;
      }

      if (!attachment) throw new RNCError('Failed to create attachment record');

      return attachment;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      if (error instanceof RNCError) throw error;
      throw new RNCError('Failed to upload attachment');
    }
  },

  getAttachmentUrl(filePath: string): string {
    return supabase.storage
      .from('rnc-attachments')
      .getPublicUrl(filePath)
      .data.publicUrl;
  }
};
