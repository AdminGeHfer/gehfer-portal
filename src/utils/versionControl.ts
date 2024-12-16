import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export const getDocumentVersions = async (documentId: string) => {
  const { data, error } = await supabase
    .from('document_versions')
    .select(`
      id,
      version_number,
      created_at,
      created_by,
      metadata,
      is_active,
      profiles(name)
    `)
    .eq('document_id', documentId)
    .order('version_number', { ascending: false });

  if (error) throw error;
  return data;
};

export const rollbackToVersion = async (documentId: string, versionId: string) => {
  try {
    // Desativar versão atual
    const { error: updateError } = await supabase
      .from('document_versions')
      .update({ is_active: false })
      .eq('document_id', documentId)
      .eq('is_active', true);

    if (updateError) throw updateError;

    // Ativar versão alvo
    const { error: activateError } = await supabase
      .from('document_versions')
      .update({ is_active: true })
      .eq('id', versionId);

    if (activateError) throw activateError;

    return { success: true };
  } catch (error) {
    console.error('Error rolling back version:', error);
    throw error;
  }
};

export const compareVersions = async (versionId1: string, versionId2: string) => {
  const { data: chunks1, error: error1 } = await supabase
    .from('document_chunks')
    .select('*')
    .eq('version_id', versionId1)
    .order('metadata->position');

  const { data: chunks2, error: error2 } = await supabase
    .from('document_chunks')
    .select('*')
    .eq('version_id', versionId2)
    .order('metadata->position');

  if (error1 || error2) throw error1 || error2;

  return {
    chunks1,
    chunks2,
    differences: analyzeDifferences(chunks1, chunks2)
  };
};

function analyzeDifferences(chunks1: any[], chunks2: any[]) {
  return {
    totalDiffs: 0,
    coherenceChanges: [],
    topicChanges: []
  };
}