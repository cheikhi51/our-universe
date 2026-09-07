import { useEffect, useRef, useState } from "react";
import { musicTracks } from "../../../data/music";

function MusicWorld({ onBack }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const openTrack = (track, autoPlay = true) => {
    setSelectedTrack(track);
    setCurrentTime(0);
    setDuration(0);

    if (autoPlay) {
      setIsPlaying(true);
    }
  };

  const closeTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsPlaying(false);
    setSelectedTrack(null);
    setCurrentTime(0);
  };

  /* =================================
     PLAY / PAUSE
  ================================= */

  const togglePlay = async () => {
    if (!audioRef.current || !selectedTrack) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Unable to play audio:", error);
        setIsPlaying(false);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  /* =================================
     NEXT TRACK
  ================================= */

  const playNext = () => {
    if (!selectedTrack) return;

    const currentIndex = musicTracks.findIndex(
      (track) => track.id === selectedTrack.id
    );

    const nextIndex =
      (currentIndex + 1) % musicTracks.length;

    openTrack(musicTracks[nextIndex], true);
  };

  /* =================================
     PREVIOUS TRACK
  ================================= */

  const playPrevious = () => {
    if (!selectedTrack) return;

    const currentIndex = musicTracks.findIndex(
      (track) => track.id === selectedTrack.id
    );

    const previousIndex =
      (currentIndex - 1 + musicTracks.length) %
      musicTracks.length;

    openTrack(musicTracks[previousIndex], true);
  };

  /* =================================
     AUDIO EVENTS
  ================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !selectedTrack) return;

    audio.src = selectedTrack.src;
    audio.load();

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    if (isPlaying) {
      audio
        .play()
        .catch((error) => {
          console.error("Unable to autoplay:", error);
          setIsPlaying(false);
        });
    }

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [selectedTrack]);

  /* =================================
     KEYBOARD
  ================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeTrack();
      }

      if (
        event.code === "Space" &&
        selectedTrack
      ) {
        event.preventDefault();
        togglePlay();
      }

      if (
        event.key === "ArrowRight" &&
        selectedTrack
      ) {
        playNext();
      }

      if (
        event.key === "ArrowLeft" &&
        selectedTrack
      ) {
        playPrevious();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedTrack]);

  /* =================================
     SEEK
  ================================= */

  const handleProgressClick = (event) => {
    if (!audioRef.current || !duration) return;

    const rect =
      progressRef.current.getBoundingClientRect();

    const clickPosition =
      event.clientX - rect.left;

    const percentage =
      clickPosition / rect.width;

    audioRef.current.currentTime =
      percentage * duration;

    setCurrentTime(
      percentage * duration
    );
  };

  /* =================================
     TIME FORMAT
  ================================= */

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return (
    <main className="music-world">

      {/* =================================
          AUDIO ELEMENT
      ================================= */}

      <audio ref={audioRef} />

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
            songs
          </small>

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

          <div
            className={`music-record ${
              isPlaying
                ? "music-record-playing"
                : ""
            }`}
          >

            <div className="music-record-center">
              <span>💗</span>
            </div>

          </div>

          <div className="music-featured-info">

            <span className="music-featured-label">
              OUR FAVORITE
            </span>

            <h2>
              {musicTracks[0].title}
            </h2>

            <p>
              {musicTracks[0].description}
            </p>

            <div className="music-featured-meta">

              <span>
                {musicTracks[0].artist}
              </span>

              <span>•</span>

              <span>
                {musicTracks[0].album}
              </span>

            </div>

            <button
              className="music-play-button"
              onClick={() => {
                if (
                  selectedTrack?.id ===
                  musicTracks[0].id
                ) {
                  togglePlay();
                } else {
                  openTrack(
                    musicTracks[0],
                    true
                  );
                }
              }}
            >

              <span>
                {selectedTrack?.id ===
                  musicTracks[0].id &&
                isPlaying
                  ? "❚❚"
                  : "▶"}
              </span>

              <span>
                {selectedTrack?.id ===
                  musicTracks[0].id &&
                isPlaying
                  ? "Pause"
                  : "Listen"}
              </span>

            </button>

          </div>

        </section>

        {/* Track list */}

        <section className="music-list">

          <div className="music-list-header">

            <h2>
              Our Soundtrack
            </h2>

            <span>
              {musicTracks.length} songs
            </span>

          </div>

          <div className="music-tracks">

            {musicTracks.map(
              (track, index) => {

                const active =
                  selectedTrack?.id ===
                  track.id;

                return (
                  <button
                    key={track.id}
                    className={`music-track ${
                      active
                        ? "music-track-active"
                        : ""
                    }`}
                    onClick={() => {

                      if (active) {
                        togglePlay();
                      } else {
                        openTrack(
                          track,
                          true
                        );
                      }

                    }}
                  >

                    <span className="music-track-number">

                      {active && isPlaying
                        ? "♫"
                        : String(index + 1).padStart(
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
                        {track.artist} ·{" "}
                        {track.album}
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

                      {active && isPlaying
                        ? "❚❚"
                        : "→"}

                    </span>

                  </button>
                );
              }
            )}

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

      {/* =================================
          PLAYER
      ================================= */}

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
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div
              className={`music-player-record ${
                isPlaying
                  ? "music-player-record-playing"
                  : ""
              }`}
            >

              <div className="music-player-record-center">
                {selectedTrack.icon}
              </div>

            </div>

            <span className="music-player-label">
              {isPlaying
                ? "NOW PLAYING"
                : "PAUSED"}
            </span>

            <h2>
              {selectedTrack.title}
            </h2>

            <p className="music-player-artist">
              {selectedTrack.artist} ·{" "}
              {selectedTrack.album}
            </p>

            {/* Progress */}

            <div
              ref={progressRef}
              className="music-player-progress"
              onClick={handleProgressClick}
            >

              <span
                style={{
                  width:
                    duration > 0
                      ? `${(
                          (currentTime /
                            duration) *
                          100
                        ).toFixed(2)}%`
                      : "0%",
                }}
              />

            </div>

            <div className="music-player-time">

              <span>
                {formatTime(currentTime)}
              </span>

              <span>
                {duration
                  ? formatTime(duration)
                  : selectedTrack.duration}
              </span>

            </div>

            {/* Controls */}

            <div className="music-player-controls">

              <button
                onClick={playPrevious}
                aria-label="Previous"
              >
                ⏮
              </button>

              <button
                className="music-player-play"
                onClick={togglePlay}
                aria-label={
                  isPlaying
                    ? "Pause"
                    : "Play"
                }
              >
                {isPlaying
                  ? "❚❚"
                  : "▶"}
              </button>

              <button
                onClick={playNext}
                aria-label="Next"
              >
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

