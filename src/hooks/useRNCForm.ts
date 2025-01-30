import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  basicInfoSchema, 
  additionalInfoSchema,
  productSchema,
  contactSchema,
} from "@/schemas/rncValidation";
import { z } from "zod";

export const useRNCForm = (step: 'basic' | 'additional' | 'products' | 'contact') => {
  const getSchema = () => {
    switch (step) {
      case 'basic':
        return basicInfoSchema;
      case 'additional':
        return additionalInfoSchema;
      case 'products':
        return z.array(productSchema);
      case 'contact':
        return contactSchema;
      default:
        return basicInfoSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    try {
      // Save to localStorage
      const savedData = localStorage.getItem('rncFormData');
      const parsedData = savedData ? JSON.parse(savedData) : {};
      
      localStorage.setItem('rncFormData', JSON.stringify({
        ...parsedData,
        [step]: data
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving form data:', error);
      return false;
    }
  };

  return {
    form,
    onSubmit
  };
};
