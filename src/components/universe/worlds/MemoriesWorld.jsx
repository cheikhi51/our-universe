import { useEffect, useState } from "react";

import { getMyUniverse } from "../../../services/universeService";
import AddMemory from "./AddMemory";
import EditMemory from "./EditMemory";
import {
  getMyMemories,
  deleteMemory,
} from "../../../services/memoriesService";
import ConfirmMemoryDelete from "./ConfirmMemoryDelete";

function MemoriesWorld({ onBack }) {
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [editingMemory, setEditingMemory] =
  useState(null);

  const [memoryToDelete, setMemoryToDelete] = useState(null);

  const [deletingMemory, setDeletingMemory] = useState(false);
  /*
   * ============================================
   * LOAD MEMORIES FROM SUPABASE
   * ============================================
   */

  useEffect(() => {
    let mounted = true;

    async function loadMemories() {
      try {
        setLoading(true);
        setError("");

        const universeMembership = await getMyUniverse();

        if (!universeMembership?.universes?.id) {
          throw new Error("No universe found for this account.");
        }

        const universeId = universeMembership.universes.id;

        const data = await getMyMemories(universeId);

        if (!mounted) return;

        /*
         * Convert Supabase data into the format
         * our existing UI expects.
         */
        const formattedMemories = data.map((memory) => ({
          id: memory.id,
          title: memory.title,
          date: memory.memory_date
            ? new Date(memory.memory_date).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )
            : "",
          description: memory.description || "",
          image: memory.image_url || "",
        }));

        setMemories(formattedMemories);
      } catch (err) {
        console.error("Failed to load memories:", err);

        if (mounted) {
          setError(
            err.message || "Unable to load our memories."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMemories();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ============================================
   * CURRENT MEMORY
   * ============================================
   */

  const currentIndex = selectedMemory
    ? memories.findIndex(
        (memory) => memory.id === selectedMemory.id
      )
    : -1;

  /*
   * ============================================
   * NAVIGATION
   * ============================================
   */

  const goToPrevious = () => {
    if (!memories.length) return;

    if (currentIndex <= 0) {
      setSelectedMemory(memories[memories.length - 1]);
      return;
    }

    setSelectedMemory(memories[currentIndex - 1]);
  };

  const goToNext = () => {
    if (!memories.length) return;

    if (currentIndex === memories.length - 1) {
      setSelectedMemory(memories[0]);
      return;
    }

    setSelectedMemory(memories[currentIndex + 1]);
  };

  /*
   * ============================================
   * KEYBOARD CONTROLS
   * ============================================
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedMemory) return;

      if (event.key === "Escape") {
        setSelectedMemory(null);
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMemory, currentIndex, memories]);

  const handleDeleteMemory = async () => {
  if (!memoryToDelete) return;

  try {
    setDeletingMemory(true);

    await deleteMemory(
      memoryToDelete.id
    );

    setMemories((currentMemories) =>
      currentMemories.filter(
        (memory) =>
          memory.id !== memoryToDelete.id
      )
    );

    if (
      selectedMemory?.id ===
      memoryToDelete.id
    ) {
      setSelectedMemory(null);
    }

    setMemoryToDelete(null);
  } catch (err) {
    console.error(
      "Failed to delete memory:",
      err
    );

    alert(
      err.message ||
        "Unable to delete this memory."
    );
  } finally {
    setDeletingMemory(false);
  }
};

  /*
   * ============================================
   * LOADING STATE
   * ============================================
   */

  if (loading) {
    return (
      <main className="memories-world">
        <div className="memories-stars memories-stars-one" />
        <div className="memories-stars memories-stars-two" />
        <div className="memories-stars memories-stars-three" />

        <div className="memories-nebula memories-nebula-one" />
        <div className="memories-nebula memories-nebula-two" />

        <div className="memories-loading">
          <span>💗</span>
          <p>Loading our memories...</p>
        </div>
      </main>
    );
  }

  /*
   * ============================================
   * ERROR STATE
   * ============================================
   */

  if (error) {
    return (
      <main className="memories-world">
        <div className="memories-stars memories-stars-one" />
        <div className="memories-stars memories-stars-two" />
        <div className="memories-stars memories-stars-three" />

        <div className="memories-nebula memories-nebula-one" />
        <div className="memories-nebula memories-nebula-two" />

        <div className="memories-loading">
          <span>🌙</span>
          <p>{error}</p>

          <button onClick={onBack}>
            Back to Universe
          </button>
        </div>
      </main>
    );
  }

  /*
   * ============================================
   * MAIN UI
   * ============================================
   */
  
  return (
    <main className="memories-world">

      {/* Background atmosphere */}

      <div className="memories-stars memories-stars-one" />
      <div className="memories-stars memories-stars-two" />
      <div className="memories-stars memories-stars-three" />

      <div className="memories-nebula memories-nebula-one" />
      <div className="memories-nebula memories-nebula-two" />

      {/* Header */}

      <header className="memories-header">

        <button
          className="memories-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <button
          className="memories-add-button"
          onClick={() => setShowAddMemory(true)}
        >
          <span>+</span>
          <span>Add Memory</span>
        </button>
        <div className="memories-title">

          <span className="memories-icon">
            📸
          </span>

          <div>
            <p className="memories-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>
              Memories
            </h1>

            <p className="memories-subtitle">
              The moments we never want to forget.
            </p>
          </div>

        </div>

        <div className="memories-counter">

          <span>
            {memories.length}
          </span>

          <small>
            memories
          </small>
        </div>
        
        

      </header>

      {/* Main content */}

      <section className="memories-content">

        <div className="memories-intro">

          <span className="memories-line" />

          <p>
            Every picture is a little piece of our story,
            <br />
            floating somewhere in our universe.
          </p>

          <span className="memories-line" />

        </div>

        <div className="memories-grid">

          {memories.map((memory, index) => (

            <button
              key={memory.id}
              className={`memory-card memory-card-${index + 1}`}
              onClick={() => setSelectedMemory(memory)}
            >

              <div className="memory-image-wrapper">

                <img
                  src={memory.image}
                  alt={memory.title}
                  className="memory-image"
                />

                <div className="memory-image-overlay">
                  <span>View memory</span>
                </div>

                <div className="memory-star">
                  ✦
                </div>

              </div>

              <div className="memory-card-info">

                <span className="memory-date">
                  {memory.date}
                </span>

                <h2>
                  {memory.title}
                </h2>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* Footer */}

      <footer className="memories-footer">

        <span>✦</span>

        <span>
          Our memories are stars in the same sky
        </span>

        <span>✦</span>

      </footer>

      {/* Memory viewer */}

      {selectedMemory && (

        <div
          className="memory-viewer"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedMemory(null)}
        >

          <button
            className="memory-viewer-close"
            onClick={() => setSelectedMemory(null)}
            aria-label="Close memory"
          >
            ×
          </button>

          <button
            className="memory-navigation memory-navigation-left"
            onClick={(event) => {
              event.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous memory"
          >
            ←
          </button>

          <article
            className="memory-viewer-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="memory-viewer-image-wrapper">

              <img
                src={selectedMemory.image}
                alt={selectedMemory.title}
                className="memory-viewer-image"
              />

            </div>

            <div className="memory-viewer-details">
              <span>{selectedMemory.date}</span>

              <h2>{selectedMemory.title}</h2>

              <p>{selectedMemory.description}</p>

              <div className="memory-viewer-actions">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMemory(selectedMemory);
                    setSelectedMemory(null);
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMemoryToDelete(
                      selectedMemory
                    );
                  }}
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="memory-viewer-position">
                {currentIndex + 1} / {memories.length}
              </div>
            </div>

          </article>

          <button
            className="memory-navigation memory-navigation-right"
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            aria-label="Next memory"
          >
            →
          </button>

        </div>

      )}

      {showAddMemory && (
        <AddMemory
          onClose={() => setShowAddMemory(false)}
          onMemoryCreated={(createdMemory) => {
          const formattedMemory = {
            id: createdMemory.id,
            title: createdMemory.title,
            date: createdMemory.memory_date
              ? new Date(createdMemory.memory_date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "",
            description: createdMemory.description || "",
            image: createdMemory.image_url || "",
          };

          setMemories((currentMemories) => [
            formattedMemory,
            ...currentMemories,
          ]);

          setShowAddMemory(false);
        }}
        />
      )}

      {editingMemory && (
          <EditMemory
            memory={editingMemory}
            onClose={() =>
              setEditingMemory(null)
            }
            onMemoryUpdated={(updatedMemory) => {
            const formattedMemory = {
              id: updatedMemory.id,
              title: updatedMemory.title,
              date: updatedMemory.memory_date
                ? new Date(
                    updatedMemory.memory_date
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "",
              description: updatedMemory.description || "",
              image:
                updatedMemory.image_url ||
                editingMemory?.image ||
                "",
            };

            setMemories((currentMemories) =>
              currentMemories.map((memory) =>
                memory.id === formattedMemory.id
                  ? formattedMemory
                  : memory
              )
            );

            setEditingMemory(null);
          }}
          />
        )}

        {memoryToDelete && (
          <ConfirmMemoryDelete
            memory={memoryToDelete}
            loading={deletingMemory}
            onCancel={() =>
              setMemoryToDelete(null)
            }
            onConfirm={handleDeleteMemory}
          />
        )}

    </main>
  );
}

export default MemoriesWorld;