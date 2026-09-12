import { useState } from "react";
import {
  getMyUniverse,
} from "../../../services/universeService";
import {
  updateMemory,
  uploadMemoryPhoto,
} from "../../../services/memoriesService";

function EditMemory({
  memory,
  onClose,
  onMemoryUpdated,
}) {
  const [title, setTitle] = useState(memory.title || "");
  const [description, setDescription] = useState(
    memory.description || ""
  );

  const [memoryDate, setMemoryDate] = useState(
    memory.memory_date || ""
  );

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please give this memory a title.");
      return;
    }

    try {
      setLoading(true);

      const updates = {
        title: title.trim(),
        description: description.trim(),
        memory_date: memoryDate || null,
      };

      // If the user selected a new image,
      // upload it first.
      if (image) {
        const universeMembership =
          await getMyUniverse();

        const universeId =
          universeMembership?.universes?.id;

        if (!universeId) {
          throw new Error(
            "No universe found for this account."
          );
        }

        const imagePath =
          await uploadMemoryPhoto(
            universeId,
            image
          );

        updates.image_path = imagePath;
      }

      const updatedMemory =
        await updateMemory(
          memory.id,
          updates
        );

      onMemoryUpdated?.({
        ...updatedMemory,
        image_url: image
          ? null
          : memory.image,
      });

      onClose?.();
    } catch (err) {
      console.error(
        "Failed to update memory:",
        err
      );

      setError(
        err.message ||
          "Unable to update this memory."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="add-memory-overlay"
      role="dialog"
      aria-modal="true"
    >
      <div className="add-memory-card">
        <button
          className="add-memory-close"
          onClick={onClose}
          type="button"
          aria-label="Close"
        >
          ×
        </button>

        <div className="add-memory-header">
          <span>✏️</span>

          <div>
            <p>OUR UNIVERSE</p>

            <h2>Edit Memory</h2>

            <span>
              Update this little piece of
              our story.
            </span>
          </div>
        </div>

        <form
          className="add-memory-form"
          onSubmit={handleSubmit}
        >
          <label>
            Title

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />
          </label>

          <label>
            Date

            <input
              type="date"
              value={memoryDate}
              onChange={(event) =>
                setMemoryDate(
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Description

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
            />
          </label>

          <label className="add-memory-file">
            <span>
              {image
                ? image.name
                : "Choose a new photo (optional)"}
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setImage(
                  event.target.files?.[0] ||
                    null
                )
              }
            />
          </label>

          {error && (
            <p className="add-memory-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="add-memory-submit"
          >
            {loading
              ? "Saving changes..."
              : "Save Changes 💗"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditMemory;