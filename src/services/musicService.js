import { supabase } from "../lib/supabaseClient";

/* =================================
   GET MUSIC
================================= */

export async function getMyMusic(universeId) {
  console.log(
    "🎵 Loading music for universe:",
    universeId
  );

  const { data, error } = await supabase
    .from("music_tracks")
    .select("*")
    .eq("universe_id", universeId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "❌ Music Supabase error:",
      error
    );

    throw error;
  }

  console.log(
    "🎵 Music returned from Supabase:",
    data
  );

  return data || [];
}

/* =================================
   CREATE MUSIC
================================= */

export async function createMusicTrack(track) {
  const { data, error } = await supabase
    .from("music_tracks")
    .insert({
      universe_id: track.universe_id,

      title: track.title,
      artist: track.artist,
      album: track.album || "",
      year: track.year || "",
      duration: track.duration || "",
      icon: track.icon || "🎵",

      favorite:
        track.favorite ?? false,

      spotify_id:
        track.spotify_id || null,

      description:
        track.description || "",
    })
    .select()
    .single();

  if (error) {
    console.error(
      "❌ Failed to create music track:",
      error
    );

    throw error;
  }

  return data;
}

/* =================================
   UPDATE MUSIC
================================= */

export async function updateMusicTrack(
  trackId,
  updates
) {
  const { data, error } = await supabase
    .from("music_tracks")
    .update({
      title: updates.title,
      artist: updates.artist,
      album: updates.album || "",
      year: updates.year || "",
      duration: updates.duration || "",
      icon: updates.icon || "🎵",

      favorite:
        updates.favorite ?? false,

      spotify_id:
        updates.spotify_id || null,

      description:
        updates.description || "",
    })
    .eq("id", trackId)
    .select()
    .single();

  if (error) {
    console.error(
      "❌ Failed to update music track:",
      error
    );

    throw error;
  }

  return data;
}

/* =================================
   DELETE MUSIC
================================= */

export async function deleteMusicTrack(
  trackId
) {
  const { error } = await supabase
    .from("music_tracks")
    .delete()
    .eq("id", trackId);

  if (error) {
    console.error(
      "❌ Failed to delete music track:",
      error
    );

    throw error;
  }

  return true;
}