import { supabase } from '@/lib/supabase'
import { CreateRNCInput, RncStatusEnum, WorkflowStatusEnum, type RNC, type RNCAttachment } from '@/types/rnc'

interface UploadAttachmentResponse {
  attachment: RNCAttachment;
  error: Error | null;
}

export const rncService = {
  async create(data: CreateRNCInput) {
    try {
      const { data: rnc, error: rncError } = await supabase
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
          assigned_by: (await supabase.auth.getUser())?.data?.user?.id,
          assigned_at: new Date().toISOString(),
          assigned_to: (await supabase.schema('public').from('profiles').select('id').eq('name', data.responsible)).data[0].id,
          created_by: (await supabase.auth.getUser())?.data?.user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
  
      if (rncError) throw rncError;
  
      await this.createContact(rnc.id, data.contacts);
  
      for (const product of data.products) {
        await this.createProduct(rnc.id, product);
      }
  
      await this.createWorkflowTransition(rnc.id, {
        from_status: WorkflowStatusEnum.open,
        to_status: WorkflowStatusEnum.analysis,
        notes: 'RNC criada e movida para análise'
      });
  
      return rnc;
    } catch (error) {
      console.error('Error creating RNC:', error);
      throw error;
    }
  },

  async createContact(rncId: string, data: {
    name: string
    phone: string
    email?: string
  }) {
    const { data: contact, error } = await supabase
      .from('rnc_contacts')
      .insert([{
        rnc_id: rncId,
        ...data
      }])
      .select()
      .single()

    if (error) throw error
    return contact
  },

  async createProduct(rncId: string, data: {
    name: string
    weight: number
  }) {
    const { data: product, error } = await supabase
      .from('rnc_products')
      .insert([{
        rnc_id: rncId,
        ...data
      }])
      .select()
      .single()

    if (error) throw error
    return product
  },

  async createWorkflowTransition(rncId: string, data: {
    from_status: WorkflowStatusEnum.open | WorkflowStatusEnum.analysis | WorkflowStatusEnum.resolution | WorkflowStatusEnum.solved | WorkflowStatusEnum.closing | WorkflowStatusEnum.closed
    to_status: WorkflowStatusEnum.open | WorkflowStatusEnum.analysis | WorkflowStatusEnum.resolution | WorkflowStatusEnum.solved | WorkflowStatusEnum.closing | WorkflowStatusEnum.closed
    notes: string
  }) {
    const { data: workflow_transition, error } = await supabase
      .from('rnc_workflow_transitions')
      .insert([{
        rnc_id: rncId,
        created_by: (await supabase.auth.getUser())?.data?.user?.id,
        ...data
      }])
      .select()
      .single()

    if (error) throw error
    return workflow_transition
  },

  async update(id: string, data: Omit<RNC, 'rnc_number' | 'days_left' | 'assigned_by' | 'assigned_to' | 'assigned_at' | 'created_by' | 'created_at'>) {
    const { data: rnc, error } = await supabase
      .from('rncs')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return rnc
  },

  async updateContact(id: string, rncId: string, data: {
    name: string
    phone: string
    email: string
  }) {
    const { data: rnc, error } = await supabase
      .from('rnc_contacts')
      .update(data)
      .eq('id', id)
      .eq('rnc_id', rncId)
      .select()
      .single()

    if (error) throw error
    return rnc
  },

  async updateProduct(id: string, rncId: string, data: {
    name: string
    weight: number
  }) {
    const { data: rnc, error } = await supabase
      .from('rnc_products')
      .update(data)
      .eq('id', id)
      .eq('rnc_id', rncId)
      .select()
      .single()

    if (error) throw error
    return rnc
  },

  async updateWorkflowTransition(id: string, rncId: string, data: {
    notes: string
  }) {
    const { data: rnc, error } = await supabase
      .from('rnc_workflow_transitions')
      .update(data)
      .eq('id', id)
      .eq('rnc_id', rncId)
      .select()
      .single()

    if (error) throw error
    return rnc
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

  async delete(id: string) {
    const { error } = await supabase
      .from('rnc_products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async deleteAttachment(attachment: RNCAttachment): Promise<{ error: Error | null }> {
    try {
      const { error: storageError } = await supabase.storage
        .from('rnc-attachments')
        .remove([attachment.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('rnc_attachments')
        .delete()
        .eq('id', attachment.id);

      if (dbError) throw dbError;

      return { error: null };
    } catch (error) {
      console.error('Error deleting attachment:', error);
      return { error: error as Error };
    }
  },

  async deleteProduct(productId: string, rncId: string) {
    const { error } = await supabase
      .from('rnc_products')
      .delete()
      .eq('id', productId)
      .eq('rnc_id', rncId)

    if (error) throw error
  },

  async downloadAttachment(attachment: RNCAttachment): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from('rnc-attachments')
        .createSignedUrl(attachment.file_path, 60);

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error downloading attachment:', error);
      return null;
    }
  },

  async listAttachments(rncId: string): Promise<{ data: RNCAttachment[] | null, error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('rnc_attachments')
        .select('*')
        .eq('rnc_id', rncId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error listing attachments:', error);
      return { data: null, error: error as Error };
    }
  },

  getAttachmentUrl(filePath: string): string {
    return supabase.storage
      .from('rnc-attachments')
      .getPublicUrl(filePath)
      .data.publicUrl;
  }
}
