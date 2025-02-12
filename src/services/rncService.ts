import { supabase } from '@/lib/supabase';
import { 
  CreateRNCInput, 
  UpdateRNCInput,
  RncStatusEnum, 
  WorkflowStatusEnum, 
  type RNC, 
  type RNCAttachment,
  WorkflowTransition,
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

const validateAttachment = (file: File): void => {
  const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'application/mp4', 'video/mpeg', 'video/ogg', 'video/webm'];
  
  if (file.size > MAX_SIZE) {
    throw new ValidationError('Arquivo muito grande. Máximo permitido: 100 MB');
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError('Tipo de arquivo não permitido. Use: JPG, PNG, MP4, MPEG, OGG, WEBM ou PDF');
  }
};

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^\x20-\x7E]/g, '');
};

export const rncService = {
  async create(data: CreateRNCInput): Promise<RNC> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new RNCError('Usuário não autenticado');

      const capitalizedResponsible = data.responsible.charAt(0).toUpperCase() + data.responsible.slice(1).toLowerCase();

      const { data: assignedUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('name', capitalizedResponsible)
        .single();

      if (userError) {
        console.warn('Could not find user for assignment:', userError);
      }

      // Create RNC
      const { data: rncData, error: rncError } = await supabase
        .from('rncs')
        .insert([{
          company_code: data.company_code,
          company: data.company,
          document: data.document,
          description: data.description,
          type: data.type,
          department: data.department,
          responsible: capitalizedResponsible,
          korp: data.korp,
          nfv: data.nfv,
          nfd: data.nfd,
          city: data.city,
          status: RncStatusEnum.pending,
          workflow_status: WorkflowStatusEnum.open,
          assigned_by: user.id,
          assigned_to: assignedUser?.id || null,
          assigned_at: new Date().toISOString(),
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (rncError) throw new RNCError(`Error creating RNC: ${rncError.message}`);
      if (!rncData) throw new RNCError('Failed to create RNC');

      // Create contacts only if there are valid contacts
      if (data.contacts && data.contacts.length > 0) {
        const validContacts = data.contacts.filter(contact => 
          contact.name || contact.phone || contact.email
        );

        if (validContacts.length > 0) {
          const { error: contactsError } = await supabase
            .from('rnc_contacts')
            .insert(
              validContacts.map(contact => ({
                rnc_id: rncData.id,
                name: contact.name || '',
                phone: contact.phone || '',
                email: contact.email || ''
              }))
            );

          if (contactsError) throw new RNCError(`Error creating contacts: ${contactsError.message}`);
        }
      }

      // Create products
      if (data.products?.length) {
        const { error: productsError } = await supabase
          .from('rnc_products')
          .insert(
            data.products.map(product => ({
              rnc_id: rncData.id,
              name: product.name,
              weight: product.weight
            }))
          );

        if (productsError) throw new RNCError(`Error creating products: ${productsError.message}`);
      }

      if (data.attachments?.length) {
        await Promise.all(data.attachments.map(file => 
          this.uploadAttachment(rncData.id, file)
        ));
      }

      return rncData as RNC;
    } catch (error) {
      console.error('Error in RNC creation:', error);
      if (error instanceof RNCError) throw error;
      throw new RNCError('Unexpected error creating RNC');
    }
  },

  async update(id: string, data: UpdateRNCInput): Promise<RNC> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new RNCError('Usuário não autenticado');

      const capitalizedResponsible = data.responsible.charAt(0).toUpperCase() + data.responsible.slice(1).toLowerCase();

      const { data: assignedUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('name', capitalizedResponsible)
        .single();

      if (userError) {
        console.warn('Could not find user for assignment:', userError);
      }

      // Determine status and workflow_status based on dates
      let status = data.status;
      let workflow_status = data.workflow_status;

      // Handle collected_at date changes
      if (data.collected_at) {
        status = RncStatusEnum.collect;
        workflow_status = WorkflowStatusEnum.resolution;
      }

      // Handle closed_at date changes
      if (data.closed_at) {
        status = RncStatusEnum.concluded;
        workflow_status = WorkflowStatusEnum.solved;
      }

      // If both dates are null, revert to pending status
      if (!data.collected_at && !data.closed_at) {
        status = RncStatusEnum.pending;
        workflow_status = WorkflowStatusEnum.analysis;
      }

      // If on resolution or on conclusion have the word 'cancelado' or 'cancelada'
      if (data.conclusion?.toUpperCase().includes('CANCELADO') ||
          data.conclusion?.toUpperCase().includes('CANCELADA') ||
          data.resolution?.toUpperCase().includes('CANCELADO') ||
          data.resolution?.toUpperCase().includes('CANCELADA')) {
        // Then transition to closed
        const { error: closedError } = await supabase
          .from('rnc_workflow_transitions')
          .insert({
            rnc_id: id,
            from_status: WorkflowStatusEnum.closing,
            to_status: WorkflowStatusEnum.closed,
            notes: 'RNC cancelada - fechada',
            created_by: user.id
          });
  
        if (closedError) throw new RNCError(`Error in closed transition: ${closedError.message}`);
  
        status = RncStatusEnum.canceled;
        workflow_status = WorkflowStatusEnum.closed;
      }
  
      const { data: rncData, error: rncError } = await supabase
        .from('rncs')
        .update({
          company_code: data.company_code,
          company: data.company,
          document: data.document,
          type: data.type,
          department: data.department,
          responsible: capitalizedResponsible,
          description: data.description,
          resolution: data.resolution,
          korp: data.korp,
          nfv: data.nfv,
          nfd: data.nfd,
          city: data.city,
          collected_at: data.collected_at,
          closed_at: data.closed_at,
          conclusion: data.conclusion,
          assigned_to: assignedUser?.id || null,
          updated_at: new Date().toISOString(),
          status,
          workflow_status
        })
        .eq('id', id)
        .select()
        .single();
  
      if (rncError) throw new RNCError(`Error updating RNC: ${rncError.message}`);
      if (!rncData) throw new RNCError('Failed to update RNC');

      // Update contacts
      if (data.contacts) {
        // Delete existing contacts
        await supabase.from('rnc_contacts').delete().eq('rnc_id', id);
        
        // Insert new contacts if any
        if (data.contacts.length > 0) {
          const { error: contactsError } = await supabase
            .from('rnc_contacts')
            .insert(
              data.contacts.map(contact => ({
                rnc_id: id,
                name: contact.name,
                phone: contact.phone,
                email: contact.email
              }))
            );

          if (contactsError) throw new RNCError(`Error updating contacts: ${contactsError.message}`);
        }
      }

      // Update products
      if (data.products) {
        // Delete existing products
        await supabase.from('rnc_products').delete().eq('rnc_id', id);
        
        // Insert new products if any
        if (data.products.length > 0) {
          const { error: productsError } = await supabase
            .from('rnc_products')
            .insert(
              data.products.map(product => ({
                rnc_id: id,
                name: product.name,
                weight: product.weight
              }))
            );

          if (productsError) throw new RNCError(`Error updating products: ${productsError.message}`);
        }
      }

      // Handle attachments
      if (data.attachments?.length) {
        // Only handle new File objects, existing attachments are managed separately
        const newAttachments = data.attachments.filter(att => att instanceof File);
        await Promise.all(newAttachments.map(file => 
          this.uploadAttachment(id, file)
        ));
      }

      return rncData as RNC;
    } catch (error) {
      console.error('Error in RNC update:', error);
      if (error instanceof RNCError) throw error;
      throw new RNCError('Unexpected error updating RNC');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Soft delete related records
      await Promise.all([
        // Soft delete attachments
        supabase
          .from('rnc_attachments')
          .update({ deleted_at: now })
          .eq('rnc_id', id),
          
        // Soft delete contacts  
        supabase
          .from('rnc_contacts')
          .update({ deleted_at: now })
          .eq('rnc_id', id),
          
        // Soft delete products
        supabase
          .from('rnc_products')
          .update({ deleted_at: now })
          .eq('rnc_id', id),
          
        // Soft delete events
        supabase
          .from('rnc_events')
          .update({ deleted_at: now })
          .eq('rnc_id', id),
          
        // Soft delete workflow transitions
        supabase
          .from('rnc_workflow_transitions')
          .update({ deleted_at: now })
          .eq('rnc_id', id)
      ]);
  
      // Finally soft delete the RNC
      const { error: rncError } = await supabase
        .from('rncs')
        .update({ deleted_at: now })
        .eq('id', id);
  
      if (rncError) throw new RNCError(`Error deleting RNC: ${rncError.message}`);
    } catch (error) {
      console.error('Error in RNC deletion:', error);
      if (error instanceof RNCError) throw error;
      throw new RNCError('Unexpected error deleting RNC');
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

  async deleteAttachment(rncId: string, attachmentId: string): Promise<void> {
    try {
      // First get the attachment details to know the file path
      const { data: attachment, error: fetchError } = await supabase
        .from('rnc_attachments')
        .select('file_path')
        .eq('id', attachmentId)
        .eq('rnc_id', rncId)
        .single();

      if (fetchError) throw new RNCError(`Error fetching attachment: ${fetchError.message}`);
      if (!attachment) throw new RNCError('Attachment not found');

      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from('rnc-attachments')
        .remove([attachment.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete the attachment record from the database
      const { error: dbError } = await supabase
        .from('rnc_attachments')
        .delete()
        .eq('id', attachmentId)
        .eq('rnc_id', rncId);

      if (dbError) throw new RNCError(`Error deleting attachment record: ${dbError.message}`);
    } catch (error) {
      console.error('Error deleting attachment:', error);
      if (error instanceof RNCError) throw error;
      throw new RNCError('Failed to delete attachment');
    }
  },

  getAttachmentUrl(filePath: string): string {
    return supabase.storage
      .from('rnc-attachments')
      .getPublicUrl(filePath)
      .data.publicUrl;
  },

  async updateWorkflowTransition(
    transitionId: string,
    rncId: string,
    data: { notes: string }
  ): Promise<WorkflowTransition> {
    try {
      const { data: transition, error } = await supabase
        .from('rnc_workflow_transitions')
        .update({ notes: data.notes })
        .eq('id', transitionId)
        .eq('rnc_id', rncId)
        .select(`
          *,
          created_by_profile:profiles!created_by(name)
          `)
        .single();

      if (error) throw error;
      return transition as WorkflowTransition;
    } catch (error) {
      console.error('Error updating workflow transition:', error);
      throw new Error('Failed to update workflow transition');
    }
  },
}
