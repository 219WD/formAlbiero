import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img 
            src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png" 
            alt="Logo Albiero" 
            className="logo"
          />
          <span className="logo-text">Albiero</span>
        </div>

        {/* Menú de navegación */}
        <div className="navbar-menu">
          <Link 
            to="/registro" 
            className={`nav-link ${location.pathname === '/registro' ? 'active' : ''}`}
          >
            <i className="fas fa-user-plus"></i>
            Registro Leads
          </Link>
          
          <Link 
            to="/email-marketing" 
            className={`nav-link ${location.pathname === '/email-marketing' ? 'active' : ''}`}
          >
            <i className="fas fa-envelope"></i>
            Email Marketing
          </Link>
        </div>
      </div>
    </nav>
  );
}