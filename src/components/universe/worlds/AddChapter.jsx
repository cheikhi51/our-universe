import { useState } from "react";
import { getMyUniverse } from "../../../services/universeService";
import { createTimelineEvent } from "../../../services/timelineService";

function AddChapter({ onClose, onChapterCreated }) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("✨");
  const [location, setLocation] = useState("");
  const [favorite, setFavorite] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

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

      const membership = await getMyUniverse();

      const universeId =
        membership?.universes?.id;

      if (!universeId) {
        throw new Error(
          "No universe found for this account."
        );
      }

      const createdEvent =
        await createTimelineEvent({
          universe_id: universeId,
          event_date: eventDate,
          title: title.trim(),
          description: description.trim(),
          icon: icon.trim() || "✨",
          location: location.trim(),
          favorite,
        });

      onChapterCreated(createdEvent);
    } catch (err) {
      console.error(
        "Failed to create chapter:",
        err
      );

      setError(
        err.message ||
          "Unable to create this chapter."
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
        className="timeline-form-modal chapter-form"
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
          ✨
        </div>

        <p className="timeline-form-eyebrow">
          OUR STORY
        </p>

        <h2>Add a New Chapter</h2>

        <p className="timeline-form-subtitle">
          Every beautiful story deserves another
          chapter.
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
            placeholder="The day we..."
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
            placeholder="✨"
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
            placeholder="Somewhere special"
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
            placeholder="Tell the story of this moment..."
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
              : "Create Chapter"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddChapter;