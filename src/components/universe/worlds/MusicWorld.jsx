import { useEffect, useMemo, useState } from "react";

import SpotifyPlaylist from "../SpotifyPlaylist";

import {
  getMyMusic,
  createMusicTrack,
  updateMusicTrack,
  deleteMusicTrack,
} from "../../../services/musicService";

import { getMyUniverse } from "../../../services/universeService";

import MusicTrackForm from "./music/MusicTrackForm";
import ConfirmMusicDelete from "./music/ConfirmMusicDelete";

/* =================================
   FORMAT SUPABASE TRACK
================================= */

const formatMusicTrack = (track) => ({
  id: track.id,
  title: track.title,
  artist: track.artist,
  album: track.album || "",
  year: track.year || "",
  duration: track.duration || "",
  icon: track.icon || "🎵",
  favorite: track.favorite ?? false,
  spotifyId: track.spotify_id || null,
  description: track.description || "",
});

/* =================================
   MUSIC WORLD
================================= */

function MusicWorld({ onBack }) {
  const [musicTracks, setMusicTracks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddTrack, setShowAddTrack] =
    useState(false);

  const [editingTrack, setEditingTrack] =
    useState(null);

  const [trackToDelete, setTrackToDelete] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =================================
     MUSIC EXPERIENCE STATE
  ================================= */

  const [searchQuery, setSearchQuery] =
    useState("");

  const [showFavoritesOnly, setShowFavoritesOnly] =
    useState(false);

  const [selectedTrack, setSelectedTrack] =
    useState(null);

  /* =================================
     LOAD MUSIC
  ================================= */

  useEffect(() => {
    let mounted = true;

    const loadMusic = async () => {
      try {
        setLoading(true);
        setError("");

        const universeMembership =
          await getMyUniverse();

        const universeId =
          universeMembership?.universes?.id;

        if (!universeId) {
          throw new Error(
            "No universe found for the current user."
          );
        }

        const tracks =
          await getMyMusic(universeId);

        if (!mounted) return;

        setMusicTracks(
          tracks.map(formatMusicTrack)
        );
      } catch (err) {
        console.error(
          "❌ Failed to load music:",
          err
        );

        if (!mounted) return;

        setError(
          "We couldn't load your music right now."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMusic();

    return () => {
      mounted = false;
    };
  }, []);

  /* =================================
     ADD TRACK
  ================================= */

  const handleAddTrack = async (form) => {
    try {
      setSaving(true);
      setError("");

      const universeMembership =
        await getMyUniverse();

      const universeId =
        universeMembership?.universes?.id;

      if (!universeId) {
        throw new Error(
          "No universe found for the current user."
        );
      }

      const createdTrack =
        await createMusicTrack({
          universe_id: universeId,

          title: form.title,
          artist: form.artist,
          album: form.album,
          year: form.year,
          duration: form.duration,
          icon: form.icon,
          favorite: form.favorite,

          spotify_id:
            form.spotifyId || null,

          description:
            form.description,
        });

      const formattedTrack =
        formatMusicTrack(createdTrack);

      setMusicTracks((current) => [
        ...current,
        formattedTrack,
      ]);

      setShowAddTrack(false);
    } catch (err) {
      console.error(
        "❌ Failed to add music track:",
        err
      );

      setError(
        "We couldn't add this song."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =================================
     EDIT TRACK
  ================================= */

  const handleEditTrack = async (form) => {
    if (!editingTrack) return;

    try {
      setSaving(true);
      setError("");

      const updatedTrack =
        await updateMusicTrack(
          editingTrack.id,
          {
            title: form.title,
            artist: form.artist,
            album: form.album,
            year: form.year,
            duration: form.duration,
            icon: form.icon,
            favorite: form.favorite,

            spotify_id:
              form.spotifyId || null,

            description:
              form.description,
          }
        );

      const formattedTrack =
        formatMusicTrack(updatedTrack);

      setMusicTracks((current) =>
        current.map((track) =>
          track.id === formattedTrack.id
            ? formattedTrack
            : track
        )
      );

      setSelectedTrack((current) =>
        current?.id === formattedTrack.id
          ? formattedTrack
          : current
      );

      setEditingTrack(null);
    } catch (err) {
      console.error(
        "❌ Failed to update music track:",
        err
      );

      setError(
        "We couldn't update this song."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =================================
     DELETE TRACK
  ================================= */

  const handleDeleteTrack = async () => {
    if (!trackToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteMusicTrack(
        trackToDelete.id
      );

      setMusicTracks((current) =>
        current.filter(
          (track) =>
            track.id !== trackToDelete.id
        )
      );

      setSelectedTrack((current) =>
        current?.id === trackToDelete.id
          ? null
          : current
      );

      setTrackToDelete(null);
    } catch (err) {
      console.error(
        "❌ Failed to delete music track:",
        err
      );

      setError(
        "We couldn't delete this song."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =================================
     TOGGLE FAVORITE
  ================================= */

  const handleToggleFavorite = async (
    event,
    track
  ) => {
    event.stopPropagation();

    const newFavorite =
      !track.favorite;

    setMusicTracks((current) =>
      current.map((item) =>
        item.id === track.id
          ? {
              ...item,
              favorite: newFavorite,
            }
          : item
      )
    );

    setSelectedTrack((current) =>
      current?.id === track.id
        ? {
            ...current,
            favorite: newFavorite,
          }
        : current
    );

    try {
      await updateMusicTrack(
        track.id,
        {
          title: track.title,
          artist: track.artist,
          album: track.album,
          year: track.year,
          duration: track.duration,
          icon: track.icon,
          favorite: newFavorite,

          spotify_id:
            track.spotifyId || null,

          description:
            track.description,
        }
      );
    } catch (err) {
      console.error(
        "❌ Failed to update favorite:",
        err
      );

      setMusicTracks((current) =>
        current.map((item) =>
          item.id === track.id
            ? {
                ...item,
                favorite:
                  track.favorite,
              }
            : item
        )
      );

      setSelectedTrack((current) =>
        current?.id === track.id
          ? {
              ...current,
              favorite:
                track.favorite,
            }
          : current
      );

      setError(
        "We couldn't update the favorite."
      );
    }
  };

  /* =================================
     SEARCH + FAVORITE FILTER
  ================================= */

  const filteredTracks = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return musicTracks.filter((track) => {
      const matchesSearch =
        !query ||
        track.title
          .toLowerCase()
          .includes(query) ||
        track.artist
          .toLowerCase()
          .includes(query) ||
        track.album
          .toLowerCase()
          .includes(query);

      const matchesFavorite =
        !showFavoritesOnly ||
        track.favorite;

      return (
        matchesSearch &&
        matchesFavorite
      );
    });
  }, [
    musicTracks,
    searchQuery,
    showFavoritesOnly,
  ]);

  const favoriteCount =
    musicTracks.filter(
      (track) => track.favorite
    ).length;

  /* =================================
     SELECT TRACK
  ================================= */

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
  };

  /* =================================
     CLOSE SELECTED TRACK
  ================================= */

  const handleCloseSelectedTrack = () => {
    setSelectedTrack(null);
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <main className="music-world">

      {/* =================================
          ATMOSPHERE
      ================================= */}

      <div className="music-stars music-stars-one" />
      <div className="music-stars music-stars-two" />
      <div className="music-stars music-stars-three" />

      <div className="music-nebula music-nebula-one" />
      <div className="music-nebula music-nebula-two" />

      {/* =================================
          HEADER
      ================================= */}

      <header className="music-header">

        <button
          className="music-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <div className="music-title">

          <span className="music-icon">
            🎵
          </span>

          <div>
            <p className="music-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>Music</h1>

            <p className="music-subtitle">
              The soundtrack of our universe.
            </p>
          </div>

        </div>

        <div className="music-counter">
          <span>
            {musicTracks.length}
          </span>

          <small>
            {musicTracks.length === 1
              ? "song"
              : "songs"}
          </small>
        </div>

      </header>

      {/* =================================
          CONTENT
      ================================= */}

      <section className="music-content">

        {/* =================================
            INTRO
        ================================= */}

        <div className="music-intro">

          <span className="music-line" />

          <p>
            Some songs are just songs.
            <br />
            Others become memories.
          </p>

          <span className="music-line" />

        </div>

        {/* =================================
            FEATURED
        ================================= */}

        <section className="music-featured">

          <div className="music-record">

            <div className="music-record-center">
              <span>💗</span>
            </div>

          </div>

          <div className="music-featured-info">

            <span className="music-featured-label">
              OUR PLAYLIST
            </span>

            <h2>
              The Soundtrack of Us
            </h2>

            <p>
              A collection of songs that remind us
              of the moments, nights, memories,
              and little pieces of our universe.
            </p>

            <div className="music-featured-meta">
              <span>Us</span>
              <span>•</span>
              <span>Our Universe</span>
            </div>

          </div>

        </section>

        {/* =================================
            LOADING
        ================================= */}

        {loading && (
          <div className="music-loading">

            <span>🎵</span>

            <p>
              Loading our soundtrack...
            </p>

          </div>
        )}

        {/* =================================
            ERROR
        ================================= */}

        {!loading && error && (
          <div className="music-error">

            <span>💔</span>

            <p>{error}</p>

            <small>
              Please try opening the Music world again.
            </small>

          </div>
        )}

        {/* =================================
            TRACK LIBRARY
        ================================= */}

        {!loading && !error && (
          <section className="music-list">

            {/* LIST HEADER */}

            <div className="music-list-header">

              <div>
                <h2>
                  Our Soundtrack
                </h2>

                <span>
                  {musicTracks.length}{" "}
                  {musicTracks.length === 1
                    ? "song"
                    : "songs"}

                  {favoriteCount > 0 &&
                    ` · ${favoriteCount} favorite${
                      favoriteCount === 1
                        ? ""
                        : "s"
                    }`}
                </span>
              </div>

              <button
                className="music-add-button"
                onClick={() =>
                  setShowAddTrack(true)
                }
              >
                <span>＋</span>
                <span>Add song</span>
              </button>

            </div>

            {/* SEARCH + FILTER */}

            <div className="music-toolbar">

              <div className="music-search">

                <span>⌕</span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search our songs..."
                  aria-label="Search songs"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}

              </div>

              <button
                type="button"
                className={`music-filter-button ${
                  showFavoritesOnly
                    ? "music-filter-active"
                    : ""
                }`}
                onClick={() =>
                  setShowFavoritesOnly(
                    (current) => !current
                  )
                }
              >
                <span>
                  {showFavoritesOnly
                    ? "♥"
                    : "♡"}
                </span>

                <span>
                  Favorites
                </span>

                <small>
                  {favoriteCount}
                </small>
              </button>

            </div>

            {/* TRACKS */}

            <div className="music-tracks">

              {musicTracks.length === 0 ? (
                <div className="music-empty">

                  <span>🎵</span>

                  <h3>
                    Our soundtrack is waiting
                  </h3>

                  <p>
                    Add the first song to our
                    little universe.
                  </p>

                  <button
                    className="music-add-button"
                    onClick={() =>
                      setShowAddTrack(true)
                    }
                  >
                    <span>＋</span>

                    <span>
                      Add your first song
                    </span>
                  </button>

                </div>

              ) : filteredTracks.length === 0 ? (
                <div className="music-empty">

                  <span>
                    {showFavoritesOnly
                      ? "♡"
                      : "⌕"}
                  </span>

                  <h3>
                    {showFavoritesOnly
                      ? "No favorite songs yet"
                      : "No songs found"}
                  </h3>

                  <p>
                    {showFavoritesOnly
                      ? "Mark songs with a heart and they'll appear here."
                      : "Try another title, artist, or album."}
                  </p>

                  {showFavoritesOnly && (
                    <button
                      className="music-add-button"
                      onClick={() =>
                        setShowFavoritesOnly(
                          false
                        )
                      }
                    >
                      <span>♪</span>

                      <span>
                        Show all songs
                      </span>
                    </button>
                  )}

                </div>

              ) : (
                filteredTracks.map(
                  (track, index) => {
                    const isSelected =
                      selectedTrack?.id ===
                      track.id;

                    return (
                      <div
                        key={track.id}
                        className={`music-track-row ${
                          isSelected
                            ? "music-track-row-selected"
                            : ""
                        }`}
                      >

                        {/* TRACK MAIN */}

                        <button
                          className="music-track-main"
                          type="button"
                          onClick={() =>
                            handleSelectTrack(
                              track
                            )
                          }
                        >

                          <span className="music-track-number">
                            {String(
                              musicTracks.indexOf(
                                track
                              ) + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <span className="music-track-icon">
                            {track.icon}
                          </span>

                          <span className="music-track-info">

                            <strong>
                              {track.title}
                            </strong>

                            <small>
                              {track.artist}

                              {track.album
                                ? ` · ${track.album}`
                                : ""}
                            </small>

                          </span>

                          {track.spotifyId && (
                            <span
                              className="music-spotify-badge"
                              title="Available on Spotify"
                            >
                              ♪
                            </span>
                          )}

                          <span className="music-track-duration">
                            {track.duration ||
                              "--:--"}
                          </span>

                        </button>

                        {/* ACTIONS */}

                        <div className="music-track-actions">

                          {/* FAVORITE */}

                          <button
                            type="button"
                            className={`music-track-action ${
                              track.favorite
                                ? "music-track-action-favorite"
                                : ""
                            }`}
                            onClick={(event) =>
                              handleToggleFavorite(
                                event,
                                track
                              )
                            }
                            aria-label={
                              track.favorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            {track.favorite
                              ? "♥"
                              : "♡"}
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            className="music-track-action"
                            onClick={(event) => {
                              event.stopPropagation();

                              setEditingTrack(
                                track
                              );
                            }}
                            aria-label="Edit song"
                          >
                            ✎
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="music-track-action music-track-action-delete"
                            onClick={(event) => {
                              event.stopPropagation();

                              setTrackToDelete(
                                track
                              );
                            }}
                            aria-label="Delete song"
                          >
                            🗑
                          </button>

                        </div>

                      </div>
                    );
                  }
                )
              )}

            </div>

          </section>
        )}

        {/* =================================
            SELECTED TRACK
        ================================= */}

        {!loading &&
          !error &&
          selectedTrack && (
            <section className="music-selected-track">

              <div className="music-selected-art">
                {selectedTrack.icon}
              </div>

              <div className="music-selected-info">

                <span>
                  NOW SELECTED
                </span>

                <h3>
                  {selectedTrack.title}
                </h3>

                <p>
                  {selectedTrack.artist}

                  {selectedTrack.album
                    ? ` · ${selectedTrack.album}`
                    : ""}
                </p>

                {selectedTrack.description && (
                  <small>
                    {selectedTrack.description}
                  </small>
                )}

              </div>

              <div className="music-selected-actions">

                {selectedTrack.spotifyId ? (
                  <a
                    href={`https://open.spotify.com/track/${selectedTrack.spotifyId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="music-selected-spotify"
                  >
                    <span>▶</span>
                    <span>
                      Open on Spotify
                    </span>
                  </a>
                ) : (
                  <span className="music-no-spotify">
                    No Spotify track linked
                  </span>
                )}

                <button
                  type="button"
                  onClick={
                    handleCloseSelectedTrack
                  }
                  className="music-selected-close"
                  aria-label="Close selected track"
                >
                  ×
                </button>

              </div>

            </section>
          )}

        {/* =================================
            SPOTIFY
        ================================= */}

        {!loading && !error && (
          <SpotifyPlaylist
            selectedTrack={selectedTrack}
          />
        )}

      </section>

      {/* =================================
          FOOTER
      ================================= */}

      <footer className="music-footer">

        <span>✦</span>

        <span>
          Every song has a story. Ours has a soundtrack.
        </span>

        <span>✦</span>

      </footer>

      {/* =================================
          ADD TRACK
      ================================= */}

      {showAddTrack && (
        <MusicTrackForm
          onSave={handleAddTrack}
          onClose={() =>
            setShowAddTrack(false)
          }
          saving={saving}
        />
      )}

      {/* =================================
          EDIT TRACK
      ================================= */}

      {editingTrack && (
        <MusicTrackForm
          track={editingTrack}
          onSave={handleEditTrack}
          onClose={() =>
            setEditingTrack(null)
          }
          saving={saving}
        />
      )}

      {/* =================================
          DELETE CONFIRMATION
      ================================= */}

      {trackToDelete && (
        <ConfirmMusicDelete
          track={trackToDelete}
          onConfirm={handleDeleteTrack}
          onCancel={() =>
            setTrackToDelete(null)
          }
          deleting={deleting}
        />
      )}

    </main>
  );
}

export default MusicWorld;