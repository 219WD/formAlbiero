import React, { useState } from "react";
import Swal from "sweetalert2";
import "./css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { createSwal } from "../utils/swalConfig";
import config from "../config/config";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const swal = createSwal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      swal.fire({
        title: "Error",
        text: "Por favor completa todos los campos",
        icon: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.data.token, data.data.user);
        
        swal.fire({
          title: "¡Bienvenido!",
          text: "Has iniciado sesión correctamente",
          icon: "success",
        }).then(() => {
          navigate("/email-marketing");
        });
      } else {
        swal.fire({
          title: "Error",
          text: data.message || "Credenciales incorrectas",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      swal.fire({
        title: "Error",
        text: "Error de conexión con el servidor",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-container">
          <img
            src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png"
            alt="Logo"
            className="logo"
          />
        </div>

        <h1 className="login-title">Acceso Administrativo</h1>
        <p className="login-subtitle">Solo personal autorizado</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email *
            </label>
            <div className="input-container">
              <i className="fas fa-envelope input-icon"></i>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Ingresa tu email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">
              Contraseña *
            </label>
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? "button-disabled" : ""}`}
            disabled={loading}
          >
            <i
              className={`fas ${
                loading ? "fa-spinner fa-spin" : "fa-sign-in-alt"
              }`}
            ></i>
            {loading ? " Iniciando sesión..." : " Iniciar Sesión"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Eres un usuario nuevo? <Link to="/register">Crear una cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}