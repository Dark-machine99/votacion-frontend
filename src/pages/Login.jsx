// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { registerVoter } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();

  const [mode, setMode] = useState("login"); // login | register
  const [error, setError] = useState("");

  // login
  const [email, setEmail] = useState("user@vota.com");
  const [password, setPassword] = useState("123456");

  // register
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);

      // 🔥 Redirección REAL
      if (user.role === "admin") navigate("/admin");
      else navigate("/votar");

    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    try {
      await registerVoter(rName, rEmail, rPassword);

      // Autologin
      const user = await login(rEmail, rPassword);

      // Redirección
      navigate("/votar");

    } catch (err) {
      setError(err.message);
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

        {/* ---------- LOGIN ---------- */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="form">
            <label className="label">
              Correo electrónico
              <input
                className="input"
                type="email"
                value={email}
                placeholder="correo@ejemplo.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="label">
              Contraseña
              <input
                className="input"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <div className="error">{error}</div>}

            <button className="btn-primary" type="submit" disabled={authLoading}>
              {authLoading ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            <p className="hint" style={{ textAlign: "center" }}>
              ¿No tienes una cuenta?{" "}
              <span className="link" onClick={() => setMode("register")}>
                Regístrate aquí
              </span>
            </p>
          </form>
        ) : (
          /* ---------- REGISTER ---------- */
          <form onSubmit={handleRegister} className="form">
            <label className="label">
              Nombre completo
              <input
                className="input"
                placeholder="Tu nombre"
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
                placeholder="correo@ejemplo.com"
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
                placeholder="••••••"
                value={rPassword}
                onChange={(e) => setRPassword(e.target.value)}
                required
              />
            </label>

            {error && <div className="error">{error}</div>}

            <button className="btn-primary" type="submit" disabled={authLoading}>
              {authLoading ? "Creando..." : "Crear cuenta"}
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
