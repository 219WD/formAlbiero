import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import './css/Register.css';
import { createSwal } from '../utils/swalConfig';
import config from '../config/config';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const swal = createSwal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nombre || !formData.email || !formData.password) {
      swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos obligatorios',
        icon: 'error'
      });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      swal.fire({
        title: 'Error',
        text: 'Por favor ingresa un email válido',
        icon: 'error'
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      swal.fire({
        title: 'Error',
        text: 'La contraseña debe tener al menos 6 caracteres',
        icon: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        swal.fire({
          title: '¡Registro Exitoso!',
          text: 'Tu cuenta ha sido creada correctamente',
          icon: 'success'
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        swal.fire({
          title: 'Error',
          text: data.message || 'Error al crear la cuenta',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      swal.fire({
        title: 'Error',
        text: 'Error de conexión con el servidor',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Logo */}
        <div className="logo-container">
          <img 
            src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png" 
            alt="Logo" 
            className="logo"
          />
        </div>

        <h1 className="register-title">Crear Cuenta</h1>
        <p className="register-subtitle">Regístrate para acceder al sistema</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="label">
              Nombre Completo *
            </label>
            <div className="input-container">
              <i className="fas fa-user input-icon"></i>
              <input 
                id="nombre"
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                className="input" 
                placeholder="Tu nombre completo"
                required
                disabled={loading}
              />
            </div>
          </div>

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
                placeholder="tu@email.com"
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
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="label">
              Teléfono
            </label>
            <div className="input-container">
              <i className="fas fa-phone input-icon"></i>
              <input 
                id="telefono"
                type="tel" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                className="input" 
                placeholder="+5493812345678"
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`register-button ${loading ? 'button-disabled' : ''}`} 
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-user-plus'}`}></i>
            {loading ? " Creando cuenta..." : " Crear Cuenta"}
          </button>
        </form>

        <div className="register-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link></p>
        </div>
      </div>
    </div>
  );
}