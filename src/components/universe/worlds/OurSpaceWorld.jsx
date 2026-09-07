import { useEffect, useState } from "react";
import { ourSpace } from "../../../data/ourSpace";

function OurSpaceWorld({ onBack }) {
  const [selectedDream, setSelectedDream] = useState(null);

  const openDream = (dream) => {
    setSelectedDream(dream);
  };

  const closeDream = () => {
    setSelectedDream(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDream();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="our-space-world">
      {/* Background */}
      <div className="our-space-stars our-space-stars-one" />
      <div className="our-space-stars our-space-stars-two" />
      <div className="our-space-stars our-space-stars-three" />

      <div className="our-space-nebula our-space-nebula-one" />
      <div className="our-space-nebula our-space-nebula-two" />

      {/* Header */}
      <header className="our-space-header">
        <button
          className="our-space-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <div className="our-space-title">
          <span className="our-space-icon">🌙</span>

          <div>
            <p className="our-space-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>Our Space</h1>

            <p className="our-space-subtitle">
              The dreams and future we're building together.
            </p>
          </div>
        </div>

        <div className="our-space-counter">
          <span>{ourSpace.length}</span>
          <small>dreams</small>
        </div>
      </header>

      {/* Main content */}
      <section className="our-space-content">
        <div className="our-space-intro">
          <span className="our-space-line" />

          <p>
            Some dreams already have a destination.
            <br />
            Others are simply waiting for their moment.
          </p>

          <span className="our-space-line" />
        </div>

        {/* Cosmic center */}
        <div className="our-space-orbit-system">
          <div className="our-space-orbit our-space-orbit-one" />
          <div className="our-space-orbit our-space-orbit-two" />
          <div className="our-space-orbit our-space-orbit-three" />

          <div className="our-space-moon">
            <div className="our-space-moon-glow" />

            <span>🌙</span>

            <strong>US</strong>

            <small>Someday</small>
          </div>

          {ourSpace.map((dream, index) => (
            <button
              key={dream.id}
              className={`our-space-dream our-space-dream-${index + 1}`}
              onClick={() => openDream(dream)}
            >
              <span className="our-space-dream-icon">
                {dream.icon}
              </span>

              <span className="our-space-dream-info">
                <strong>{dream.title}</strong>
                <small>{dream.type}</small>
              </span>

              {dream.favorite && (
                <span className="our-space-dream-favorite">
                  ♥
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="our-space-hint">
          <span>✦</span>
          <span>Click a dream to explore it</span>
          <span>✦</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="our-space-footer">
        <span>✦</span>

        <span>
          The best chapters of our story are still unwritten.
        </span>

        <span>✦</span>
      </footer>

      {/* Dream viewer */}
      {selectedDream && (
        <div
          className="our-space-viewer"
          role="dialog"
          aria-modal="true"
          onClick={closeDream}
        >
          <button
            className="our-space-viewer-close"
            onClick={closeDream}
            aria-label="Close dream"
          >
            ×
          </button>

          <article
            className="our-space-viewer-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="our-space-viewer-icon">
              {selectedDream.icon}
            </div>

            <span className="our-space-viewer-type">
              {selectedDream.type}
            </span>

            <h2>{selectedDream.title}</h2>

            <div className="our-space-viewer-divider">
              <span>✦</span>
            </div>

            <p>{selectedDream.text}</p>

            <div className="our-space-items">
              {selectedDream.items.map((item, index) => (
                <div
                  className="our-space-item"
                  key={index}
                >
                  <span>✦</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            {selectedDream.favorite && (
              <div className="our-space-viewer-favorite">
                ♥ One of our dreams
              </div>
            )}

            <div className="our-space-viewer-number">
              Dream{" "}
              {ourSpace.findIndex(
                (dream) =>
                  dream.id === selectedDream.id
              ) + 1}
              {" / "}
              {ourSpace.length}
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

export default OurSpaceWorld;