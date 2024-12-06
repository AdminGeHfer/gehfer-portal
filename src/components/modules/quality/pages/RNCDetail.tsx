import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRNCById, subscribeToRNCChanges } from "@/api/rncService";
import { RNCDetailLayout } from "@/components/quality/detail/RNCDetailLayout";
import { toast } from "sonner";
import { RefetchOptions } from "@tanstack/react-query";
import { useRNCDetailState } from "@/hooks/useRNCDetailState";
import { RNC } from "@/types/rnc";

const RNCDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isGeneratingPDF,
    setIsGeneratingPDF,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    isSaving,
    setIsSaving,
    deleteRNC,
    updateRNC
  } = useRNCDetailState(id!);

  // Query to get RNC by ID or RNC number
  const { data: rnc, isLoading, refetch } = useQuery({
    queryKey: ["rnc", id],
    queryFn: async () => {
      if (!id) {
        toast.error("ID inválido");
        navigate("/quality/rnc");
        return null;
      }

      const rnc = await getRNCById(id);
      if (!rnc) {
        navigate("/quality/rnc");
        return null;
      }

      return rnc;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!rnc?.id) return;
    
    const unsubscribe = subscribeToRNCChanges(rnc.id, (updatedRNC) => {
      queryClient.setQueryData(["rnc", id], updatedRNC);
    });

    return () => {
      unsubscribe();
    };
  }, [rnc?.id, queryClient, id]);

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
          ...value
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
      updateRNC={updateRNC}
    />
  );
};

export default RNCDetail;