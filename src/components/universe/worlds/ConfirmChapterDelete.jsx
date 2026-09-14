function ConfirmChapterDelete({
  event,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      className="timeline-delete-overlay"
      onClick={onCancel}
    >
      <div
        className="timeline-delete-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="timeline-delete-icon">
          🗑️
        </div>

        <p className="timeline-delete-eyebrow">
          A little goodbye
        </p>

        <h3>
          Delete this chapter?
        </h3>

        <p className="timeline-delete-title">
          “{event.title}”
        </p>

        <p className="timeline-delete-warning">
          This chapter will be removed from our
          story forever.
        </p>

        <div className="timeline-delete-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Keep it
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete chapter"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmChapterDelete;