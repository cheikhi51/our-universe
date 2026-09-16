function ConfirmOurSpaceDelete({
  dream,
  onConfirm,
  onClose,
  deleting = false,
}) {
  if (!dream) return null;

  return (
    <div
      className="our-space-delete-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="our-space-delete-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="our-space-delete-icon">
          🥀
        </div>

        <span className="our-space-delete-eyebrow">
          OUR UNIVERSE
        </span>

        <h2>
          Let this dream go?
        </h2>

        <p>
          You're about to remove
          <strong>
            {" "}
            "{dream.title}"
          </strong>
          {" "}from our future.
        </p>

        <small>
          This dream will be permanently deleted.
        </small>

        <div className="our-space-delete-actions">

          <button
            type="button"
            className="our-space-delete-cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Keep Dream
          </button>

          <button
            type="button"
            className="our-space-delete-confirm"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete Dream"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ConfirmOurSpaceDelete;