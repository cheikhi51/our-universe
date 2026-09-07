import { useEffect, useState } from "react";
import { moments } from "../../../data/moments";

function MomentsWorld({ onBack }) {
  const [selectedMoment, setSelectedMoment] = useState(null);

  const openMoment = (moment) => {
    setSelectedMoment(moment);
  };

  const closeMoment = () => {
    setSelectedMoment(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMoment();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="moments-world">
      {/* Atmosphere */}
      <div className="moments-stars moments-stars-one" />
      <div className="moments-stars moments-stars-two" />
      <div className="moments-stars moments-stars-three" />

      <div className="moments-nebula moments-nebula-one" />
      <div className="moments-nebula moments-nebula-two" />

      {/* Header */}
      <header className="moments-header">
        <button
          className="moments-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <div className="moments-title">
          <span className="moments-icon">✨</span>

          <div>
            <p className="moments-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>Moments</h1>

            <p className="moments-subtitle">
              The little things that became special.
            </p>
          </div>
        </div>

        <div className="moments-counter">
          <span>{moments.length}</span>
          <small>moments</small>
        </div>
      </header>

      {/* Content */}
      <section className="moments-content">
        <div className="moments-intro">
          <span className="moments-line" />

          <p>
            Not every special moment is a big one.
            <br />
            Sometimes, it's just a feeling.
          </p>

          <span className="moments-line" />
        </div>

        {/* Constellation */}
        <div className="moments-constellation">
          <div className="moments-orbit moments-orbit-one" />
          <div className="moments-orbit moments-orbit-two" />

          <div className="moments-center">
            <span>💫</span>
            <small>US</small>
          </div>

          {moments.map((moment, index) => (
            <button
              key={moment.id}
              className={`moment-card moment-card-${index + 1}`}
              onClick={() => openMoment(moment)}
            >
              <span className="moment-star">
                {moment.icon}
              </span>

              <span className="moment-card-info">
                <strong>{moment.title}</strong>

                <small>{moment.date}</small>
              </span>

              {moment.favorite && (
                <span className="moment-favorite">
                  ♥
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Hint */}
        <div className="moments-hint">
          <span>✦</span>
          <span>Click a moment to discover its story</span>
          <span>✦</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="moments-footer">
        <span>✦</span>

        <span>
          The smallest moments often mean the most.
        </span>

        <span>✦</span>
      </footer>

      {/* Viewer */}
      {selectedMoment && (
        <div
          className="moments-viewer"
          role="dialog"
          aria-modal="true"
          onClick={closeMoment}
        >
          <button
            className="moments-viewer-close"
            onClick={closeMoment}
            aria-label="Close moment"
          >
            ×
          </button>

          <article
            className="moments-viewer-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="moments-viewer-icon">
              {selectedMoment.icon}
            </div>

            <span className="moments-viewer-date">
              {selectedMoment.date}
            </span>

            <h2>{selectedMoment.title}</h2>

            <div className="moments-viewer-divider">
              <span>✦</span>
            </div>

            <p>{selectedMoment.text}</p>

            {selectedMoment.favorite && (
              <div className="moments-viewer-favorite">
                ♥ One of our little treasures
              </div>
            )}

            <div className="moments-viewer-number">
              Moment{" "}
              {moments.findIndex(
                (moment) =>
                  moment.id === selectedMoment.id
              ) + 1}
              {" / "}
              {moments.length}
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

export default MomentsWorld;