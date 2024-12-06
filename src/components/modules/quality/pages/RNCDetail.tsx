import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCDetailLayout } from "@/components/quality/detail/RNCDetailLayout";
import { transformRNCData } from "@/utils/rncTransform";
import { useDeleteRNC, useUpdateRNC } from "@/mutations/rncMutations";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";
import { RefetchOptions } from "@tanstack/react-query";
import { subscribeToRNCChanges } from "@/api/rncService";

const RNCDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: rnc, isLoading, refetch } = useQuery({
    queryKey: ["rnc", id],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          contact:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data.created_by !== user.user?.id) {
        toast.error("Você não tem permissão para editar esta RNC");
        return { ...transformRNCData(data), canEdit: false };
      }

      return { ...transformRNCData(data), canEdit: true };
    },
    staleTime: 1000,
    refetchInterval: 2000,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!id) return;
    
    const unsubscribe = subscribeToRNCChanges(id, (updatedRNC) => {
      queryClient.setQueryData(["rnc", id], updatedRNC);
    });

    return () => {
      unsubscribe();
    };
  }, [id, queryClient]);

  const deleteRNC = useDeleteRNC(id!, () => {
    toast.success("RNC excluída com sucesso");
    navigate("/quality/rnc");
  });

  const updateRNC = useUpdateRNC(id!, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
      setIsEditing(false);
      setIsSaving(false);
      toast.success("RNC atualizada com sucesso");
    },
    meta: {
      onError: (error: Error) => {
        setIsSaving(false);
        toast.error(`Erro ao atualizar RNC: ${error.message}`);
        console.error("Update error:", error);
      }
    }
  });

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(!isGeneratingPDF);
  };

  const handleEdit = () => {
    if (!rnc?.canEdit) {
      toast.error("Você não tem permissão para editar esta RNC");
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!rnc || isSaving) return;
    
    try {
      setIsSaving(true);
      await updateRNC.mutateAsync(rnc);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async () => {
    if (!rnc?.canEdit) {
      toast.error("Você não tem permissão para excluir esta RNC");
      return;
    }
    
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deleteRNC.mutateAsync();
    } catch (error) {
      toast.error("Erro ao excluir RNC");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleWhatsApp = () => {
    if (!rnc) return;
    const phone = rnc.contact.phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá! Gostaria de falar sobre a RNC #${rnc.rnc_number}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleFieldChange = (field: keyof RNC, value: any) => {
    if (!rnc) return;
    
    if (field === "contact") {
      const updatedRnc = {
        ...rnc,
        contact: {
          ...rnc.contact,
          [value.target.name]: value.target.value
        }
      };
      updateRNC.mutate(updatedRnc);
    } else {
      const updatedRnc = {
        ...rnc,
        [field]: value
      };
      updateRNC.mutate(updatedRnc);
    }
  };

  const handleRefresh = async (options?: RefetchOptions): Promise<void> => {
    await refetch(options);
    queryClient.invalidateQueries({ queryKey: ["rncs"] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex min-h-screen">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>Carregando...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!rnc) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex min-h-screen">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>RNC não encontrada</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <RNCDetailLayout
      rnc={rnc}
      isEditing={isEditing}
      isGeneratingPDF={isGeneratingPDF}
      isDeleteDialogOpen={isDeleteDialogOpen}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onGeneratePDF={handleGeneratePDF}
      onWhatsApp={handleWhatsApp}
      onFieldChange={handleFieldChange}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      isDeleting={isDeleting}
      canEdit={rnc.canEdit}
      onRefresh={handleRefresh}
      onStatusChange={async (newStatus) => {
        if (!rnc) return;
        const updatedRnc = {
          ...rnc,
          workflow_status: newStatus
        };
        await updateRNC.mutateAsync(updatedRnc);
        await handleRefresh();
      }}
    />
  );
};

export default RNCDetail;
