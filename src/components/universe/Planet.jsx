import { useRef } from "react";

function Planet({ planet, selected, onClick }) {
  const bodyRef = useRef(null);

  const handleMouseMove = (e) => {
    const body = bodyRef.current;
    if (!body) return;

    const rect = body.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    body.style.setProperty("--tilt-x", `${(-y * 18).toFixed(2)}deg`);
    body.style.setProperty("--tilt-y", `${(x * 18).toFixed(2)}deg`);
  };

  const handleMouseLeave = () => {
    const body = bodyRef.current;
    if (!body) return;

    body.style.setProperty("--tilt-x", "0deg");
    body.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <button
      className={`
        planet
        planet-${planet.position}
        planet-${planet.id}
        ${selected ? "planet-selected" : ""}
      `}
      onClick={() => onClick(planet)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={planet.name}
    >
      <span className="planet-body" ref={bodyRef}>
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