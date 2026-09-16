import { useEffect, useState } from "react";

const DREAM_TYPES = [
  { value: "travel", label: "Travel" },
  { value: "dream", label: "Dream" },
  { value: "experience", label: "Experience" },
  { value: "adventure", label: "Adventure" },
  { value: "promise", label: "Promise" },
  { value: "someday", label: "Someday" },
];

const DEFAULT_FORM = {
  title: "",
  text: "",
  icon: "✨",
  type: "dream",
  items: ["", "", ""],
  favorite: false,
};

function OurSpaceForm({
  dream = null,
  onSubmit,
  onClose,
  saving = false,
}) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (dream) {
      setForm({
        title: dream.title || "",
        text: dream.text || "",
        icon: dream.icon || "✨",
        type: dream.type || "dream",
        items:
          Array.isArray(dream.items) && dream.items.length
            ? dream.items
            : ["", "", ""],
        favorite: dream.favorite ?? false,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [dream]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleItemChange = (index, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      items: [...current.items, ""],
    }));
  };

  const removeItem = (index) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedItems = form.items
      .map((item) => item.trim())
      .filter(Boolean);

    if (
      !form.title.trim() ||
      !form.text.trim()
    ) {
      return;
    }

    onSubmit({
      title: form.title.trim(),
      text: form.text.trim(),
      icon: form.icon.trim() || "✨",
      type: form.type,
      items: cleanedItems,
      favorite: form.favorite,
    });
  };

  const isEditing = Boolean(dream);

  return (
    <div
      className="our-space-form-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        className="our-space-form"
        onSubmit={handleSubmit}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="our-space-form-close"
          onClick={onClose}
          aria-label="Close form"
        >
          ×
        </button>

        <div className="our-space-form-header">
          <span className="our-space-form-icon">
            {isEditing ? "✏️" : "🌙"}
          </span>

          <div>
            <span className="our-space-form-eyebrow">
              OUR UNIVERSE
            </span>

            <h2>
              {isEditing
                ? "Edit Dream"
                : "Add a Dream"}
            </h2>

            <p>
              {isEditing
                ? "Update this part of our future."
                : "Add another dream to our future."}
            </p>
          </div>
        </div>

        <div className="our-space-form-fields">

          <div className="our-space-form-group">
            <label htmlFor="our-space-title">
              Title
            </label>

            <input
              id="our-space-title"
              name="title"
              type="text"
              placeholder="A dream we want to live"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="our-space-form-row">

            <div className="our-space-form-group">
              <label htmlFor="our-space-icon">
                Icon
              </label>

              <input
                id="our-space-icon"
                name="icon"
                type="text"
                placeholder="🌙"
                value={form.icon}
                onChange={handleChange}
                maxLength={8}
              />
            </div>

            <div className="our-space-form-group">
              <label htmlFor="our-space-type">
                Type
              </label>

              <select
                id="our-space-type"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                {DREAM_TYPES.map((type) => (
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

          <div className="our-space-form-group">
            <label htmlFor="our-space-text">
              Description
            </label>

            <textarea
              id="our-space-text"
              name="text"
              placeholder="Tell the story behind this dream..."
              value={form.text}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="our-space-form-group">

            <div className="our-space-items-header">
              <label>
                Little things
              </label>

              <button
                type="button"
                onClick={addItem}
              >
                + Add
              </button>
            </div>

            <div className="our-space-form-items">

              {form.items.map(
                (item, index) => (
                  <div
                    className="our-space-form-item"
                    key={index}
                  >
                    <span>✦</span>

                    <input
                      type="text"
                      value={item}
                      placeholder={`Something we want to do...`}
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          event.target.value
                        )
                      }
                    />

                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(index)
                        }
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )
              )}

            </div>
          </div>

          <label className="our-space-form-favorite">
            <input
              type="checkbox"
              name="favorite"
              checked={form.favorite}
              onChange={handleChange}
            />

            <span>♥</span>

            <div>
              <strong>
                Favorite dream
              </strong>

              <small>
                Keep this one close to our hearts.
              </small>
            </div>
          </label>

        </div>

        <div className="our-space-form-actions">

          <button
            type="button"
            className="our-space-form-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="our-space-form-submit"
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
                : "Add Dream"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default OurSpaceForm;