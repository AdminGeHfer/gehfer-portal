import { supabase } from '@/lib/supabase'
import type { RNC } from '@/types/rnc'

export const rncService = {
  async create(data: Omit<RNC, 'id' | 'created_at' | 'updated_at' | 'rnc_number'>) {
    const { data: rnc, error } = await supabase
      .from('rncs')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return rnc
  },

  async createAttachment(rncId: string, data: {
    filename: string
    filesize: number
    content_type: string
    file_path: string
  }) {
    const { data: attachment, error } = await supabase
      .from('rnc_attachments')
      .insert([{
        rnc_id: rncId,
        created_by: (await supabase.auth.getUser())?.data?.user?.id,
        ...data
      }])
      .select(`
        *,
        created_by_profile:profiles(name)
      `)
      .single()

    if (error) throw error
    return attachment
  },

  async createContact(rncId: string, data: {
    name: string
    phone: string
    email: string
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
    from_status: 'open' | 'analysis' | 'resolution' | 'solved' | 'closing' | 'closed'
    to_status: 'open' | 'analysis' | 'resolution' | 'solved' | 'closing' | 'closed'
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

  async update(id: string, data: Partial<RNC>) {
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

  async delete(id: string) {
    const { error } = await supabase
      .from('rnc_products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async deleteAttachment(attachmentId: string, rncId: string) {
    const { error } = await supabase
      .from('rnc_attachments')
      .delete()
      .eq('id', attachmentId)
      .eq('rnc_id', rncId)

    if (error) throw error
  },

  async deleteProduct(productId: string, rncId: string) {
    const { error } = await supabase
      .from('rnc_products')
      .delete()
      .eq('id', productId)
      .eq('rnc_id', rncId)

    if (error) throw error
  }
}
