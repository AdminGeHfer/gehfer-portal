import { supabase } from '@/lib/supabase';
import { 
  CreateRNCInput, 
  RncStatusEnum, 
  WorkflowStatusEnum, 
  type RNC, 
  type RNCAttachment,
  type CreateRNCProduct,
  type CreateRNCContact,
  RncTypeEnum,
  RncDepartmentEnum
} from '@/types/rnc';

interface UploadAttachmentResponse {
  attachment: RNCAttachment | null;
  error: Error | null;
}

export const rncService = {
  async create(data: CreateRNCInput): Promise<RNC> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
  
      // Create RNC with proper type casting
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
          assigned_to: (await supabase.schema('public').from('profiles').select('id').eq('name', data.responsible)).data[0].id,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
  
      if (rncError) throw rncError;
      
      // Cast the returned data to match our RNC type
      const rnc: RNC = {
        ...rncData,
        type: rncData.type as RncTypeEnum,
        department: rncData.department as RncDepartmentEnum,
        status: rncData.status as RncStatusEnum,
        workflow_status: rncData.workflow_status as WorkflowStatusEnum
      };
  
      // Create contacts
      for (const contact of data.contacts) {
        await this.createContact(rnc.id, contact);
      }
  
      // Create products
      for (const product of data.products) {
        await this.createProduct(rnc.id, product);
      }
  
      return rnc;
    } catch (error) {
      console.error('Error creating RNC:', error);
      throw error;
    }
  },

  async createContact(rncId: string, data: CreateRNCContact) {
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

    if (error) throw error;
    return contact;
  },

  async createProduct(rncId: string, data: CreateRNCProduct) {
    const { data: product, error } = await supabase
      .from('rnc_products')
      .insert([{
        rnc_id: rncId,
        name: data.name,
        weight: data.weight
      }])
      .select()
      .single();

    if (error) throw error;
    return product;
  },

  async uploadAttachment(rncId: string, file: File): Promise<UploadAttachmentResponse> {
    try {
      const filePath = `rnc-${rncId}/${crypto.randomUUID()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('rnc-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: attachment, error: dbError } = await supabase
        .from('rnc_attachments')
        .insert({
          rnc_id: rncId,
          filename: file.name,
          filesize: file.size,
          content_type: file.type,
          file_path: filePath,
          created_by: (await supabase.auth.getUser())?.data?.user?.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return { attachment, error: null };
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return { attachment: null, error: error as Error };
    }
  },

  getAttachmentUrl(filePath: string): string {
    return supabase.storage
      .from('rnc-attachments')
      .getPublicUrl(filePath)
      .data.publicUrl;
  }
};