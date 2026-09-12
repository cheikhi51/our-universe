import { useEffect } from "react";
function ConfirmMemoryDelete({
  memory,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!memory) return null;

  useEffect(() => {
  function handleEscape(event) {
    if (event.key === "Escape" && !loading) {
      onCancel();
    }
  }

  window.addEventListener("keydown", handleEscape);

  return () => {
    window.removeEventListener(
      "keydown",
      handleEscape
    );
  };
}, [loading, onCancel]);

  return (
    <div
      className="memory-confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-confirm-title"
    >
      <div className="memory-confirm-card">
        <button
          type="button"
          className="memory-confirm-close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close"
        >
          ×
        </button>

        <div className="memory-confirm-icon">
          🗑️
        </div>

        <p className="memory-confirm-eyebrow">
          ONE LAST QUESTION
        </p>

        <h2 id="memory-confirm-title">
          Forget this memory?
        </h2>

        <p className="memory-confirm-memory-title">
          “{memory.title}”
        </p>

        <p className="memory-confirm-description">
          This memory and its photo will be
          permanently removed from our universe.
        </p>

        <div className="memory-confirm-actions">
          <button
            type="button"
            className="memory-confirm-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Keep Memory
          </button>

          <button
            type="button"
            className="memory-confirm-delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete Memory"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmMemoryDelete;