import { supabase } from "../lib/supabaseClient";

/* =================================
   GET MOMENTS
================================= */

export const getMyMoments = async (universeId) => {
  if (!universeId) {
    throw new Error("Universe ID is required.");
  }

  const { data, error } = await supabase
    .from("moments")
    .select(`
      id,
      universe_id,
      date,
      title,
      text,
      icon,
      type,
      favorite,
      created_at,
      updated_at
    `)
    .eq("universe_id", universeId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to fetch moments:", error);
    throw error;
  }

  return data || [];
};

/* =================================
   CREATE MOMENT
================================= */

export const createMoment = async (moment) => {
  const { data, error } = await supabase
    .from("moments")
    .insert([moment])
    .select()
    .single();

  if (error) {
    console.error("Failed to create moment:", error);
    throw error;
  }

  return data;
};

/* =================================
   UPDATE MOMENT
================================= */

export const updateMoment = async (momentId, updates) => {
  if (!momentId) {
    throw new Error("Moment ID is required.");
  }

  const { data, error } = await supabase
    .from("moments")
    .update(updates)
    .eq("id", momentId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update moment:", error);
    throw error;
  }

  return data;
};

/* =================================
   DELETE MOMENT
================================= */

export const deleteMoment = async (momentId) => {
  if (!momentId) {
    throw new Error("Moment ID is required.");
  }

  const { error } = await supabase
    .from("moments")
    .delete()
    .eq("id", momentId);

  if (error) {
    console.error("Failed to delete moment:", error);
    throw error;
  }

  return true;
};