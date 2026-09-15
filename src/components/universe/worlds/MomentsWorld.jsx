import { useEffect, useState } from "react";

import {
  getMyMoments,
  createMoment,
  updateMoment,
  deleteMoment,
} from "../../../services/momentsService";

import { getMyUniverse } from "../../../services/universeService";

import MomentForm from "./moments/MomentForm";
import ConfirmMomentDelete from "./moments/ConfirmMomentDelete";

/* =================================
   FORMAT SUPABASE MOMENT
================================= */

const formatMoment = (moment) => ({
  id: moment.id,
  date: moment.date || "",
  title: moment.title || "",
  text: moment.text || "",
  icon: moment.icon || "✨",
  type: moment.type || "moment",
  favorite: moment.favorite ?? false,
});

/* =================================
   MOMENTS WORLD
================================= */

function MomentsWorld({ onBack }) {
  const [moments, setMoments] = useState([]);

  const [selectedMoment, setSelectedMoment] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddMoment, setShowAddMoment] =
    useState(false);

  const [editingMoment, setEditingMoment] =
    useState(null);

  const [momentToDelete, setMomentToDelete] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =================================
     LOAD MOMENTS
  ================================= */

  useEffect(() => {
    let mounted = true;

    const loadMoments = async () => {
      try {
        setLoading(true);
        setError("");

        const universeMembership =
          await getMyUniverse();

        const universeId =
          universeMembership?.universes?.id;

        if (!universeId) {
          throw new Error(
            "No universe found for the current user."
          );
        }

        const data =
          await getMyMoments(universeId);

        if (!mounted) return;

        setMoments(
          data.map(formatMoment)
        );
      } catch (err) {
        console.error(
          "❌ Failed to load moments:",
          err
        );

        if (!mounted) return;

        setError(
          "We couldn't load our moments right now."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMoments();

    return () => {
      mounted = false;
    };
  }, []);

  /* =================================
     OPEN / CLOSE VIEWER
  ================================= */

  const openMoment = (moment) => {
    setSelectedMoment(moment);
  };

  const closeMoment = () => {
    setSelectedMoment(null);
  };

  /* =================================
     ADD MOMENT
  ================================= */

  const handleAddMoment = async (form) => {
    try {
      setSaving(true);
      setError("");

      const universeMembership =
        await getMyUniverse();

      const universeId =
        universeMembership?.universes?.id;

      if (!universeId) {
        throw new Error(
          "No universe found for the current user."
        );
      }

      const createdMoment =
        await createMoment({
          universe_id: universeId,
          date: form.date,
          title: form.title,
          text: form.text,
          icon: form.icon,
          type: form.type,
          favorite: form.favorite,
        });

      const formattedMoment =
        formatMoment(createdMoment);

      setMoments((current) => [
        ...current,
        formattedMoment,
      ]);

      setShowAddMoment(false);
    } catch (err) {
      console.error(
        "❌ Failed to add moment:",
        err
      );

      setError(
        "We couldn't add this moment."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =================================
     EDIT MOMENT
  ================================= */

  const handleEditMoment = async (form) => {
    if (!editingMoment) return;

    try {
      setSaving(true);
      setError("");

      const updatedMoment =
        await updateMoment(
          editingMoment.id,
          {
            date: form.date,
            title: form.title,
            text: form.text,
            icon: form.icon,
            type: form.type,
            favorite: form.favorite,
          }
        );

      const formattedMoment =
        formatMoment(updatedMoment);

      setMoments((current) =>
        current.map((moment) =>
          moment.id === formattedMoment.id
            ? formattedMoment
            : moment
        )
      );

      setSelectedMoment((current) =>
        current?.id === formattedMoment.id
          ? formattedMoment
          : current
      );

      setEditingMoment(null);
    } catch (err) {
      console.error(
        "❌ Failed to update moment:",
        err
      );

      setError(
        "We couldn't update this moment."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =================================
     DELETE MOMENT
  ================================= */

  const handleDeleteMoment = async () => {
    if (!momentToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteMoment(
        momentToDelete.id
      );

      setMoments((current) =>
        current.filter(
          (moment) =>
            moment.id !==
            momentToDelete.id
        )
      );

      if (
        selectedMoment?.id ===
        momentToDelete.id
      ) {
        setSelectedMoment(null);
      }

      setMomentToDelete(null);
    } catch (err) {
      console.error(
        "❌ Failed to delete moment:",
        err
      );

      setError(
        "We couldn't delete this moment."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =================================
     TOGGLE FAVORITE
  ================================= */

  const handleToggleFavorite = async (
    event,
    moment
  ) => {
    event.stopPropagation();

    const newFavorite =
      !moment.favorite;

    setMoments((current) =>
      current.map((item) =>
        item.id === moment.id
          ? {
              ...item,
              favorite: newFavorite,
            }
          : item
      )
    );

    setSelectedMoment((current) =>
      current?.id === moment.id
        ? {
            ...current,
            favorite: newFavorite,
          }
        : current
    );

    try {
      await updateMoment(
        moment.id,
        {
          date: moment.date,
          title: moment.title,
          text: moment.text,
          icon: moment.icon,
          type: moment.type,
          favorite: newFavorite,
        }
      );
    } catch (err) {
      console.error(
        "❌ Failed to update favorite:",
        err
      );

      setMoments((current) =>
        current.map((item) =>
          item.id === moment.id
            ? {
                ...item,
                favorite:
                  moment.favorite,
              }
            : item
        )
      );

      setSelectedMoment((current) =>
        current?.id === moment.id
          ? {
              ...current,
              favorite:
                moment.favorite,
            }
          : current
      );

      setError(
        "We couldn't update the favorite."
      );
    }
  };

  /* =================================
     ESCAPE KEY
  ================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (editingMoment) {
        setEditingMoment(null);
        return;
      }

      if (showAddMoment) {
        setShowAddMoment(false);
        return;
      }

      if (momentToDelete) {
        setMomentToDelete(null);
        return;
      }

      closeMoment();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    editingMoment,
    showAddMoment,
    momentToDelete,
  ]);

  /* =================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <main className="moments-world">

        <div className="moments-stars moments-stars-one" />
        <div className="moments-stars moments-stars-two" />
        <div className="moments-stars moments-stars-three" />

        <div className="moments-nebula moments-nebula-one" />
        <div className="moments-nebula moments-nebula-two" />

        <div className="moments-loading">
          <span>✨</span>
          <p>
            Loading our little moments...
          </p>
        </div>

      </main>
    );
  }

  /* =================================
     ERROR
  ================================= */

  if (error && moments.length === 0) {
    return (
      <main className="moments-world">

        <div className="moments-stars moments-stars-one" />
        <div className="moments-stars moments-stars-two" />
        <div className="moments-stars moments-stars-three" />

        <div className="moments-nebula moments-nebula-one" />
        <div className="moments-nebula moments-nebula-two" />

        <div className="moments-loading">
          <span>💔</span>

          <p>{error}</p>

          <button onClick={onBack}>
            Back to Universe
          </button>
        </div>

      </main>
    );
  }

  /* =================================
     MAIN UI
  ================================= */

  return (
    <main className="moments-world">

      {/* =================================
          ATMOSPHERE
      ================================= */}

      <div className="moments-stars moments-stars-one" />
      <div className="moments-stars moments-stars-two" />
      <div className="moments-stars moments-stars-three" />

      <div className="moments-nebula moments-nebula-one" />
      <div className="moments-nebula moments-nebula-two" />

      {/* =================================
          HEADER
      ================================= */}

      <header className="moments-header">

        <button
          className="moments-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <div className="moments-title">

          <span className="moments-icon">
            ✨
          </span>

          <div>

            <p className="moments-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>Moments</h1>

            <p className="moments-subtitle">
              The little things that became special.
            </p>

          </div>

        </div>

        <div className="moments-counter">

          <span>
            {moments.length}
          </span>

          <small>
            moments
          </small>

        </div>

      </header>

      {/* =================================
          CONTENT
      ================================= */}

      <section className="moments-content">

        {/* =================================
            INTRO
        ================================= */}

        <div className="moments-intro">

          <span className="moments-line" />

          <p>
            Not every special moment is a big one.
            <br />
            Sometimes, it's just a feeling.
          </p>

          <span className="moments-line" />

        </div>

        {/* =================================
            ACTIONS
        ================================= */}

        <div className="moments-actions">

          <button
            className="moments-add-button"
            onClick={() =>
              setShowAddMoment(true)
            }
          >
            <span>＋</span>
            <span>Add Moment</span>
          </button>

          {error && (
            <span className="moments-inline-error">
              {error}
            </span>
          )}

        </div>

        {/* =================================
            CONSTELLATION
        ================================= */}

        {moments.length > 0 ? (
          <div className="moments-constellation">

            <div className="moments-orbit moments-orbit-one" />

            <div className="moments-orbit moments-orbit-two" />

            <div className="moments-center">

              <span>💫</span>

              <small>US</small>

            </div>

            {moments.map((moment, index) => (

              <div
                key={moment.id}
                className={`moment-card moment-card-${(index % 8) + 1}`}
                role="button"
                tabIndex={0}
                onClick={() => openMoment(moment)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    openMoment(moment);
                  }
                }}
              >

                <span className="moment-star">
                  {moment.icon}
                </span>

                <span className="moment-card-info">

                  <strong>
                    {moment.title}
                  </strong>

                  <small>
                    {moment.date}
                  </small>

                </span>

                <button
                  type="button"
                  className="moment-favorite"
                  onClick={(event) =>
                    handleToggleFavorite(
                      event,
                      moment
                    )
                  }
                  aria-label={
                    moment.favorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {moment.favorite
                    ? "♥"
                    : "♡"}
                </button>

              </div>

            ))}

          </div>
        ) : (
          <div className="moments-empty">
            <span>✨</span>

            <h2>
              No moments yet
            </h2>

            <p>
              Let's add the first little piece
              of our story.
            </p>

            <button
              onClick={() =>
                setShowAddMoment(true)
              }
            >
              Add Our First Moment
            </button>
          </div>
        )}

        {/* =================================
            HINT
        ================================= */}

        {moments.length > 0 && (
          <div className="moments-hint">

            <span>✦</span>

            <span>
              Click a moment to discover its story
            </span>

            <span>✦</span>

          </div>
        )}

      </section>

      {/* =================================
          FOOTER
      ================================= */}

      <footer className="moments-footer">

        <span>✦</span>

        <span>
          The smallest moments often mean the most.
        </span>

        <span>✦</span>

      </footer>

      {/* =================================
          VIEWER
      ================================= */}

      {selectedMoment && (

        <div
          className="moments-viewer"
          role="dialog"
          aria-modal="true"
          onClick={closeMoment}
        >

          <button
            className="moments-viewer-close"
            onClick={closeMoment}
            aria-label="Close moment"
          >
            ×
          </button>

          <article
            className="moments-viewer-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="moments-viewer-icon">
              {selectedMoment.icon}
            </div>

            <span className="moments-viewer-date">
              {selectedMoment.date}
            </span>

            <h2>
              {selectedMoment.title}
            </h2>

            <div className="moments-viewer-divider">
              <span>✦</span>
            </div>

            <p>
              {selectedMoment.text}
            </p>

            {selectedMoment.favorite && (
              <div className="moments-viewer-favorite">
                ♥ One of our little treasures
              </div>
            )}

            <div className="moments-viewer-number">
              Moment{" "}
              {moments.findIndex(
                (moment) =>
                  moment.id ===
                  selectedMoment.id
              ) + 1}
              {" / "}
              {moments.length}
            </div>

            {/* =================================
                VIEWER ACTIONS
            ================================= */}

            <div className="moment-viewer-actions">

              <button
                type="button"
                className={`moment-viewer-favorite${
                  selectedMoment.favorite ? " is-favorite" : ""
                }`}
                onClick={(event) =>
                  handleToggleFavorite(
                    event,
                    selectedMoment
                  )
                }
              >
                {selectedMoment.favorite
                  ? "♥"
                  : "♡"}
              </button>

              <button
                type="button"
                className="moment-viewer-edit"
                onClick={() => {
                  setEditingMoment(
                    selectedMoment
                  );
                  setSelectedMoment(null);
                }}
              >
                ✏️
              </button>

              <button
                type="button"
                className="moment-viewer-delete"
                onClick={() => {
                  setMomentToDelete(
                    selectedMoment
                  );
                  setSelectedMoment(null);
                }}
              >
                🗑
              </button>

            </div>

          </article>

        </div>

      )}

      {/* =================================
          ADD FORM
      ================================= */}

      {showAddMoment && (
        <MomentForm
          onSubmit={handleAddMoment}
          onClose={() =>
            setShowAddMoment(false)
          }
          saving={saving}
        />
      )}

      {/* =================================
          EDIT FORM
      ================================= */}

      {editingMoment && (
        <MomentForm
          moment={editingMoment}
          onSubmit={handleEditMoment}
          onClose={() =>
            setEditingMoment(null)
          }
          saving={saving}
        />
      )}

      {/* =================================
          DELETE CONFIRMATION
      ================================= */}

      {momentToDelete && (
        <ConfirmMomentDelete
          moment={momentToDelete}
          onConfirm={handleDeleteMoment}
          onClose={() =>
            setMomentToDelete(null)
          }
          deleting={deleting}
        />
      )}

    </main>
  );
}

export default MomentsWorld;
