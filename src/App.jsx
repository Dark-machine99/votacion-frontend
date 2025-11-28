import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // rol votante
  return <VoterDashboard />;
}

export default App;
