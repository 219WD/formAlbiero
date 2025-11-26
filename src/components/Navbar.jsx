import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Navbar.css';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        {/* Logo y nombre */}
        <div className="admin-navbar-logo">
          <img 
            src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png" 
            alt="Logo Albiero" 
            className="logo"
          />
          <span className="logo-text">
            Albiero Admin
          </span>
        </div>

        {/* Información del usuario y acciones */}
        <div className="navbar-user-info">
          <span className="user-greeting">
            👋 Hola, {user?.nombre}
          </span>
          <div className="navbar-actions">
            {/* Botón Email Marketing */}
            <Link 
              to="/email-marketing" 
              className="nav-action-button email-marketing"
            >
              <i className="fas fa-envelope"></i>
              Email Marketing
            </Link>
            
            {/* Botón Logout */}
            <button 
              onClick={logout} 
              className="nav-action-button logout"
            >
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}