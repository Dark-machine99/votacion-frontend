import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("user@vota.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
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

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center">
      <div className="card login-card">
        <h1 className="title">Sistema de Votación</h1>
        <p className="subtitle">Accede a tu cuenta</p>

        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Correo electrónico
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </label>

          <label className="label">
            Contraseña
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

          <p className="hint">
            ¿No tienes una cuenta? <span className="link">Regístrate aquí</span>
          </p>
        </form>
      </div>
    </div>
  );
}
