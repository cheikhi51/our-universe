import { useEffect, useState } from "react";

import { getMyUniverse } from "../../../services/universeService";

import {
  getMyOurSpace,
  createOurSpaceItem,
  updateOurSpaceItem,
  deleteOurSpaceItem,
} from "../../../services/ourSpaceService";

import OurSpaceForm from "./OurSpaceForm";
import ConfirmOurSpaceDelete from "./ConfirmOurSpaceDelete";

function OurSpaceWorld({ onBack }) {
  const [ourSpace, setOurSpace] = useState([]);
  const [selectedDream, setSelectedDream] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddDream, setShowAddDream] = useState(false);
  const [editingDream, setEditingDream] = useState(null);
  const [dreamToDelete, setDreamToDelete] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =================================
     CREATE DREAM
  ================================= */

  const handleCreateDream = async (dream) => {
    try {
      setSaving(true);
      setError("");

      const universeMembership = await getMyUniverse();

      const universeId =
        universeMembership?.universes?.id;

      if (!universeId) {
        throw new Error(
          "No universe found for the current user."
        );
      }

      const createdDream = await createOurSpaceItem({
        universe_id: universeId,
        ...dream,
      });

      setOurSpace((current) => [
        ...current,
        createdDream,
      ]);

      setShowAddDream(false);
    } catch (err) {
      console.error(
        "Failed to create dream:",
        err
      );

      setError(
        "We couldn't save this dream."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =================================
     UPDATE DREAM
  ================================= */

  const handleUpdateDream = async (dream) => {
    if (!editingDream) return;

    try {
      setSaving(true);
      setError("");

      const updatedDream =
        await updateOurSpaceItem(
          editingDream.id,
          dream
        );

      setOurSpace((current) =>
        current.map((item) =>
          item.id === updatedDream.id
            ? updatedDream
            : item
        )
      );

      setEditingDream(null);
    } catch (err) {
      console.error(
        "Failed to update dream:",
        err
      );

      setError(
        "We couldn't update this dream."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =================================
     DELETE DREAM
  ================================= */

  const handleDeleteDream = async () => {
    if (!dreamToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteOurSpaceItem(
        dreamToDelete.id
      );

      setOurSpace((current) =>
        current.filter(
          (dream) =>
            dream.id !== dreamToDelete.id
        )
      );

      if (
        selectedDream?.id ===
        dreamToDelete.id
      ) {
        setSelectedDream(null);
      }

      setDreamToDelete(null);
    } catch (err) {
      console.error(
        "Failed to delete dream:",
        err
      );

      setError(
        "We couldn't delete this dream."
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
    dream
  ) => {
    event?.stopPropagation?.();

    const newFavorite = !dream.favorite;

    // Optimistic UI
    setOurSpace((current) =>
      current.map((item) =>
        item.id === dream.id
          ? {
              ...item,
              favorite: newFavorite,
            }
          : item
      )
    );

    if (
      selectedDream?.id === dream.id
    ) {
      setSelectedDream((current) => ({
        ...current,
        favorite: newFavorite,
      }));
    }

    try {
      await updateOurSpaceItem(
        dream.id,
        {
          favorite: newFavorite,
        }
      );
    } catch (err) {
      console.error(
        "Failed to update favorite:",
        err
      );

      // Rollback
      setOurSpace((current) =>
        current.map((item) =>
          item.id === dream.id
            ? {
                ...item,
                favorite: dream.favorite,
              }
            : item
        )
      );

      if (
        selectedDream?.id === dream.id
      ) {
        setSelectedDream((current) => ({
          ...current,
          favorite: dream.favorite,
        }));
      }

      setError(
        "We couldn't update the favorite."
      );
    }
  };

  /* =================================
     OPEN / CLOSE DREAM
  ================================= */

  const openDream = (dream) => {
    setSelectedDream(dream);
  };

  const closeDream = () => {
    setSelectedDream(null);
  };

  /* =================================
     LOAD OUR SPACE
  ================================= */

  useEffect(() => {
    const loadOurSpace = async () => {
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
          await getMyOurSpace(universeId);

        setOurSpace(data);
      } catch (err) {
        console.error(
          "Failed to load Our Space:",
          err
        );

        setError(
          "We couldn't load our dreams right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOurSpace();
  }, []);

  /* =================================
     ESCAPE KEY
  ================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDream();
      }
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
  }, []);

  return (
    <main className="our-space-world">

      {/* =================================
          BACKGROUND
      ================================= */}

      <div className="our-space-stars our-space-stars-one" />
      <div className="our-space-stars our-space-stars-two" />
      <div className="our-space-stars our-space-stars-three" />

      <div className="our-space-nebula our-space-nebula-one" />
      <div className="our-space-nebula our-space-nebula-two" />

      {/* =================================
          HEADER
      ================================= */}

      <header className="our-space-header">

        <button
          type="button"
          className="our-space-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <div className="our-space-title">

          <span className="our-space-icon">
            🌙
          </span>

          <div>
            <p className="our-space-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>Our Space</h1>

            <p className="our-space-subtitle">
              The dreams and future we're
              building together.
            </p>
          </div>

        </div>

        <div className="our-space-header-actions">

          <div className="our-space-counter">
            <span>
              {ourSpace.length}
            </span>

            <small>dreams</small>
          </div>

          <button
            type="button"
            className="our-space-add-button"
            onClick={() =>
              setShowAddDream(true)
            }
          >
            <span>＋</span>
            <span>Add Dream</span>
          </button>

        </div>

      </header>

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <section className="our-space-content">

        {/* Loading */}

        {loading && (
          <div className="our-space-loading">
            <span>🌙</span>
            <p>
              Opening our little universe...
            </p>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="our-space-error">

            <span>🥀</span>

            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* Content */}

        {!loading && !error && (
          <>
            {/* Intro */}

            <div className="our-space-intro">

              <span className="our-space-line" />

              <p>
                Some dreams already have a
                destination.
                <br />
                Others are simply waiting for
                their moment.
              </p>

              <span className="our-space-line" />

            </div>

            {/* =================================
                COSMIC CENTER
            ================================= */}

            <div className="our-space-orbit-system">

              <div className="our-space-orbit our-space-orbit-one" />
              <div className="our-space-orbit our-space-orbit-two" />
              <div className="our-space-orbit our-space-orbit-three" />

              {/* Moon */}

              <div className="our-space-moon">

                <div className="our-space-moon-glow" />

                <span>🌙</span>

                <strong>US</strong>

                <small>Someday</small>

              </div>

              {/* Dreams */}

              {ourSpace.map(
                (dream, index) => (
                  <div
                    key={dream.id}
                    className={`our-space-dream our-space-dream-${
                      (index % 6) + 1
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      openDream(dream)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        openDream(dream);
                      }
                    }}
                  >

                    <span className="our-space-dream-icon">
                      {dream.icon}
                    </span>

                    <span className="our-space-dream-info">

                      <strong>
                        {dream.title}
                      </strong>

                      <small>
                        {dream.type}
                      </small>

                    </span>

                    {/* Favorite */}

                    <button
                      type="button"
                      className={`our-space-dream-favorite ${
                        dream.favorite
                          ? "is-favorite"
                          : ""
                      }`}
                      onClick={(event) =>
                        handleToggleFavorite(
                          event,
                          dream
                        )
                      }
                      aria-label={
                        dream.favorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {dream.favorite
                        ? "♥"
                        : "♡"}
                    </button>

                  </div>
                )
              )}

            </div>

            {/* Hint */}

            <div className="our-space-hint">

              <span>✦</span>

              <span>
                Click a dream to explore it
              </span>

              <span>✦</span>

            </div>
          </>
        )}

      </section>

      {/* =================================
          FOOTER
      ================================= */}

      <footer className="our-space-footer">

        <span>✦</span>

        <span>
          The best chapters of our story are
          still unwritten.
        </span>

        <span>✦</span>

      </footer>

      {/* =================================
          DREAM VIEWER
      ================================= */}

      {selectedDream && (
        <div
          className="our-space-viewer"
          role="dialog"
          aria-modal="true"
          onClick={closeDream}
        >

          <button
            type="button"
            className="our-space-viewer-close"
            onClick={closeDream}
            aria-label="Close dream"
          >
            ×
          </button>

          <article
            className="our-space-viewer-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="our-space-viewer-icon">
              {selectedDream.icon}
            </div>

            <span className="our-space-viewer-type">
              {selectedDream.type}
            </span>

            <h2>
              {selectedDream.title}
            </h2>

            <div className="our-space-viewer-divider">
              <span>✦</span>
            </div>

            <p>
              {selectedDream.text}
            </p>

            <div className="our-space-items">

              {selectedDream.items.map(
                (item, index) => (
                  <div
                    className="our-space-item"
                    key={`${selectedDream.id}-${index}`}
                  >
                    <span>✦</span>

                    <p>{item}</p>
                  </div>
                )
              )}

            </div>

            {/* =================================
                VIEWER ACTIONS
            ================================= */}

            <div className="our-space-viewer-actions">

              {/* Favorite */}

              <button
                type="button"
                className={`our-space-viewer-favorite ${
                  selectedDream.favorite
                    ? "is-favorite"
                    : ""
                }`}
                onClick={(event) =>
                  handleToggleFavorite(
                    event,
                    selectedDream
                  )
                }
                aria-label={
                  selectedDream.favorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {selectedDream.favorite
                  ? "♥"
                  : "♡"}
              </button>

              {/* Edit */}

              <button
                type="button"
                className="our-space-viewer-edit"
                onClick={() => {
                  setEditingDream(
                    selectedDream
                  );
                  setSelectedDream(null);
                }}
                aria-label="Edit dream"
              >
                ✎
              </button>

              {/* Delete */}

              <button
                type="button"
                className="our-space-viewer-delete"
                onClick={() => {
                  setDreamToDelete(
                    selectedDream
                  );
                  setSelectedDream(null);
                }}
                aria-label="Delete dream"
              >
                🗑
              </button>

            </div>

            {/* Favorite message */}

            {selectedDream.favorite && (
              <div className="our-space-viewer-favorite-label">
                ♥ One of our dreams
              </div>
            )}

            {/* Dream number */}

            <div className="our-space-viewer-number">

              Dream{" "}

              {ourSpace.findIndex(
                (dream) =>
                  dream.id ===
                  selectedDream.id
              ) + 1}

              {" / "}

              {ourSpace.length}

            </div>

          </article>

        </div>
      )}

      {/* =================================
          ADD DREAM
      ================================= */}

      {showAddDream && (
        <OurSpaceForm
          onSubmit={handleCreateDream}
          onClose={() =>
            setShowAddDream(false)
          }
          saving={saving}
        />
      )}

      {/* =================================
          EDIT DREAM
      ================================= */}

      {editingDream && (
        <OurSpaceForm
          dream={editingDream}
          onSubmit={handleUpdateDream}
          onClose={() =>
            setEditingDream(null)
          }
          saving={saving}
        />
      )}

      {/* =================================
          DELETE CONFIRMATION
      ================================= */}

      {dreamToDelete && (
        <ConfirmOurSpaceDelete
          dream={dreamToDelete}
          onConfirm={handleDeleteDream}
          onClose={() =>
            setDreamToDelete(null)
          }
          deleting={deleting}
        />
      )}

    </main>
  );
}

export default OurSpaceWorld;