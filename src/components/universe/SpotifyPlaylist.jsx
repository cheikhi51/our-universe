import { useEffect, useRef, useState } from "react";

const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/7ddBs9pW4Tmm9XuMkqVofw";

function SpotifyPlaylist() {
  const embedRef = useRef(null);
  const controllerRef = useRef(null);

  const [spotifyReady, setSpotifyReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeSpotify = (IFrameAPI) => {
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
        }
      );
    };

    /*
     * Spotify API already loaded
     */
    if (window.SpotifyIframeApi) {
      initializeSpotify(
        window.SpotifyIframeApi
      );
    }

    /*
     * Spotify API ready callback
     */
    const previousCallback =
      window.onSpotifyIframeApiReady;

    window.onSpotifyIframeApiReady =
      (IFrameAPI) => {
        window.SpotifyIframeApi =
          IFrameAPI;

        initializeSpotify(IFrameAPI);

        if (previousCallback) {
          previousCallback(IFrameAPI);
        }
      };

    /*
     * Load Spotify iFrame API
     */
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

  const togglePlayback = () => {
    const controller =
      controllerRef.current;

    if (!controller) return;

    controller.togglePlay();
  };

  return (
    <section className="spotify-section">

      {/* =================================
          HEADER
      ================================= */}

      <div className="spotify-header">

        <div>

          <span className="spotify-eyebrow">
            OUR SOUNDTRACK
          </span>

          <h2>
            Our Spotify Universe
          </h2>

          <p>
            The songs that sound like us.
          </p>

        </div>

        <div className="spotify-icon">
          🎧
        </div>

      </div>


      {/* =================================
          CUSTOM PLAYER HEADER
      ================================= */}

      <div className="spotify-custom-player">

        <div className="spotify-player-info">

          <div className="spotify-player-art">
            💗
          </div>

          <div>

            <span>
              NOW PLAYING
            </span>

            <strong>
              Our Spotify Playlist
            </strong>

            <small>
              Tap a song below to listen
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
          {isPlaying ? "❚❚" : "▶"}
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
          OPEN SPOTIFY
      ================================= */}

      <a
        className="spotify-open-link"
        href={SPOTIFY_PLAYLIST_URL}
        target="_blank"
        rel="noreferrer"
      >
        <span>
          Open full playlist in Spotify
        </span>

        <span>
          ↗
        </span>
      </a>

    </section>
  );
}

export default SpotifyPlaylist;

