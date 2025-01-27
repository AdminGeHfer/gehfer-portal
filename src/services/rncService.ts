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

  async updateStatus(id: string, status: RNC['status']) {
    return this.update(id, { status })
  },

  async updateWorkflowStatus(id: string, workflow_status: RNC['workflow_status']) {
    return this.update(id, { workflow_status })
  },

  async addEvent(rncId: string, data: {
    title: string
    description: string
    type: string
  }) {
    const { data: event, error } = await supabase
      .from('rnc_events')
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
    return event
  },

  async addContact(rncId: string, data: {
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

  async addProduct(rncId: string, data: {
    product: string
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
  }
}
