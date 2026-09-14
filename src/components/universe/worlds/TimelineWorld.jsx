import { useEffect, useState } from "react";
import { getMyUniverse } from "../../../services/universeService";
import { getMyTimeline,deleteTimelineEvent } from "../../../services/timelineService";

import AddChapter from "./AddChapter";
import EditChapter from "./EditChapter";
import ConfirmChapterDelete from "./ConfirmChapterDelete";

function TimelineWorld({ onBack }) {

  const [timelineEvents, setTimelineEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(false);

  {/* Loading timeline */}
  useEffect(() => {
  let mounted = true;

  async function loadTimeline() {
    try {
      setLoading(true);
      setError("");

      const universeMembership =
        await getMyUniverse();

      const universeId =
        universeMembership?.universes?.id;

      if (!universeId) {
        throw new Error(
          "No universe found for this account."
        );
      }

      console.log(
        "🌌 Current universe ID:",
        universeId
      );

      const data =
        await getMyTimeline(universeId);

      console.log(
        "🗓️ Timeline returned from Supabase:",
        data
      );

      if (!mounted) return;

      const formattedEvents = data.map(formatTimelineEvent);
      setTimelineEvents(formattedEvents);
    } catch (err) {
      console.error(
        "Failed to load timeline:",
        err
      );

      if (mounted) {
        setError(
          err.message ||
            "Unable to load our timeline."
        );
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }

  loadTimeline();

  return () => {
    mounted = false;
  };
}, []);
    {/*Delete handler*/}
    const handleDeleteChapter = async () => {
  if (!eventToDelete) {
    return;
  }

  try {
    setDeletingEvent(true);

    await deleteTimelineEvent(
      eventToDelete.id
    );

    setTimelineEvents(
      (currentEvents) =>
        currentEvents.filter(
          (event) =>
            event.id !== eventToDelete.id
        )
    );

    if (
      selectedEvent?.id ===
      eventToDelete.id
    ) {
      setSelectedEvent(null);
    }

    setEventToDelete(null);
  } catch (err) {
    console.error(
      "Failed to delete chapter:",
      err
    );

    alert(
      err.message ||
        "Unable to delete this chapter."
    );
  } finally {
    setDeletingEvent(false);
  }
};

    {/* Format timeline event */}
    const formatTimelineEvent = (event) => {
      const date = event.event_date
        ? new Date(
            `${event.event_date}T00:00:00`
          )
        : null;

      return {
        id: event.id,

        event_date: event.event_date,

        date: date
          ? date.toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )
          : "",

        year: date
          ? date.getFullYear().toString()
          : "",

        title: event.title,

        description:
          event.description || "",

        icon:
          event.icon || "✨",

        location:
          event.location || "",

        favorite:
          event.favorite ?? false,
      };
    };


  const openEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeEvent = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (eventToDelete) {
        setEventToDelete(null);
        return;
      }

      if (editingEvent) {
        setEditingEvent(null);
        return;
      }

      if (showAddChapter) {
        setShowAddChapter(false);
        return;
      }

      if (selectedEvent) {
        setSelectedEvent(null);
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
  }, [
    selectedEvent,
    editingEvent,
    eventToDelete,
    showAddChapter,
  ]);

    if (loading) {
      return (
        <main className="timeline-world">
          <div className="timeline-stars timeline-stars-one" />
          <div className="timeline-stars timeline-stars-two" />
          <div className="timeline-stars timeline-stars-three" />

          <div className="timeline-nebula timeline-nebula-one" />
          <div className="timeline-nebula timeline-nebula-two" />

          <div className="timeline-loading">
            <span>🗓️</span>
            <p>Opening our story...</p>
          </div>
        </main>
      );
    }

    if (error) {
      return (
        <main className="timeline-world">
          <div className="timeline-stars timeline-stars-one" />
          <div className="timeline-stars timeline-stars-two" />
          <div className="timeline-stars timeline-stars-three" />

          <div className="timeline-nebula timeline-nebula-one" />
          <div className="timeline-nebula timeline-nebula-two" />

          <div className="timeline-loading">
            <span>🌙</span>
            <p>{error}</p>

            <button onClick={onBack}>
              Back to Universe
            </button>
          </div>
        </main>
      );
    }

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
        <button
          className="timeline-add-button"
          onClick={() =>
            setShowAddChapter(true)
          }
        >
          <span>+</span>
          <span>Add Chapter</span>
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
              <div className="timeline-viewer-actions">

                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(selectedEvent);
                    setSelectedEvent(null);
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEventToDelete(selectedEvent);
                  }}
                >
                  🗑️ Delete
                </button>

              </div>

              {timelineEvents.length}
            </div>

          </article>

        </div>
      )}
      {showAddChapter && (
      <AddChapter
        onClose={() =>
          setShowAddChapter(false)
        }
        onChapterCreated={(createdEvent) => {
          const formattedEvent =
            formatTimelineEvent(
              createdEvent
            );

          setTimelineEvents(
            (currentEvents) =>
              [
                ...currentEvents,
                formattedEvent,
              ].sort(
                (a, b) =>
                  new Date(
                    a.event_date
                  ) -
                  new Date(
                    b.event_date
                  )
              )
          );

          setShowAddChapter(false);
        }}
      />
    )}

    {editingEvent && (
      <EditChapter
        event={editingEvent}
        onClose={() =>
          setEditingEvent(null)
        }
        onChapterUpdated={(updatedEvent) => {
          const formattedEvent =
            formatTimelineEvent(
              updatedEvent
            );

          setTimelineEvents(
            (currentEvents) =>
              currentEvents
                .map((event) =>
                  event.id ===
                  formattedEvent.id
                    ? formattedEvent
                    : event
                )
                .sort(
                  (a, b) =>
                    new Date(
                      a.event_date
                    ) -
                    new Date(
                      b.event_date
                    )
                )
          );

          setEditingEvent(null);
        }}
      />
    )}

    {eventToDelete && (
      <ConfirmChapterDelete
        event={eventToDelete}
        loading={deletingEvent}
        onCancel={() =>
          setEventToDelete(null)
        }
        onConfirm={
          handleDeleteChapter
        }
      />
    )}

    </main>
  );
}

export default TimelineWorld;