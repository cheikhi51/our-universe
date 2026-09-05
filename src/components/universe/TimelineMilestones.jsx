import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const DEFAULT_MILESTONES = [
  {
    id: "m1",
    date: "2024-02-14",
    title: "First date",
    note: "Coffee that turned into four hours of talking.",
  },
  {
    id: "m2",
    date: "2024-06-20",
    title: "First trip together",
    note: "Weekend by the coast.",
  },
  {
    id: "m3",
    date: "2025-01-01",
    title: "One year",
    note: "Still going strong.",
  },
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TimelineMilestones() {
  const [milestones, setMilestones] = useLocalStorage(
    "our-universe-timeline",
    DEFAULT_MILESTONES
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", title: "", note: "" });

  const sorted = [...milestones].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.date || !form.title) return;

    const newMilestone = {
      id: `m-${Date.now()}`,
      date: form.date,
      title: form.title,
      note: form.note,
    };

    setMilestones((prev) => [...prev, newMilestone]);
    setForm({ date: "", title: "", note: "" });
    setShowForm(false);
  };

  const handleRemove = (id) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="timeline-panel">
      <ul className="timeline-list">
        {sorted.map((milestone) => (
          <li key={milestone.id} className="timeline-item">
            <span className="timeline-date">{formatDate(milestone.date)}</span>
            <span className="timeline-title">{milestone.title}</span>
            {milestone.note && (
              <span className="timeline-note">{milestone.note}</span>
            )}
            <button
              className="timeline-remove"
              onClick={() => handleRemove(milestone.id)}
              aria-label={`Remove ${milestone.title}`}
            >
              ×
            </button>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="timeline-empty">No milestones yet.</li>
        )}
      </ul>

      {showForm ? (
        <form className="timeline-form" onSubmit={handleAdd}>
          <input
            type="date"
            value={form.date}
            onChange={handleChange("date")}
            required
          />
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={handleChange("title")}
            required
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note}
            onChange={handleChange("note")}
          />
          <div className="timeline-form-actions">
            <button type="submit" className="explore-button">
              Save
            </button>
            <button
              type="button"
              className="close-button-inline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="explore-button" onClick={() => setShowForm(true)}>
          + Add milestone
        </button>
      )}
    </div>
  );
}

export default TimelineMilestones;