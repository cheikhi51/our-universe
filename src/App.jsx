import Universe from "./components/universe/Universe";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/auth/Login";
import "./App.css";



function App() {
  const {
  user,
  loading,
  isAuthenticated,
} = useAuth();

  if (loading) {
  return (
    <div className="auth-loading">
      <span>💗</span>
      <p>Entering our universe...</p>
    </div>
  );
}

if (!isAuthenticated) {
  return <Login />;
}
  return <Universe />;
}

export default App;