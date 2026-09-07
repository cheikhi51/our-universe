import { useState, useRef } from "react";
import { planets } from "../../data/planets";
import Planet from "./Planet";
import PlanetDetails from "./PlanetDetails";
import MemoriesWorld from "./worlds/MemoriesWorld";
import MessagesWorld from "./worlds/MessagesWorld";
import TimelineWorld from "./worlds/TimelineWorld";
import MusicWorld from "./worlds/MusicWorld";
import MomentsWorld from "./worlds/MomentsWorld";
import OurSpaceWorld from "./worlds/OurSpaceWorld";

function Universe() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [activeWorld, setActiveWorld] = useState(null);
  const stageRef = useRef(null);

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
  };

  const closePlanet = () => {
    setSelectedPlanet(null);
  };

  const handleStageMouseMove = (e) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    stage.style.setProperty("--stage-tilt-x", `${(-y * 8).toFixed(2)}deg`);
    stage.style.setProperty("--stage-tilt-y", `${(x * 8).toFixed(2)}deg`);
  };

  const handleStageMouseLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--stage-tilt-x", "0deg");
    stage.style.setProperty("--stage-tilt-y", "0deg");
  };


  const handleExplore = (planet) => {
    setSelectedPlanet(null);
    setActiveWorld(planet.id);
  };
  
  if (activeWorld === "timeline") {
  return (
    <TimelineWorld
      onBack={() => setActiveWorld(null)}
    />
  );
}
  if (activeWorld === "memories") {
  return (
    <MemoriesWorld
      onBack={() => setActiveWorld(null)}
    />
  );
}

if (activeWorld === "messages") {
  return (
    <MessagesWorld
      onBack={() => setActiveWorld(null)}
    />
  );
}
if (activeWorld === "music") {
  return (
    <MusicWorld
    onBack={() => setActiveWorld(null)}
    />
  );
}
if (activeWorld === "moments") {
  return (
    <MomentsWorld
      onBack={() => setActiveWorld(null)}
    />
  );
}
if (activeWorld === "space") {
  return(
    <OurSpaceWorld 
      onBack={() => setActiveWorld(null)} 
    />
  ) 
}
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

      <section
        className="universe-stage"
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
      >

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
            onExplore={handleExplore}
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