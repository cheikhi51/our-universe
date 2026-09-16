import { useState } from "react";

import { signUp } from "../../services/authService";

function Signup({
  onSignup,
  onGoToLogin,
}) {
  const [displayName, setDisplayName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await signUp(
        email.trim(),
        password,
        displayName.trim()
      );

      /*
       * If email confirmation is enabled,
       * Supabase won't give us a session yet.
       */
      if (!data.session) {
        setSuccess(
          "Account created! Please check your email to confirm your account."
        );

        return;
      }

      /*
       * Account is authenticated.
       * Move to universe setup.
       */
      onSignup?.();

    } catch (err) {
      console.error(
        "Signup failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          💗
        </div>

        <p className="auth-eyebrow">
          OUR UNIVERSE
        </p>

        <h1>
          Create your account
        </h1>

        <p className="auth-subtitle">
          Your little universe starts here.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Your name

            <input
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          <label>
            Confirm password

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <div
            type="button"
            className="auth-switch-button"
            onClick={onGoToLogin}
          >
            Enter your universe
          </div>

        </div>

      </div>

    </main>
  );
}

export default Signup;