function ConfirmMusicDelete({
  track,
  onConfirm,
  onCancel,
  deleting = false,
}) {
  if (!track) return null;

  return (
    <div
      className="music-delete-overlay"
      onClick={onCancel}
    >
      <div
        className="music-delete-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="music-delete-icon">
          🗑️
        </div>

        <span className="music-delete-eyebrow">
          REMOVE SONG
        </span>

        <h2>Delete this song?</h2>

        <p>
          Are you sure you want to remove{" "}
          <strong>{track.title}</strong> from
          our soundtrack?
        </p>

        <div className="music-delete-actions">
          <button
            type="button"
            className="music-delete-cancel"
            onClick={onCancel}
            disabled={deleting}
          >
            Keep it
          </button>

          <button
            type="button"
            className="music-delete-confirm"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete song"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmMusicDelete;