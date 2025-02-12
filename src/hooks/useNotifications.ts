import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Notification } from "@/types/notifications";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread'>('all');

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq('user_id', user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Sorting function
  const getSortedNotifications = (notifs: Notification[]) => {
    return [...notifs].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  // Filtering function
  const getFilteredNotifications = (notifs: Notification[]) => {
    if (currentFilter === 'unread') {
      return notifs.filter(n => !n.read);
    }
    return notifs;
  };

  // Processed notifications
  const processedNotifications = useMemo(() => {
    if (!notifications) return [];
    const sorted = getSortedNotifications(notifications);
    return getFilteredNotifications(sorted);
  }, [notifications, currentFilter]);

  return {
    notifications: processedNotifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    currentFilter,
    setCurrentFilter,
  };
};
