import { useState, useRef, useEffect } from "react";

import { planets } from "../../data/planets";

import Planet from "./Planet";
import PlanetDetails from "./PlanetDetails";
import Logout from "../auth/Logout";

import MemoriesWorld from "./worlds/MemoriesWorld";
import MessagesWorld from "./worlds/MessagesWorld";
import TimelineWorld from "./worlds/TimelineWorld";
import MusicWorld from "./worlds/MusicWorld";
import MomentsWorld from "./worlds/MomentsWorld";
import OurSpaceWorld from "./worlds/OurSpaceWorld";

import { getMyUniverse } from "../../services/universeService";
import { getUniverseStats } from "../../services/universeStatsService";


/* =================================
   FORMAT PLANET STATISTICS
================================= */

const formatPlanetStats = (
  planetId,
  stats,
  loading = false
) => {
  if (loading) {
    return "Loading...";
  }

  switch (planetId) {
    case "memories":
      return `${stats.memories} ${
        stats.memories === 1 ? "memory" : "memories"
      }`;

    case "messages":
      return `${stats.messages} ${
        stats.messages === 1 ? "message" : "messages"
      }`;

    case "timeline":
      return `${stats.timeline} ${
        stats.timeline === 1 ? "moment" : "moments"
      }`;

    case "music":
      return `${stats.music} ${
        stats.music === 1 ? "song" : "songs"
      }`;

    case "moments":
      return `${stats.moments} ${
        stats.moments === 1
          ? "special moment"
          : "special moments"
      }`;

    case "space":
      return `${stats.space} ${
        stats.space === 1 ? "dream" : "dreams"
      }`;

    default:
      return "";
  }
};


/* =================================
   UNIVERSE
================================= */

function Universe() {

  /* =================================
     STATE
  ================================= */

  const [selectedPlanet, setSelectedPlanet] =
    useState(null);

  const [activeWorld, setActiveWorld] =
    useState(null);

  const [universeStats, setUniverseStats] =
    useState({
      memories: 0,
      messages: 0,
      timeline: 0,
      music: 0,
      moments: 0,
      space: 0,
    });

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [statsError, setStatsError] =
    useState("");

  const stageRef = useRef(null);


  /* =================================
     LOAD UNIVERSE STATISTICS
  ================================= */

  const loadUniverseStats = async () => {

    try {

      setStatsLoading(true);
      setStatsError("");

      const universeMembership =
        await getMyUniverse();

      const universeId =
        universeMembership?.universes?.id;

      if (!universeId) {
        throw new Error(
          "No universe found for the current user."
        );
      }

      const stats =
        await getUniverseStats(universeId);

      setUniverseStats(stats);

    } catch (error) {

      console.error(
        "Failed to load universe statistics:",
        error
      );

      setStatsError(
        "Unable to load universe statistics."
      );

    } finally {

      setStatsLoading(false);

    }

  };


  /* =================================
     REFRESH UNIVERSE STATISTICS
  ================================= */

  const refreshUniverseStats = async () => {

    try {

      const universeMembership =
        await getMyUniverse();

      const universeId =
        universeMembership?.universes?.id;

      if (!universeId) {
        return;
      }

      const stats =
        await getUniverseStats(universeId);

      setUniverseStats(stats);

    } catch (error) {

      console.error(
        "Failed to refresh universe statistics:",
        error
      );

    }

  };


  /* =================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {

    loadUniverseStats();

  }, []);


  /* =================================
     PLANET CLICK
  ================================= */

  const handlePlanetClick = (planet) => {

    setSelectedPlanet(planet);

  };


  /* =================================
     CLOSE PLANET
  ================================= */

  const closePlanet = () => {

    setSelectedPlanet(null);

  };


  /* =================================
     STAGE MOUSE MOVE
  ================================= */

  const handleStageMouseMove = (e) => {

    const stage = stageRef.current;

    if (!stage) return;

    const rect =
      stage.getBoundingClientRect();

    const x =
      (e.clientX - rect.left) /
        rect.width -
      0.5;

    const y =
      (e.clientY - rect.top) /
        rect.height -
      0.5;

    stage.style.setProperty(
      "--stage-tilt-x",
      `${(-y * 8).toFixed(2)}deg`
    );

    stage.style.setProperty(
      "--stage-tilt-y",
      `${(x * 8).toFixed(2)}deg`
    );

  };


  /* =================================
     STAGE MOUSE LEAVE
  ================================= */

  const handleStageMouseLeave = () => {

    const stage = stageRef.current;

    if (!stage) return;

    stage.style.setProperty(
      "--stage-tilt-x",
      "0deg"
    );

    stage.style.setProperty(
      "--stage-tilt-y",
      "0deg"
    );

  };


  /* =================================
     EXPLORE PLANET
  ================================= */

  const handleExplore = (planet) => {

    setSelectedPlanet(null);

    setActiveWorld(planet.id);

  };


  /* =================================
     TIMELINE WORLD
  ================================= */

  if (activeWorld === "timeline") {

    return (
      <TimelineWorld
        onBack={async () => {

          await refreshUniverseStats();

          setActiveWorld(null);

        }}
      />
    );

  }


  /* =================================
     MEMORIES WORLD
  ================================= */

  if (activeWorld === "memories") {

    return (
      <MemoriesWorld
        onBack={async () => {

          await refreshUniverseStats();

          setActiveWorld(null);

        }}
      />
    );

  }


  /* =================================
     MESSAGES WORLD
  ================================= */

  if (activeWorld === "messages") {

    return (
      <MessagesWorld
        onBack={async () => {

          await refreshUniverseStats();

          setActiveWorld(null);

        }}
      />
    );

  }


  /* =================================
     MUSIC WORLD
  ================================= */

  if (activeWorld === "music") {

    return (
      <MusicWorld
        onBack={async () => {

          await refreshUniverseStats();

          setActiveWorld(null);

        }}
      />
    );

  }


  /* =================================
     MOMENTS WORLD
  ================================= */

  if (activeWorld === "moments") {

    return (
      <MomentsWorld
        onBack={async () => {

          await refreshUniverseStats();

          setActiveWorld(null);

        }}
      />
    );

  }


  /* =================================
     OUR SPACE WORLD
  ================================= */

  if (activeWorld === "space") {

    return (
      <OurSpaceWorld
        onBack={async () => {

          await refreshUniverseStats();

          setActiveWorld(null);

        }}
      />
    );

  }


  /* =================================
     MAIN UNIVERSE
  ================================= */

  return (

    <main
      className={`universe ${
        selectedPlanet
          ? "universe-planet-open"
          : ""
      }`}
    >

      {/* =================================
          STARS
      ================================= */}

      <div className="stars stars-one" />

      <div className="stars stars-two" />

      <div className="stars stars-three" />

        {/* =================================
          Logout Button
      ================================= */}
      <Logout/>
      {/* =================================
          HEADER
      ================================= */}

      <header className="universe-header">

        <h1>
          OUR-UNIVERSE
        </h1>

        <p>
          Our little universe, just for us.
        </p>

      </header>


      {/* =================================
          UNIVERSE STAGE
      ================================= */}

      <section
        className="universe-stage"
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
      >

        {/* =================================
            ORBITS
        ================================= */}

        <div className="orbit orbit-one" />

        <div className="orbit orbit-two" />


        {/* =================================
            CENTER / SUN
        ================================= */}

        <button
          className="sun"
          onClick={closePlanet}
        >

          <span>
            ❤️
          </span>

          <strong>
            Us
          </strong>

          <small>
            Our Universe
          </small>

        </button>


        {/* =================================
            PLANETS
        ================================= */}

        {planets.map((planet) => {

          const planetWithStats = {
            ...planet,

            stats: formatPlanetStats(
              planet.id,
              universeStats,
              statsLoading
            ),
          };

          return (

            <Planet
              key={planet.id}
              planet={planetWithStats}
              selected={
                selectedPlanet?.id ===
                planet.id
              }
              onClick={handlePlanetClick}
            />

          );

        })}


        {/* =================================
            SELECTED PLANET DETAILS
        ================================= */}

        {selectedPlanet && (

          <PlanetDetails
            planet={{
              ...selectedPlanet,

              stats: formatPlanetStats(
                selectedPlanet.id,
                universeStats,
                statsLoading
              ),
            }}

            onClose={closePlanet}

            onExplore={handleExplore}
          />

        )}

      </section>


      {/* =================================
          FOOTER
      ================================= */}

      <footer className="universe-footer">

        <span>
          ✨
        </span>

        <span>
          Made for cute couples
        </span>

        <span>
          ✨
        </span>

      </footer>

    </main>

  );

}


export default Universe;