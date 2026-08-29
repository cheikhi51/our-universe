function PlanetDetails({ planet, onClose }) {
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

      <span className="details-stats">
        {planet.stats}
      </span>

      <button className="explore-button">
        Explore
      </button>

    </div>
  );
}

export default PlanetDetails;