import { supabase } from "../lib/supabaseClient";

export async function getMyMessages(universeId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("universe_id", universeId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to load messages:", error);
    throw error;
  }

  return data;
}

export async function updateConversationMessages(
  conversationId,
  messages
) {
  const { data, error } = await supabase
    .from("messages")
    .update({
      messages,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to update conversation messages:",
      error
    );
    throw error;
  }

  return data;
}
export async function markConversationAsRead(conversationId) {
  const { data, error } = await supabase
    .from("messages")
    .update({
      unread: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to mark conversation as read:",
      error
    );
    throw error;
  }

  return data;
}