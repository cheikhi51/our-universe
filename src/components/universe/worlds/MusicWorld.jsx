import { useEffect, useState } from "react";
import { musicTracks } from "../../../data/music";

function MusicWorld({ onBack }) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  const openTrack = (track) => {
    setSelectedTrack(track);
  };

  const closeTrack = () => {
    setSelectedTrack(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeTrack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="music-world">
      {/* Atmosphere */}
      <div className="music-stars music-stars-one" />
      <div className="music-stars music-stars-two" />
      <div className="music-stars music-stars-three" />

      <div className="music-nebula music-nebula-one" />
      <div className="music-nebula music-nebula-two" />

      {/* Header */}
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
          <span className="music-icon">🎵</span>

          <div>
            <p className="music-eyebrow">OUR UNIVERSE</p>

            <h1>Music</h1>

            <p className="music-subtitle">
              The soundtrack of our universe.
            </p>
          </div>
        </div>

        <div className="music-counter">
          <span>{musicTracks.length}</span>
          <small>songs</small>
        </div>
      </header>

      {/* Intro */}
      <section className="music-content">
        <div className="music-intro">
          <span className="music-line" />

          <p>
            Some songs are just songs.
            <br />
            Others become memories.
          </p>

          <span className="music-line" />
        </div>

        {/* Featured */}
        <section className="music-featured">
          <div className="music-record">
            <div className="music-record-center">
              <span>💗</span>
            </div>
          </div>

          <div className="music-featured-info">
            <span className="music-featured-label">
              OUR FAVORITE
            </span>

            <h2>{musicTracks[0].title}</h2>

            <p>
              {musicTracks[0].description}
            </p>

            <div className="music-featured-meta">
              <span>{musicTracks[0].artist}</span>
              <span>•</span>
              <span>{musicTracks[0].album}</span>
            </div>

            <button
              className="music-play-button"
              onClick={() => openTrack(musicTracks[0])}
            >
              <span>▶</span>
              <span>Listen</span>
            </button>
          </div>
        </section>

        {/* Track list */}
        <section className="music-list">
          <div className="music-list-header">
            <h2>Our Soundtrack</h2>

            <span>
              {musicTracks.length} songs
            </span>
          </div>

          <div className="music-tracks">
            {musicTracks.map((track, index) => (
              <button
                key={track.id}
                className="music-track"
                onClick={() => openTrack(track)}
              >
                <span className="music-track-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="music-track-icon">
                  {track.icon}
                </span>

                <span className="music-track-info">
                  <strong>{track.title}</strong>

                  <small>
                    {track.artist} · {track.album}
                  </small>
                </span>

                {track.favorite && (
                  <span className="music-track-favorite">
                    ♥
                  </span>
                )}

                <span className="music-track-duration">
                  {track.duration}
                </span>

                <span className="music-track-arrow">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="music-footer">
        <span>✦</span>
        <span>
          Every song has a story. Ours has a soundtrack.
        </span>
        <span>✦</span>
      </footer>

      {/* Track viewer */}
      {selectedTrack && (
        <div
          className="music-player"
          role="dialog"
          aria-modal="true"
          onClick={closeTrack}
        >
          <button
            className="music-player-close"
            onClick={closeTrack}
            aria-label="Close player"
          >
            ×
          </button>

          <article
            className="music-player-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="music-player-record">
              <div className="music-player-record-center">
                {selectedTrack.icon}
              </div>
            </div>

            <span className="music-player-label">
              NOW PLAYING
            </span>

            <h2>{selectedTrack.title}</h2>

            <p className="music-player-artist">
              {selectedTrack.artist} · {selectedTrack.album}
            </p>

            <div className="music-player-progress">
              <span />
            </div>

            <div className="music-player-time">
              <span>0:00</span>
              <span>{selectedTrack.duration}</span>
            </div>

            <div className="music-player-controls">
              <button aria-label="Previous">
                ⏮
              </button>

              <button
                className="music-player-play"
                aria-label="Play"
              >
                ▶
              </button>

              <button aria-label="Next">
                ⏭
              </button>
            </div>

            <p className="music-player-description">
              {selectedTrack.description}
            </p>
          </article>
        </div>
      )}
    </main>
  );
}

export default MusicWorld;