import { supabase } from "../lib/supabaseClient";

export async function getMyTimeline(universeId) {
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("universe_id", universeId)
    .order("event_date", {
      ascending: true,
    });

  if (error) {
    console.error("Failed to load timeline:", error);
    throw error;
  }

  return data || [];
}

export async function createTimelineEvent(event) {
  const { data, error } = await supabase
    .from("timeline_events")
    .insert({
      universe_id: event.universe_id,
      event_date: event.event_date,
      title: event.title,
      description: event.description || "",
      icon: event.icon || "✨",
      location: event.location || "",
      favorite: event.favorite ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to create timeline event:",
      error
    );
    throw error;
  }

  return data;
}

export async function updateTimelineEvent(
  eventId,
  updates
) {
  const { data, error } = await supabase
    .from("timeline_events")
    .update({
      event_date: updates.event_date,
      title: updates.title,
      description: updates.description || "",
      icon: updates.icon || "✨",
      location: updates.location || "",
      favorite: updates.favorite ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to update timeline event:",
      error
    );
    throw error;
  }

  return data;
}

export async function deleteTimelineEvent(eventId) {
  const { error } = await supabase
    .from("timeline_events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error(
      "Failed to delete timeline event:",
      error
    );
    throw error;
  }

  return true;
}