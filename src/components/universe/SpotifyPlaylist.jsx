import { useEffect, useRef, useState } from "react";

const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/7ddBs9pW4Tmm9XuMkqVofw";

const SPOTIFY_PLAYLIST_URI =
  "spotify:playlist:7ddBs9pW4Tmm9XuMkqVofw";

function SpotifyPlaylist({
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

  /* =================================
     INITIALIZE SPOTIFY
  ================================= */

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
        url: SPOTIFY_PLAYLIST_URL,
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

    if (!controller) return;

    try {
      controller.loadUri(
        SPOTIFY_PLAYLIST_URI
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

  return (
    <section
      className={`spotify-section ${
        isTrackMode
          ? "spotify-track-mode"
          : ""
      }`}
    >

      {/* =================================
          HEADER
      ================================= */}

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

      {/* =================================
          CUSTOM PLAYER
      ================================= */}

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

      {/* =================================
          SPOTIFY EMBED
      ================================= */}

      <div className="spotify-embed">

        <div
          ref={embedRef}
          className="spotify-iframe-container"
        />

      </div>

      {/* =================================
          PLAYER ACTIONS
      ================================= */}

      <div className="spotify-player-actions">

        {isTrackMode ? (
          <button
            type="button"
            className="spotify-back-playlist"
            onClick={
              returnToPlaylist
            }
          >
            <span>←</span>

            <span>
              Back to our playlist
            </span>
          </button>
        ) : (
          <span className="spotify-player-hint">
            Select a song from our soundtrack
          </span>
        )}

        <a
          className="spotify-open-link"
          href={
            selectedTrack?.spotifyId
              ? `https://open.spotify.com/track/${selectedTrack.spotifyId}`
              : SPOTIFY_PLAYLIST_URL
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
  );
}

export default SpotifyPlaylist;