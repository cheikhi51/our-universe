import { useEffect, useState } from "react";

const EMPTY_FORM = {
  title: "",
  artist: "",
  album: "",
  year: "",
  duration: "",
  icon: "🎵",
  spotifyId: "",
  description: "",
  favorite: false,
};

function MusicTrackForm({
  track = null,
  onSave,
  onClose,
  saving = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const isEditing = Boolean(track);

  useEffect(() => {
    if (track) {
      setForm({
        title: track.title || "",
        artist: track.artist || "",
        album: track.album || "",
        year: track.year || "",
        duration: track.duration || "",
        icon: track.icon || "🎵",
        spotifyId: track.spotifyId || "",
        description: track.description || "",
        favorite: track.favorite ?? false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [track]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.artist.trim()) {
      return;
    }

    await onSave({
      ...form,
      title: form.title.trim(),
      artist: form.artist.trim(),
      album: form.album.trim(),
      year: form.year.trim(),
      duration: form.duration.trim(),
      spotifyId: form.spotifyId.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <div
      className="music-form-overlay"
      onClick={onClose}
    >
      <form
        className="music-form"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="music-form-header">
          <div>
            <span className="music-form-eyebrow">
              {isEditing ? "EDIT TRACK" : "NEW TRACK"}
            </span>

            <h2>
              {isEditing
                ? "Edit our song"
                : "Add a song"}
            </h2>
          </div>

          <button
            type="button"
            className="music-form-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="music-form-grid">
          <label>
            <span>Title *</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Our Song"
              required
            />
          </label>

          <label>
            <span>Artist *</span>
            <input
              name="artist"
              value={form.artist}
              onChange={handleChange}
              placeholder="Us"
              required
            />
          </label>

          <label>
            <span>Album</span>
            <input
              name="album"
              value={form.album}
              onChange={handleChange}
              placeholder="Our Universe"
            />
          </label>

          <label>
            <span>Year</span>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="2026"
            />
          </label>

          <label>
            <span>Duration</span>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="3:42"
            />
          </label>

          <label>
            <span>Icon</span>
            <input
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="🎵"
              maxLength={4}
            />
          </label>
        </div>

        <label>
          <span>Spotify Track ID</span>
          <input
            name="spotifyId"
            value={form.spotifyId}
            onChange={handleChange}
            placeholder="10jGnQTGHpGWhJkFfwVfBH"
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Why this song is special..."
            rows={4}
          />
        </label>

        <label className="music-form-favorite">
          <input
            type="checkbox"
            name="favorite"
            checked={form.favorite}
            onChange={handleChange}
          />

          <span>❤️ Add to favorites</span>
        </label>

        <div className="music-form-actions">
          <button
            type="button"
            className="music-form-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="music-form-submit"
            disabled={
              saving ||
              !form.title.trim() ||
              !form.artist.trim()
            }
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Add song"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MusicTrackForm;