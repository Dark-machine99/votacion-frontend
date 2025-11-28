// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { registerVoter } from "../api";

export default function Login() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"

  // login
  const [email, setEmail] = useState("user@vota.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // register
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerVoter(rName, rEmail, rPassword);
      // autologin opcional
      await login(rEmail, rPassword);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-8">
      <div className="card login-card" style={{ maxWidth: 420, width: "100%" }}>
        <h1 className="title" style={{ textAlign: "center" }}>
          Sistema de Votación
        </h1>
        <p className="subtitle" style={{ textAlign: "center", marginBottom: 16 }}>
          {mode === "login" ? "Accede a tu cuenta" : "Crear cuenta de votante"}
        </p>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="form">
            <label className="label">
              Correo electrónico
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="label">
              Contraseña
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <div className="error">{error}</div>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            <p className="hint" style={{ textAlign: "center" }}>
              ¿No tienes una cuenta?{" "}
              <span className="link" onClick={() => setMode("register")}>
                Regístrate aquí
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="form">
            <label className="label">
              Nombre completo
              <input
                className="input"
                value={rName}
                onChange={(e) => setRName(e.target.value)}
                required
              />
            </label>

            <label className="label">
              Correo electrónico
              <input
                className="input"
                type="email"
                value={rEmail}
                onChange={(e) => setREmail(e.target.value)}
                required
              />
            </label>

            <label className="label">
              Contraseña
              <input
                className="input"
                type="password"
                value={rPassword}
                onChange={(e) => setRPassword(e.target.value)}
                required
              />
            </label>

            {error && <div className="error">{error}</div>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </button>

            <p className="hint" style={{ textAlign: "center" }}>
              ¿Ya tienes cuenta?{" "}
              <span className="link" onClick={() => setMode("login")}>
                Inicia sesión
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
