

function PlanetDetails({ planet, onClose , onExplore}) {
  if (!planet) return null;

  return (
    <div className="planet-details">
        <button 
        className="close-button"
        onClick={onClose}
        aria-label="Close"
        >
          ×
        </button>

      <h2>{planet.name}</h2>

      <p>{planet.description}</p>

      {planet.stats && (
        <>
          <span className="details-stats">
            {planet.stats}
          </span>

          <button
            className="explore-button"
            onClick={() => onExplore(planet)}
          >
            Explore
            <span>→</span>
          </button>
        </>
      )}

    </div>
  );
}

export default PlanetDetails;