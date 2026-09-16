import { useEffect, useRef, useState } from "react";
import {  updateMySpotifyPlaylist } from "../../services/spotifyService";
function SpotifyPlaylist({
  playlistId = null,
  playlistUrl = null,
  selectedTrack = null,
}) {
  const embedRef = useRef(null);
  const controllerRef = useRef(null);

  const [spotifyReady, setSpotifyReady] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isTrackMode, setIsTrackMode] =
    useState(false);

    const [showPlaylistModal, setShowPlaylistModal] =
  useState(false);

const [playlistInput, setPlaylistInput] =
  useState("");

const [playlistError, setPlaylistError] =
  useState("");

const [playlistSaving, setPlaylistSaving] =
  useState(false);

  /* =================================
     DERIVED PLAYLIST VALUES
  ================================= */

  const playlistUri = playlistId
    ? `spotify:playlist:${playlistId}`
    : null;

  /* =================================
     INITIALIZE SPOTIFY
  ================================= */
  const extractSpotifyPlaylistId = (value) => {
  if (!value?.trim()) {
    return null;
  }

  const input = value.trim();

  // Direct Spotify playlist ID
  if (/^[a-zA-Z0-9]{22}$/.test(input)) {
    return input;
  }

  // Spotify playlist URL
  const match = input.match(
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/
  );

  return match?.[1] || null;
};


const handleSavePlaylist = async () => {
  setPlaylistError("");

  const playlistId =
    extractSpotifyPlaylistId(
      playlistInput
    );

  if (!playlistId) {
    setPlaylistError(
      "Please enter a valid Spotify playlist URL."
    );

    return;
  }

  const normalizedUrl =
    `https://open.spotify.com/playlist/${playlistId}`;

  try {
    setPlaylistSaving(true);

    await updateMySpotifyPlaylist(
      playlistId,
      normalizedUrl
    );

    setShowPlaylistModal(false);

    setPlaylistInput("");

    // Refresh the page state so the new
    // playlist is loaded from Supabase.
    window.location.reload();
  } catch (err) {
    console.error(
      "Failed to save Spotify playlist:",
      err
    );

    setPlaylistError(
      err?.message ||
        "Unable to connect this playlist."
    );
  } finally {
    setPlaylistSaving(false);
  }
};

const closePlaylistModal = () => {
  if (playlistSaving) return;

  setShowPlaylistModal(false);
  setPlaylistInput("");
  setPlaylistError("");
};


  useEffect(() => {
    let mounted = true;

    const initializeSpotify = (
      IFrameAPI
    ) => {
      if (!embedRef.current) return;

      if (controllerRef.current) return;

      const options = {
        width: "100%",
        height: "180",
        url:
          playlistUrl ||
          "https://open.spotify.com/embed/playlist/",
      };

      IFrameAPI.createController(
        embedRef.current,
        options,
        (EmbedController) => {
          if (!mounted) return;

          controllerRef.current =
            EmbedController;

          setSpotifyReady(true);

          EmbedController.addListener(
            "ready",
            () => {
              setSpotifyReady(true);
            }
          );

          EmbedController.addListener(
            "playback_started",
            () => {
              setIsPlaying(true);
            }
          );

          EmbedController.addListener(
            "playback_update",
            (event) => {
              if (event?.data) {
                setIsPlaying(
                  !event.data.isPaused
                );
              }
            }
          );

          EmbedController.addListener(
            "playback_error",
            () => {
              setIsPlaying(false);
            }
          );
        }
      );
    };

    if (window.SpotifyIframeApi) {
      initializeSpotify(
        window.SpotifyIframeApi
      );
    }

    const previousCallback =
      window.onSpotifyIframeApiReady;

    window.onSpotifyIframeApiReady =
      (IFrameAPI) => {
        window.SpotifyIframeApi =
          IFrameAPI;

        initializeSpotify(
          IFrameAPI
        );

        if (previousCallback) {
          previousCallback(IFrameAPI);
        }
      };

    const existingScript =
      document.querySelector(
        'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
      );

    if (!existingScript) {
      const script =
        document.createElement("script");

      script.src =
        "https://open.spotify.com/embed/iframe-api/v1";

      script.async = true;

      document.body.appendChild(script);
    }

    return () => {
      mounted = false;

      if (controllerRef.current) {
        controllerRef.current.destroy();

        controllerRef.current = null;
      }
    };
  }, []);

  /* =================================
     LOAD UNIVERSE PLAYLIST
  ================================= */

  useEffect(() => {
    const controller =
      controllerRef.current;

    if (
      !controller ||
      !spotifyReady
    ) {
      return;
    }

    if (!playlistUri) {
      setIsTrackMode(false);
      setIsPlaying(false);
      return;
    }

    try {
      controller.loadUri(
        playlistUri
      );

      setIsTrackMode(false);
      setIsPlaying(false);
    } catch (err) {
      console.error(
        "❌ Failed to load Spotify playlist:",
        err
      );
    }
  }, [
    playlistUri,
    spotifyReady,
  ]);

  /* =================================
     LOAD SELECTED TRACK
  ================================= */

  useEffect(() => {
    const controller =
      controllerRef.current;

    if (
      !controller ||
      !spotifyReady
    ) {
      return;
    }

    if (!selectedTrack?.spotifyId) {
      return;
    }

    const trackUri =
      `spotify:track:${selectedTrack.spotifyId}`;

    try {
      controller.loadUri(trackUri);

      setIsTrackMode(true);
      setIsPlaying(false);
    } catch (err) {
      console.error(
        "❌ Failed to load Spotify track:",
        err
      );
    }
  }, [
    selectedTrack,
    spotifyReady,
  ]);

  /* =================================
     PLAY / PAUSE
  ================================= */

  const togglePlayback = () => {
    const controller =
      controllerRef.current;

    if (!controller) return;

    controller.togglePlay();
  };

  /* =================================
     RETURN TO PLAYLIST
  ================================= */

  const returnToPlaylist = () => {
    const controller =
      controllerRef.current;

    if (!controller || !playlistUri) {
      return;
    }

    try {
      controller.loadUri(
        playlistUri
      );

      setIsTrackMode(false);
      setIsPlaying(false);
    } catch (err) {
      console.error(
        "❌ Failed to return to Spotify playlist:",
        err
      );
    }
  };

  /* =================================
     NO PLAYLIST CONFIGURED
  ================================= */

  if (!playlistId) {
  return (
    <>
      <section className="spotify-section spotify-empty">
        <div className="spotify-header">
          <div>
            <span className="spotify-eyebrow">
              OUR SOUNDTRACK
            </span>

            <h2>
              Our Spotify Universe
            </h2>

            <p>
              This universe doesn't have
              a Spotify playlist yet.
            </p>
          </div>

          <div className="spotify-icon">
            🎧
          </div>
        </div>

        <div className="spotify-empty-state">
          <div className="spotify-empty-icon">
            🎵
          </div>

          <h3>
            No playlist connected
          </h3>

          <p>
            Add your couple's Spotify
            playlist to bring your
            soundtrack into this universe.
          </p>

          <button
            type="button"
            className="spotify-connect-button"
            onClick={() => {
              setPlaylistInput("");
              setPlaylistError("");
              setShowPlaylistModal(true);
            }}
          >
            <span>🎧</span>
            <span>
              Connect Spotify Playlist
            </span>
          </button>
        </div>
      </section>

      {showPlaylistModal && (
        <SpotifyPlaylistModal
          playlistInput={playlistInput}
          setPlaylistInput={setPlaylistInput}
          playlistError={playlistError}
          playlistSaving={playlistSaving}
          onClose={closePlaylistModal}
          onSave={handleSavePlaylist}
        />
      )}
    </>
  );
}

  return (
    <>
    <section
      className={`spotify-section ${
        isTrackMode
          ? "spotify-track-mode"
          : ""
      }`}
    >
      <div className="spotify-header">
        <div>
          <span className="spotify-eyebrow">
            {isTrackMode
              ? "NOW PLAYING"
              : "OUR SOUNDTRACK"}
          </span>

          <h2>
            {selectedTrack
              ? selectedTrack.title
              : "Our Spotify Universe"}
          </h2>

          <p>
            {selectedTrack
              ? selectedTrack.artist
              : "The songs that sound like us."}
          </p>
        </div>

        <div className="spotify-icon">
          {selectedTrack?.icon ||
            "🎧"}
        </div>
      </div>

      <div className="spotify-custom-player">
        <div className="spotify-player-info">
          <div className="spotify-player-art">
            {selectedTrack?.icon ||
              "💗"}
          </div>

          <div>
            <span>
              {isTrackMode
                ? "PLAYING FROM SPOTIFY"
                : "OUR PLAYLIST"}
            </span>

            <strong>
              {selectedTrack
                ? selectedTrack.title
                : "Our Spotify Playlist"}
            </strong>

            <small>
              {selectedTrack
                ? selectedTrack.artist
                : "The soundtrack of our universe"}
            </small>
          </div>
        </div>

        <button
          className="spotify-main-play"
          onClick={togglePlayback}
          disabled={!spotifyReady}
          aria-label={
            isPlaying
              ? "Pause Spotify"
              : "Play Spotify"
          }
        >
          {isPlaying
            ? "❚❚"
            : "▶"}
        </button>
      </div>

      <div className="spotify-embed">
        <div
          ref={embedRef}
          className="spotify-iframe-container"
        />
      </div>

      <div className="spotify-player-actions">
        {isTrackMode ? (
          <button
            type="button"
            className="spotify-back-playlist"
            onClick={returnToPlaylist}
          >
            <span>←</span>

            <span>
              Back to our playlist
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="spotify-change-playlist"
            onClick={() => {
              setPlaylistInput(
                playlistUrl || ""
              );

              setPlaylistError("");
              setShowPlaylistModal(true);
            }}
          >
            <span>🎧</span>
            <span>
              Change playlist
            </span>
          </button>
        )}

        <a
          className="spotify-open-link"
          href={
            selectedTrack?.spotifyId
              ? `https://open.spotify.com/track/${selectedTrack.spotifyId}`
              : playlistUrl
          }
          target="_blank"
          rel="noreferrer"
        >
          <span>
            {selectedTrack?.spotifyId
              ? "Open in Spotify"
              : "Open full playlist"}
          </span>

          <span>↗</span>
        </a>
      </div>
    </section>

    {showPlaylistModal && (
      <SpotifyPlaylistModal
        playlistInput={playlistInput}
        setPlaylistInput={setPlaylistInput}
        playlistError={playlistError}
        playlistSaving={playlistSaving}
        onClose={closePlaylistModal}
        onSave={handleSavePlaylist}
      />
    )}
  </>
    
  );
}
function SpotifyPlaylistModal({
  playlistInput,
  setPlaylistInput,
  playlistError,
  playlistSaving,
  onClose,
  onSave,
}) {
  return (
    <div
      className="spotify-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !playlistSaving
        ) {
          onClose();
        }
      }}
    >
      <div
        className="spotify-playlist-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="spotify-playlist-title"
      >
        <button
          type="button"
          className="spotify-modal-close"
          onClick={onClose}
          disabled={playlistSaving}
          aria-label="Close"
        >
          ×
        </button>

        <div className="spotify-modal-icon">
          🎧
        </div>

        <span className="spotify-eyebrow">
          OUR SOUNDTRACK
        </span>

        <h2 id="spotify-playlist-title">
          Connect our playlist
        </h2>

        <p className="spotify-modal-description">
          Bring the songs that sound like
          us into this universe.
        </p>

        <label
          className="spotify-playlist-label"
          htmlFor="spotify-playlist-input"
        >
          Spotify playlist URL
        </label>

        <input
          id="spotify-playlist-input"
          type="text"
          value={playlistInput}
          onChange={(event) => {
            setPlaylistInput(
              event.target.value
            );

            if (playlistError) {
              setPlaylistError("");
            }
          }}
          placeholder="https://open.spotify.com/playlist/..."
          autoFocus
          disabled={playlistSaving}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSave();
            }

            if (event.key === "Escape") {
              onClose();
            }
          }}
        />

        {playlistError && (
          <p className="spotify-modal-error">
            {playlistError}
          </p>
        )}

        <p className="spotify-modal-hint">
          Open your playlist in Spotify, copy
          its link, and paste it here.
        </p>

        <div className="spotify-modal-actions">
          <button
            type="button"
            className="spotify-modal-cancel"
            onClick={onClose}
            disabled={playlistSaving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="spotify-modal-save"
            onClick={onSave}
            disabled={
              playlistSaving ||
              !playlistInput.trim()
            }
          >
            {playlistSaving ? (
              <>
                <span className="spotify-spinner" />
                Connecting...
              </>
            ) : (
              <>
                <span>🎧</span>
                Connect Playlist
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default SpotifyPlaylist;