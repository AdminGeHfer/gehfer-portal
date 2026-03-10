import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireServiceRoleToken } from "../_shared/auth.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (!requireServiceRoleToken(req)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get old conversations (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: oldConversations, error: fetchError } = await supabaseClient
      .from('ai_conversations')
      .select('id')
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (fetchError) throw fetchError;

    if (oldConversations && oldConversations.length > 0) {
      const conversationIds = oldConversations.map(conv => conv.id);

      // Delete old messages
      const { error: deleteError } = await supabaseClient
        .from('ai_messages')
        .delete()
        .in('conversation_id', conversationIds);

      if (deleteError) throw deleteError;

      // Delete old conversations
      const { error: convDeleteError } = await supabaseClient
        .from('ai_conversations')
        .delete()
        .in('id', conversationIds);

      if (convDeleteError) throw convDeleteError;

      console.log(`Cleaned up ${conversationIds.length} old conversations`);
    }

    return new Response(
      JSON.stringify({ success: true, cleaned: oldConversations?.length || 0 }),
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cleanup-memory');
    return new Response(
      JSON.stringify({ error: "Cleanup job failed" }),
      { 
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
      }
    );
  }
});
