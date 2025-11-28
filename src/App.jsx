// src/App.jsx
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

export default function App() {
  const { user } = useAuth();

  if (!user) return <Login />;

  if (user.role === "admin") return <AdminDashboard />;

  return <VoterDashboard />;
}
