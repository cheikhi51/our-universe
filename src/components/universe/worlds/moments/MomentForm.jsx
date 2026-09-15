import { useEffect, useState } from "react";

const MOMENT_TYPES = [
  { value: "memory", label: "Memory" },
  { value: "funny", label: "Funny" },
  { value: "message", label: "Message" },
  { value: "special", label: "Special" },
  { value: "love", label: "Love" },
  { value: "moment", label: "Moment" },
];

const DEFAULT_FORM = {
  date: "",
  title: "",
  text: "",
  icon: "✨",
  type: "moment",
  favorite: false,
};

function MomentForm({
  moment = null,
  onSubmit,
  onClose,
  saving = false,
}) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (moment) {
      setForm({
        date: moment.date || "",
        title: moment.title || "",
        text: moment.text || "",
        icon: moment.icon || "✨",
        type: moment.type || "moment",
        favorite: moment.favorite ?? false,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [moment]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.text.trim()) {
      return;
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      text: form.text.trim(),
      date: form.date.trim(),
      icon: form.icon.trim() || "✨",
    });
  };

  const isEditing = Boolean(moment);

  return (
    <div
      className="moment-form-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        className="moment-form"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="moment-form-close"
          onClick={onClose}
          aria-label="Close form"
        >
          ×
        </button>

        <div className="moment-form-header">
          <span className="moment-form-icon">
            {isEditing ? "✏️" : "✨"}
          </span>

          <div>
            <span className="moment-form-eyebrow">
              OUR UNIVERSE
            </span>

            <h2>
              {isEditing ? "Edit Moment" : "Add Moment"}
            </h2>

            <p>
              {isEditing
                ? "Update this little piece of our story."
                : "Add another little moment to our universe."}
            </p>
          </div>
        </div>

        <div className="moment-form-fields">
          <div className="moment-form-group">
            <label htmlFor="moment-date">
              Date
            </label>

            <input
              id="moment-date"
              name="date"
              type="text"
              placeholder="14 September 2026"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="moment-form-group">
            <label htmlFor="moment-title">
              Title
            </label>

            <input
              id="moment-title"
              name="title"
              type="text"
              placeholder="That beautiful moment"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="moment-form-row">
            <div className="moment-form-group">
              <label htmlFor="moment-icon">
                Icon
              </label>

              <input
                id="moment-icon"
                name="icon"
                type="text"
                placeholder="✨"
                value={form.icon}
                onChange={handleChange}
                maxLength={8}
              />
            </div>

            <div className="moment-form-group">
              <label htmlFor="moment-type">
                Type
              </label>

              <select
                id="moment-type"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                {MOMENT_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="moment-form-group">
            <label htmlFor="moment-text">
              Story
            </label>

            <textarea
              id="moment-text"
              name="text"
              placeholder="Tell the story behind this moment..."
              value={form.text}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <label className="moment-form-favorite">
            <input
              type="checkbox"
              name="favorite"
              checked={form.favorite}
              onChange={handleChange}
            />

            <span>
              ♥
            </span>

            <div>
              <strong>
                Favorite moment
              </strong>

              <small>
                Keep this one close to our hearts.
              </small>
            </div>
          </label>
        </div>

        <div className="moment-form-actions">
          <button
            type="button"
            className="moment-form-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="moment-form-submit"
            disabled={
              saving ||
              !form.title.trim() ||
              !form.text.trim()
            }
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Moment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MomentForm;