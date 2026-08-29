function Planet({ planet, selected, onClick }) {
  return (
    <button
      className={`
        planet
        planet-${planet.position}
        planet-${planet.id}
        ${selected ? "planet-selected" : ""}
      `}
      onClick={() => onClick(planet)}
      aria-label={planet.name}
    >
      <span className="planet-body">
        <span className="planet-icon">
          {planet.icon}
        </span>
      </span>

      <span className="planet-name">
        {planet.name}
      </span>
    </button>
  );
}

export default Planet;