import { supabase } from "../lib/supabaseClient";

export async function getMyUniverse() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("universe_members")
    .select(`
      role,
      universes (
        id,
        name,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}