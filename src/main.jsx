// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import "./App.css"; // <-- IMPORTA TUS ESTILOS PRINCIPALES
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
