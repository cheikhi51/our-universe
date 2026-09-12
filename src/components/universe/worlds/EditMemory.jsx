import { useEffect, useState } from "react";
import { getMyUniverse } from "../../../services/universeService";
import {
  updateMemory,
  uploadMemoryPhoto,
} from "../../../services/memoriesService";

function EditMemory({ memory, onClose, onMemoryUpdated }) {
  const [title, setTitle] = useState(memory.title || "");
  const [description, setDescription] = useState(
    memory.description || ""
  );
  const [memoryDate, setMemoryDate] = useState(
    memory.memory_date || ""
  );

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    memory.image || ""
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && !loading) {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [loading, onClose]);

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please choose a JPG, PNG or WebP image."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "This image is too large. Please choose an image smaller than 10 MB."
      );
      return;
    }

    setImage(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setStatus("");

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

      if (image) {
        setStatus("Uploading new photo...");

        const universeMembership =
          await getMyUniverse();

        const universeId =
          universeMembership?.universes?.id;

        if (!universeId) {
          throw new Error(
            "No universe found for this account."
          );
        }

        const imagePath = await uploadMemoryPhoto(
          universeId,
          image
        );

        updates.image_path = imagePath;
      }

      setStatus("Saving memory...");

      const updatedMemory = await updateMemory(
        memory.id,
        updates
      );

      onMemoryUpdated?.({
        ...updatedMemory,
        image_url:
          updatedMemory.image_url ||
          memory.image,
      });

      onClose?.();
    } catch (err) {
      console.error(
        "Failed to update memory:",
        err
      );

      setError(
        err.message ||
          "Unable to update this memory. Please try again."
      );
    } finally {
      setLoading(false);
      setStatus("");
    }
  }

  return (
    <div
      className="add-memory-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-memory-title"
    >
      <div className="add-memory-card">
        <button
          className="add-memory-close"
          onClick={onClose}
          type="button"
          disabled={loading}
          aria-label="Close"
        >
          ×
        </button>

        <div className="add-memory-header">
          <span>✏️</span>

          <div>
            <p>OUR UNIVERSE</p>

            <h2 id="edit-memory-title">
              Edit Memory
            </h2>

            <span>
              Update this little piece of our story.
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              onChange={handleImageChange}
              disabled={loading}
            />
          </label>

          {previewUrl && (
            <div className="add-memory-preview">
              <img
                src={previewUrl}
                alt="Memory preview"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            </div>
          )}

          {status && (
            <p className="add-memory-status">
              {status}
            </p>
          )}

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
              ? status || "Saving..."
              : "Save Changes 💗"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditMemory;