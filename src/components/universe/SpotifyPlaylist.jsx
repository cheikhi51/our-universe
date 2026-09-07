import { useEffect, useRef } from "react";

const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/7ddBs9pW4Tmm9XuMkqVofw";

function SpotifyPlaylist() {
  const embedRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const initializeSpotify = (IFrameAPI) => {
      if (!embedRef.current) return;

      if (controllerRef.current) return;

      const options = {
        width: "100%",
        height: "352",
        url: SPOTIFY_PLAYLIST_URL,
      };

      IFrameAPI.createController(
        embedRef.current,
        options,
        (EmbedController) => {
          controllerRef.current =
            EmbedController;
        }
      );
    };

    /*
     * Spotify API may already exist
     */
    if (window.SpotifyIframeApi) {
      initializeSpotify(
        window.SpotifyIframeApi
      );
    }

    /*
     * Spotify calls this when
     * the API becomes available.
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
     * Load Spotify's iframe API
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
      controllerRef.current = null;
    };
  }, []);

  return (
    <section className="spotify-section">

      <div className="spotify-header">

        <div>

          <span className="spotify-eyebrow">
            OUR EXTERNAL SOUNDTRACK
          </span>

          <h2>
            Our Spotify Playlist
          </h2>

          <p>
            The songs we chose to keep
            together.
          </p>

        </div>

        <span className="spotify-icon">
          🎧
        </span>

      </div>

      <div className="spotify-embed">

        <div
          ref={embedRef}
          className="spotify-iframe-container"
        />

      </div>

      <a
        className="spotify-open-link"
        href={SPOTIFY_PLAYLIST_URL}
        target="_blank"
        rel="noreferrer"
      >
        <span>
          Open in Spotify
        </span>

        <span>
          ↗
        </span>
      </a>

    </section>
  );
}

export default SpotifyPlaylist;

