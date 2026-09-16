import { supabase } from "../lib/supabaseClient";

/* =================================
   GET OUR SPACE
================================= */

export const getMyOurSpace = async (universeId) => {
  if (!universeId) {
    throw new Error("Universe ID is required.");
  }

  const { data, error } = await supabase
    .from("our_space")
    .select(`
      id,
      universe_id,
      title,
      text,
      icon,
      type,
      items,
      favorite,
      created_at,
      updated_at
    `)
    .eq("universe_id", universeId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch our space:", error);
    throw error;
  }

  return data || [];
};


/* =================================
   CREATE OUR SPACE ITEM
================================= */

export const createOurSpaceItem = async (item) => {
  const { data, error } = await supabase
    .from("our_space")
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("Failed to create our space item:", error);
    throw error;
  }

  return data;
};


/* =================================
   UPDATE OUR SPACE ITEM
================================= */

export const updateOurSpaceItem = async (itemId, updates) => {
  if (!itemId) {
    throw new Error("Our Space item ID is required.");
  }

  const { data, error } = await supabase
    .from("our_space")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update our space item:", error);
    throw error;
  }

  return data;
};


/* =================================
   DELETE OUR SPACE ITEM
================================= */

export const deleteOurSpaceItem = async (itemId) => {
  if (!itemId) {
    throw new Error("Our Space item ID is required.");
  }

  const { error } = await supabase
    .from("our_space")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Failed to delete our space item:", error);
    throw error;
  }

  return true;
};