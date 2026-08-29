import { useState } from "react";
import { planets } from "../../data/planets";
import Planet from "./Planet";
import PlanetDetails from "./PlanetDetails";

function Universe() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
  };

  const closePlanet = () => {
    setSelectedPlanet(null);
  };

  return (
    <main className={`universe ${
      selectedPlanet ? "universe-planet-open" : ""
    }`}>

      {/* Stars */}
      <div className="stars stars-one" />
      <div className="stars stars-two" />
      <div className="stars stars-three" />

      {/* Header */}
      <header className="universe-header">
        <h1>OUR-UNIVERSE</h1>
        <p>Our little universe, just for us.</p>
      </header>

      <section className="universe-stage">

        {/* Orbits */}
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />

        {/* Center */}
        <button
          className="sun"
          onClick={closePlanet}
        >
          <span>❤️</span>
          <strong>Us</strong>
          <small>Our Universe</small>
        </button>

        {/* Planets */}
        {planets.map((planet) => (
          <Planet
            key={planet.id}
            planet={planet}
            selected={selectedPlanet?.id === planet.id}
            onClick={handlePlanetClick}
          />
        ))}

        {/* Selected planet details */}
        {selectedPlanet && (
          <PlanetDetails
            planet={selectedPlanet}
            onClose={closePlanet}
          />
        )}

      </section>

      <footer className="universe-footer">
        <span>✨</span>
        <span>Made for Naya and Cheiko</span>
        <span>✨</span>
      </footer>

    </main>
  );
}

export default Universe;