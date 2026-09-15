function ConfirmMomentDelete({
  moment,
  onConfirm,
  onClose,
  deleting = false,
}) {
  if (!moment) return null;

  return (
    <div
      className="moment-delete-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="moment-delete-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="moment-delete-icon">
          🥀
        </div>

        <span className="moment-delete-eyebrow">
          OUR UNIVERSE
        </span>

        <h2>
          Forget this moment?
        </h2>

        <p>
          You're about to remove
          <strong> "{moment.title}" </strong>
          from our story.
        </p>

        <small>
          This moment will be permanently deleted.
        </small>

        <div className="moment-delete-actions">
          <button
            type="button"
            className="moment-delete-cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Keep Moment
          </button>

          <button
            type="button"
            className="moment-delete-confirm"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete Moment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmMomentDelete;
