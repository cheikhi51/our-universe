import { useState } from "react";

import { getMyUniverse } from "../../../services/universeService";
import {
  createMemory,
  uploadMemoryPhoto,
} from "../../../services/memoriesService";

function AddMemory({ onClose, onMemoryCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
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

    if (!image) {
      setError("Please select a photo.");
      return;
    }

    try {
      setLoading(true);

      const universeMembership =
        await getMyUniverse();

      const universeId =
        universeMembership?.universes?.id;

      if (!universeId) {
        throw new Error(
          "No universe found for this account."
        );
      }

      /*
       * 1. Upload photo
       */

      const imagePath =
        await uploadMemoryPhoto(
          universeId,
          image
        );

      /*
       * 2. Create database record
       */

      const memory =
        await createMemory({
          universeId,
          title: title.trim(),
          description: description.trim(),
          memoryDate:
            memoryDate || null,
          imagePath,
        });

      /*
       * 3. Tell MemoriesWorld that
       *    a new memory exists.
       */

      onMemoryCreated?.(memory);

      /*
       * 4. Close form
       */

      onClose?.();

    } catch (err) {
      console.error(
        "Failed to create memory:",
        err
      );

      setError(
        err.message ||
          "Unable to create this memory."
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

          <span>
            📸
          </span>

          <div>
            <p>
              OUR UNIVERSE
            </p>

            <h2>
              Add a Memory
            </h2>

            <span>
              Keep another little piece of
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
              placeholder="A beautiful day..."
              required
            />
          </label>

          <label>
            Date

            <input
              type="date"
              value={memoryDate}
              onChange={(event) =>
                setMemoryDate(event.target.value)
              }
            />
          </label>

          <label>
            Description

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Tell the story behind this memory..."
              rows={4}
            />
          </label>

          <label className="add-memory-file">

            <span>
              {image
                ? image.name
                : "Choose a photo"}
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setImage(
                  event.target.files?.[0] || null
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
              ? "Saving memory..."
              : "Save Memory 💗"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddMemory;