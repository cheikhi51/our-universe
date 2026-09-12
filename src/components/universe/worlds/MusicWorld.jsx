import SpotifyPlaylist from "../SpotifyPlaylist";

function MusicWorld({ onBack }) {
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

            <h1>
              Music
            </h1>

            <p className="music-subtitle">
              The soundtrack of our universe.
            </p>

          </div>

        </div>


        <div className="music-counter">

          <span>
            Spotify
          </span>

          <small>
            playlist
          </small>

        </div>

      </header>


      {/* =================================
          MAIN CONTENT
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
              <span>
                💗
              </span>
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

              <span>
                Us
              </span>

              <span>
                •
              </span>

              <span>
                Our Universe
              </span>

            </div>

          </div>

        </section>


        {/* =================================
            SPOTIFY
        ================================= */}

        <SpotifyPlaylist />


      </section>


      {/* =================================
          FOOTER
      ================================= */}

      <footer className="music-footer">

        <span>
          ✦
        </span>

        <span>
          Every song has a story. Ours has a soundtrack.
        </span>

        <span>
          ✦
        </span>

      </footer>

    </main>
  );
}

export default MusicWorld;