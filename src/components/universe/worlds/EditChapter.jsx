import { useState } from "react";
import { updateTimelineEvent } from "../../../services/timelineService";

function EditChapter({
  event,
  onClose,
  onChapterUpdated,
}) {
  const [title, setTitle] = useState(
    event.title || ""
  );

  const [eventDate, setEventDate] = useState(
    event.event_date || ""
  );

  const [description, setDescription] =
    useState(event.description || "");

  const [icon, setIcon] = useState(
    event.icon || "✨"
  );

  const [location, setLocation] =
    useState(event.location || "");

  const [favorite, setFavorite] = useState(
    event.favorite ?? false
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    if (!title.trim()) {
      setError("Please give this chapter a title.");
      return;
    }

    if (!eventDate) {
      setError("Please choose a date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedEvent =
        await updateTimelineEvent(
          event.id,
          {
            event_date: eventDate,
            title: title.trim(),
            description: description.trim(),
            icon: icon.trim() || "✨",
            location: location.trim(),
            favorite,
          }
        );

      onChapterUpdated(updatedEvent);
    } catch (err) {
      console.error(
        "Failed to update chapter:",
        err
      );

      setError(
        err.message ||
          "Unable to update this chapter."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="timeline-form-overlay"
      onClick={onClose}
    >
      <form
        className="timeline-form-modal"
        onSubmit={handleSubmit}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="timeline-form-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="timeline-form-icon">
          {icon}
        </div>

        <p className="timeline-form-eyebrow">
          OUR STORY
        </p>

        <h2>Edit Chapter</h2>

        <p className="timeline-form-subtitle">
          Some chapters deserve a little rewriting.
        </p>

        {error && (
          <div className="timeline-form-error">
            {error}
          </div>
        )}

        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            disabled={saving}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={eventDate}
            onChange={(event) =>
              setEventDate(event.target.value)
            }
            disabled={saving}
          />
        </label>

        <label>
          Icon
          <input
            type="text"
            value={icon}
            onChange={(event) =>
              setIcon(event.target.value)
            }
            maxLength={4}
            disabled={saving}
          />
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            disabled={saving}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={4}
            disabled={saving}
          />
        </label>

        <label className="timeline-form-checkbox">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(event) =>
              setFavorite(event.target.checked)
            }
            disabled={saving}
          />

          <span>
            ♥ Mark as a favorite chapter
          </span>
        </label>

        <div className="timeline-form-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditChapter;