import TimelineMilestones from "./TimelineMilestones";

function PlanetDetails({ planet, onClose }) {
  if (!planet) return null;

  return (
    <div className="planet-details">

      <div
        className="close-button"
      >
        <button 
        onClick={onClose}
        aria-label="Close"
        >
          ×
        </button>
      </div>

      <h2>{planet.name}</h2>

      <p>{planet.description}</p>

      {planet.id === "timeline" ? (
        <TimelineMilestones />
      ) : (
        <>
          <span className="details-stats">
            {planet.stats}
          </span>

          <button className="explore-button">
            Explore
          </button>
        </>
      )}

    </div>
  );
}

export default PlanetDetails;