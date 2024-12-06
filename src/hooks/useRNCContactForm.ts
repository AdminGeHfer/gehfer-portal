import { useState } from "react";
import { RNC } from "@/types/rnc";
import { UseMutationResult } from "@tanstack/react-query";

export const useRNCContactForm = (
  rnc: RNC,
  updateRNC: UseMutationResult<void, Error, Partial<RNC>>
) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleContactChange = (field: keyof RNC["contact"], value: string) => {
    if (!rnc) return;
    
    const updatedRnc = {
      ...rnc,
      contact: {
        ...rnc.contact,
        [field]: value
      }
    };
    updateRNC.mutate(updatedRnc);
  };

  const handleContactSave = async (contactData: RNC["contact"]) => {
    if (!rnc || isSaving) return;
    
    try {
      setIsSaving(true);
      const updatedRnc = {
        ...rnc,
        contact: contactData
      };
      await updateRNC.mutateAsync(updatedRnc);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    handleContactChange,
    handleContactSave
  };
};