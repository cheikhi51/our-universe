import { useState } from "react";
import { signOut } from "../../services/authService";

export default function Logout({ onLoggedOut, className = "" }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function openConfirm() {
    setError(null);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    if (loading) return;
    setConfirmOpen(false);
  }

  async function handleConfirmLogout() {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await signOut();
      onLoggedOut?.();
      setConfirmOpen(false);
    } catch (err) {
      console.error("Failed to log out:", err);
      setError("Couldn't log out. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`universe-logout-button ${className}`.trim()}
        onClick={openConfirm}
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>

      {confirmOpen && (
        <div
          className="logout-confirm-overlay"
          onClick={closeConfirm}
        >
          <div
            className="logout-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="logout-confirm-close"
              onClick={closeConfirm}
              disabled={loading}
              aria-label="Cancel logout"
            >
              ×
            </button>

            <div className="logout-confirm-icon">
              <span>🚪</span>
            </div>

            <span className="logout-confirm-eyebrow">
              Leaving the universe
            </span>

            <h2>Log out?</h2>

            <p>
              You'll need to sign back in to see your memories,
              messages and everything else here.
            </p>

            {error && (
              <p className="logout-confirm-error">{error}</p>
            )}

            <div className="logout-confirm-actions">
              <button
                type="button"
                className="logout-confirm-cancel"
                onClick={closeConfirm}
                disabled={loading}
              >
                Stay
              </button>

              <button
                type="button"
                className="logout-confirm-confirm"
                onClick={handleConfirmLogout}
                disabled={loading}
              >
                {loading ? "Logging out…" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}