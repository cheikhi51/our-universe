import { useState } from "react";

import {
  createUniverse,
  createUniverseInvite,
  joinUniverseWithCode,
} from "../../services/universeService";

function UniverseSetup({ onComplete }) {
  const [mode, setMode] = useState(null);

  const [universeName, setUniverseName] = useState("Our Universe");
  const [inviteCode, setInviteCode] = useState("");

  const [generatedCode, setGeneratedCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * CREATE UNIVERSE
   */
  async function handleCreateUniverse(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createUniverse(
        universeName.trim() || "Our Universe"
      );

      const code = await createUniverseInvite();

      setGeneratedCode(code);
      setSuccess("Your universe is ready ❤️");
    } catch (err) {
      console.error("Universe creation failed:", err);

      setError(
        err?.message ||
          "Unable to create your universe."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * JOIN UNIVERSE
   */
  async function handleJoinUniverse(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const universeId =
        await joinUniverseWithCode(inviteCode);

      console.log("Joined universe:", universeId);

      setSuccess("You joined your universe ❤️");

      onComplete?.({
        universeId,
      });
    } catch (err) {
      console.error("Join universe failed:", err);

      setError(
        err?.message ||
          "Unable to join this universe."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * INVITE GENERATED
   */
  if (generatedCode) {
    return (
      <main className="auth-page">
        <div className="auth-card universe-setup-card">

          <div className="auth-icon">
            💗
          </div>

          <p className="auth-eyebrow">
            OUR UNIVERSE
          </p>

          <h1>
            Your universe is ready
          </h1>

          <p className="auth-subtitle">
            Now invite the person who makes
            this universe special.
          </p>

          <div className="invite-code-container">

            <span className="invite-code-label">
              YOUR SECRET CODE
            </span>

            <strong className="invite-code">
              {generatedCode}
            </strong>

            <span className="invite-code-hint">
              This code expires in 24 hours.
            </span>

          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  generatedCode
                );

                setSuccess(
                  "Invitation code copied 💌"
                );
              } catch {
                setSuccess(
                  "Copy the code above and send it to your partner."
                );
              }
            }}
          >
            Copy secret code
          </button>

          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}

          <button
            type="button"
            className="secondary-auth-button"
            onClick={() => onComplete?.()}
          >
            Enter Our Universe ❤️
          </button>

        </div>
      </main>
    );
  }

  /*
   * CREATE / JOIN CHOICE
   */
  if (!mode) {
    return (
      <main className="auth-page">
        <div className="auth-card universe-setup-card">

          <div className="auth-icon">
            🌌
          </div>

          <p className="auth-eyebrow">
            ONE LITTLE WORLD
          </p>

          <h1>
            Welcome to Our Universe
          </h1>

          <p className="auth-subtitle">
            How would you like to begin?
          </p>

          <div className="universe-choice-list">

            <button
              type="button"
              className="universe-choice"
              onClick={() => {
                setMode("create");
                setError("");
              }}
            >
              <span className="universe-choice-icon">
                🌌
              </span>

              <span className="universe-choice-content">
                <strong>
                  Create our universe
                </strong>

                <small>
                  Start a private world for you
                  and your partner.
                </small>
              </span>

              <span>→</span>
            </button>

            <button
              type="button"
              className="universe-choice"
              onClick={() => {
                setMode("join");
                setError("");
              }}
            >
              <span className="universe-choice-icon">
                💌
              </span>

              <span className="universe-choice-content">
                <strong>
                  Join our universe
                </strong>

                <small>
                  Enter the secret code from
                  your partner.
                </small>
              </span>

              <span>→</span>
            </button>

          </div>
        </div>
      </main>
    );
  }

  /*
   * CREATE
   */
  if (mode === "create") {
    return (
      <main className="auth-page">
        <div className="auth-card universe-setup-card">

          <button
            type="button"
            className="auth-back-button"
            onClick={() => {
              setMode(null);
              setError("");
            }}
          >
            ← Back
          </button>

          <div className="auth-icon">
            🌌
          </div>

          <p className="auth-eyebrow">
            CREATE YOUR WORLD
          </p>

          <h1>
            Give your universe a name
          </h1>

          <p className="auth-subtitle">
            You can always change it later.
          </p>

          <form onSubmit={handleCreateUniverse}>

            <label>
              Universe name

              <input
                type="text"
                value={universeName}
                onChange={(event) =>
                  setUniverseName(event.target.value)
                }
                placeholder="Our Universe"
                required
              />
            </label>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Our Universe ❤️"}
            </button>

          </form>
        </div>
      </main>
    );
  }

  /*
   * JOIN
   */
  return (
    <main className="auth-page">
      <div className="auth-card universe-setup-card">

        <button
          type="button"
          className="auth-back-button"
          onClick={() => {
            setMode(null);
            setError("");
          }}
        >
          ← Back
        </button>

        <div className="auth-icon">
          💌
        </div>

        <p className="auth-eyebrow">
          JOIN YOUR PERSON
        </p>

        <h1>
          Enter the secret code
        </h1>

        <p className="auth-subtitle">
          Your partner should have the
          invitation code.
        </p>

        <form onSubmit={handleJoinUniverse}>

          <label>
            Secret invitation code

            <input
              type="text"
              value={inviteCode}
              onChange={(event) =>
                setInviteCode(
                  event.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="A7F92C"
              maxLength={6}
              required
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              inviteCode.length !== 6
            }
          >
            {loading
              ? "Joining..."
              : "Join Our Universe 💗"}
          </button>

        </form>
      </div>
    </main>
  );
}

export default UniverseSetup;