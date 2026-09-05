import { useEffect, useState } from "react";
import { memories } from "../../../data/memories";

function MemoriesWorld({ onBack }) {
  const [selectedMemory, setSelectedMemory] = useState(null);

  const currentIndex = selectedMemory
    ? memories.findIndex((memory) => memory.id === selectedMemory.id)
    : -1;

  const goToPrevious = () => {
    if (currentIndex <= 0) {
      setSelectedMemory(memories[memories.length - 1]);
      return;
    }

    setSelectedMemory(memories[currentIndex - 1]);
  };

  const goToNext = () => {
    if (currentIndex === memories.length - 1) {
      setSelectedMemory(memories[0]);
      return;
    }

    setSelectedMemory(memories[currentIndex + 1]);
  };

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
  }, [selectedMemory, currentIndex]);

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

        <div className="memories-title">
          <span className="memories-icon">📸</span>

          <div>
            <p className="memories-eyebrow">OUR UNIVERSE</p>
            <h1>Memories</h1>
            <p className="memories-subtitle">
              The moments we never want to forget.
            </p>
          </div>
        </div>

        <div className="memories-counter">
          <span>{memories.length}</span>
          <small>memories</small>
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

                <div className="memory-star">✦</div>
              </div>

              <div className="memory-card-info">
                <span className="memory-date">{memory.date}</span>
                <h2>{memory.title}</h2>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="memories-footer">
        <span>✦</span>
        <span>Our memories are stars in the same sky</span>
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
            onClick={(event) => event.stopPropagation()}
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
    </main>
  );
}

export default MemoriesWorld;