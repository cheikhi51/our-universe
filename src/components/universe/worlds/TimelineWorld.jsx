import { useEffect, useState } from "react";
import { timelineEvents } from "../../../data/timeline";

function TimelineWorld({ onBack }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeEvent = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeEvent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="timeline-world">

      {/* Atmosphere */}
      <div className="timeline-stars timeline-stars-one" />
      <div className="timeline-stars timeline-stars-two" />
      <div className="timeline-stars timeline-stars-three" />

      <div className="timeline-nebula timeline-nebula-one" />
      <div className="timeline-nebula timeline-nebula-two" />

      {/* Header */}
      <header className="timeline-header">

        <button
          className="timeline-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <div className="timeline-title">

          <span className="timeline-icon">
            🗓️
          </span>

          <div>
            <p className="timeline-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>Timeline</h1>

            <p className="timeline-subtitle">
              Every chapter of our story.
            </p>
          </div>

        </div>

        <div className="timeline-counter">
          <span>{timelineEvents.length}</span>
          <small>chapters</small>
        </div>

      </header>

      {/* Main content */}
      <section className="timeline-content">

        <div className="timeline-intro">

          <span className="timeline-line" />

          <p>
            Some moments become memories.
            <br />
            Some memories become our story.
          </p>

          <span className="timeline-line" />

        </div>

        {/* Timeline */}
        <div className="timeline-track">

          <div className="timeline-spine" />

          {timelineEvents.map((event, index) => (
            <button
              key={event.id}
              className={`timeline-event ${
                index % 2 === 0
                  ? "timeline-event-left"
                  : "timeline-event-right"
              }`}
              onClick={() => openEvent(event)}
            >

              <div className="timeline-event-content">

                <div className="timeline-event-date">
                  {event.date}
                </div>

                <div className="timeline-event-card">

                  <div className="timeline-event-icon">
                    {event.icon}
                  </div>

                  <div className="timeline-event-text">

                    <div className="timeline-event-year">
                      {event.year}
                    </div>

                    <h2>
                      {event.title}
                    </h2>

                    <p>
                      {event.description}
                    </p>

                    <span className="timeline-event-more">
                      Discover chapter →
                    </span>

                  </div>

                  {event.favorite && (
                    <span className="timeline-event-favorite">
                      ♥
                    </span>
                  )}

                </div>

              </div>

              <span className="timeline-node">
                <span />
              </span>

            </button>
          ))}

          {/* Future */}
          <div className="timeline-future">

            <div className="timeline-future-node">
              ✦
            </div>

            <span>
              More chapters are waiting to be written...
            </span>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="timeline-footer">

        <span>✦</span>

        <span>
          The best part of our story is still ahead.
        </span>

        <span>✦</span>

      </footer>

      {/* Event viewer */}
      {selectedEvent && (
        <div
          className="timeline-viewer"
          role="dialog"
          aria-modal="true"
          onClick={closeEvent}
        >

          <button
            className="timeline-viewer-close"
            onClick={closeEvent}
            aria-label="Close chapter"
          >
            ×
          </button>

          <article
            className="timeline-viewer-content"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="timeline-viewer-icon">
              {selectedEvent.icon}
            </div>

            <span className="timeline-viewer-date">
              {selectedEvent.date}
            </span>

            <h2>
              {selectedEvent.title}
            </h2>

            <div className="timeline-viewer-divider">
              <span>✦</span>
            </div>

            <p>
              {selectedEvent.description}
            </p>

            <div className="timeline-viewer-location">
              <span>⌖</span>
              <span>{selectedEvent.location}</span>
            </div>

            {selectedEvent.favorite && (
              <div className="timeline-viewer-favorite">
                ♥ A chapter worth keeping forever
              </div>
            )}

            <div className="timeline-viewer-number">
              Chapter{" "}
              {timelineEvents.findIndex(
                (event) => event.id === selectedEvent.id
              ) + 1}
              {" / "}
              {timelineEvents.length}
            </div>

          </article>

        </div>
      )}

    </main>
  );
}

export default TimelineWorld;