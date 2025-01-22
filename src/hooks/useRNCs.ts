import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCFormData } from "@/types/rnc";
import { toast } from "sonner";

export const useRNCs = () => {
  const queryClient = useQueryClient();

  const { data: rncs, isLoading } = useQuery({
    queryKey: ["rncs"],
    queryFn: async () => {
      console.log('Fetching RNCs...');
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          products:rnc_products(*),
          contact:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching RNCs:', error);
        throw error;
      }
      console.log('RNCs fetched successfully');
      return data;
    },
  });

  const getDashboardStats = () => {
    if (!rncs) return {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      averageResolutionTime: 0
    };

    const total = rncs.length;
    const open = rncs.filter(rnc => rnc.workflow_status === 'open').length;
    const inProgress = rncs.filter(rnc => ['analysis', 'resolution', 'closing'].includes(rnc.workflow_status)).length;
    const closed = rncs.filter(rnc => ['closed', 'solved'].includes(rnc.workflow_status)).length;

    const closedRncs = rncs.filter(rnc => rnc.closed_at);
    const totalResolutionTime = closedRncs.reduce((acc, rnc) => {
      const start = new Date(rnc.created_at);
      const end = new Date(rnc.closed_at!);
      return acc + (end.getTime() - start.getTime());
    }, 0);

    const averageResolutionTime = closedRncs.length > 0 
      ? Math.round(totalResolutionTime / closedRncs.length / (1000 * 60 * 60 * 24)) 
      : 0;

    return {
      total,
      open,
      inProgress,
      closed,
      averageResolutionTime
    };
  };

  const createRNC = useMutation({
    mutationFn: async (data: RNCFormData) => {
      console.log("Starting RNC creation with data");
      
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        throw userError;
      }
      if (!userData.user) {
        console.error("User not authenticated");
        throw new Error("User not authenticated");
      }

      console.log("Current user:", userData.user);

      // Create RNC with required fields
      const { data: rnc, error: rncError } = await supabase
        .from("rncs")
        .insert({
          company_code: data.company_code,
          company: data.company,
          cnpj: data.cnpj,
          type: data.type,
          description: data.description,
          department: data.department,
          workflow_status: "open",
          created_by: userData.user.id,
          assigned_to: userData.user.id,
        })
        .select()
        .single();

      if (rncError) {
        console.error('Error creating RNC:', rncError);
        throw rncError;
      }

      console.log("RNC created successfully");

      // Create products if provided
      if (data.products && data.products.length > 0) {
        console.log("Creating products:", data.products);
        const { error: productsError } = await supabase
          .from("rnc_products")
          .insert(
            data.products.map(product => ({
              rnc_id: rnc.id,
              product: product.product,
              weight: product.weight
            }))
          );

        if (productsError) {
          console.error('Error creating products:', productsError);
          throw productsError;
        }
        console.log("Products created successfully");
      }

      // Create contact if provided
      if (data.contact) {
        console.log("Creating contact:", data.contact);
        const { error: contactError } = await supabase
          .from("rnc_contacts")
          .insert({
            rnc_id: rnc.id,
            name: data.contact.name,
            phone: data.contact.phone,
            email: data.contact.email,
          });

        if (contactError) {
          console.error('Error creating contact:', contactError);
          throw contactError;
        }
        console.log("Contact created successfully");
      }

      // Create initial event
      console.log("Creating initial event");
      const { error: eventError } = await supabase
        .from("rnc_events")
        .insert({
          rnc_id: rnc.id,
          title: "RNC Created",
          description: "RNC was registered in the system",
          type: "creation",
          created_by: userData.user.id,
        });

      if (eventError) {
        console.error('Error creating event:', eventError);
        throw eventError;
      }
      console.log("Initial event created successfully");

      return rnc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
      toast.success("RNC criada com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating RNC:", error);
      toast.error(`Erro ao criar RNC: ${error.message}`);
    },
  });

  return {
    rncs,
    isLoading,
    createRNC,
    getDashboardStats
  };
};