import { supabase } from "../lib/supabaseClient";

/* =================================
   GET UNIVERSE STATISTICS
================================= */

export const getUniverseStats = async (universeId) => {
  if (!universeId) {
    throw new Error("Universe ID is required.");
  }

  const [
    memoriesResult,
    messagesResult,
    timelineResult,
    musicResult,
    momentsResult,
    ourSpaceResult,
  ] = await Promise.all([
    supabase
      .from("memories")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("universe_id", universeId),

    supabase
      .from("messages")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("universe_id", universeId),

    supabase
      .from("timeline_events")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("universe_id", universeId),

    supabase
      .from("music_tracks")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("universe_id", universeId),

    supabase
      .from("moments")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("universe_id", universeId),

    supabase
      .from("our_space")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("universe_id", universeId),
  ]);

  const results = [
    memoriesResult,
    messagesResult,
    timelineResult,
    musicResult,
    momentsResult,
    ourSpaceResult,
  ];

  const failedResult = results.find(
    (result) => result.error
  );

  if (failedResult) {
    console.error(
      "Failed to fetch universe statistics:",
      failedResult.error
    );

    throw failedResult.error;
  }

  return {
    memories: memoriesResult.count || 0,
    messages: messagesResult.count || 0,
    timeline: timelineResult.count || 0,
    music: musicResult.count || 0,
    moments: momentsResult.count || 0,
    space: ourSpaceResult.count || 0,
  };
};