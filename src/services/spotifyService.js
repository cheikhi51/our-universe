import { supabase } from "../lib/supabaseClient";

/* =========================================
   GET MY UNIVERSE SPOTIFY SETTINGS
========================================= */

export async function getMySpotifySettings() {
  const { data, error } = await supabase.rpc(
    "get_my_universe_settings"
  );

  if (error) {
    console.error(
      "Failed to load Spotify settings:",
      error
    );

    throw error;
  }

  return data?.[0] || null;
}

/* =========================================
   UPDATE MY UNIVERSE SPOTIFY PLAYLIST
========================================= */

export async function updateMySpotifyPlaylist(
  playlistId,
  playlistUrl
) {
  const { data, error } = await supabase.rpc(
    "update_my_spotify_playlist",
    {
      new_playlist_id: playlistId,
      new_playlist_url: playlistUrl,
    }
  );

  if (error) {
    console.error(
      "Failed to update Spotify playlist:",
      error
    );

    throw error;
  }

  return data;
}