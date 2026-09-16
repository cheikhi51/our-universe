import { useEffect, useState } from "react";

import Universe from "./components/universe/Universe";
import UniverseSetup from "./components/auth/UniverseSetup";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import { useAuth } from "./hooks/useAuth";
import { getMyUniverse } from "./services/universeService";

import "./App.css";

function App() {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const [authMode, setAuthMode] = useState("login");

  const [universeLoading, setUniverseLoading] = useState(true);
  const [hasUniverse, setHasUniverse] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkUniverse() {
      if (!isAuthenticated || !user) {
        if (mounted) {
          setHasUniverse(false);
          setUniverseLoading(false);
        }

        return;
      }

      setUniverseLoading(true);

      try {
        const membership = await getMyUniverse();

        if (mounted) {
          setHasUniverse(
            Boolean(membership?.universes?.id)
          );
        }
      } catch (error) {
        console.error(
          "Failed to check universe:",
          error
        );

        if (mounted) {
          setHasUniverse(false);
        }
      } finally {
        if (mounted) {
          setUniverseLoading(false);
        }
      }
    }

    checkUniverse();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  /*
   * AUTH LOADING
   */
  if (authLoading) {
    return (
      <div className="auth-loading">
        <span>💗</span>
        <p>Entering our universe...</p>
      </div>
    );
  }

  /*
   * NOT AUTHENTICATED
   */
  if (!isAuthenticated) {
    if (authMode === "signup") {
      return (
        <Signup
          onSignup={() => {
            setAuthMode("login");
          }}
          onGoToLogin={() => {
            setAuthMode("login");
          }}
        />
      );
    }

    return (
      <Login
        onGoToSignup={() => {
          setAuthMode("signup");
        }}
      />
    );
  }

  /*
   * CHECKING UNIVERSE
   */
  if (universeLoading) {
    return (
      <div className="auth-loading">
        <span>🌌</span>
        <p>Finding our little universe...</p>
      </div>
    );
  }

  /*
   * AUTHENTICATED BUT NO UNIVERSE
   */
  if (!hasUniverse) {
    return (
      <UniverseSetup
        onComplete={() => {
          setHasUniverse(true);
        }}
      />
    );
  }

  /*
   * AUTHENTICATED + HAS UNIVERSE
   */
  return <Universe />;
}

export default App;