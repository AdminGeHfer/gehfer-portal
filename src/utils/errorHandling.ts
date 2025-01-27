import { PostgrestError } from '@supabase/supabase-js'

export const handleSupabaseError = (error: PostgrestError) => {
  switch (error.code) {
    case '23505':
      return 'This record already exists.'
    case '23503':
      return 'This operation would violate referential integrity.'
    case '42P01':
      return 'The requested resource was not found.'
    default:
      return error.message
  }
}
