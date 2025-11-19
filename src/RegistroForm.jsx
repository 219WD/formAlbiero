import React, { useState } from 'react';
import './RegistroForm.css';

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    servicio: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.servicio || !formData.telefono) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    
    try {
      // Aquí pondrás tu URL del API
      const response = await fetch('https://n8n.srv1092751.hstgr.cloud/webhook/2dbe68d9-8953-4cc9-a88f-1ba1bedf8e1d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert("Registro exitoso");
        // Limpiar formulario después del éxito
        setFormData({
          nombre: '',
          email: '',
          servicio: '',
          telefono: '',
        });
      } else {
        alert("Error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el formulario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Logo */}
      <div className="logo-container">
        <img 
          src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png" 
          alt="Logo" 
          className="logo"
        />
      </div>

      <h1 className="title">Formulario de Registro</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre" className="label">Nombre</label>
          <input 
            id="nombre"
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            className="input" 
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="label">Email</label>
          <input 
            id="email"
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="input" 
            placeholder="tu@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="servicio" className="label">Servicio</label>
          <input 
            id="servicio"
            type="text" 
            name="servicio" 
            value={formData.servicio} 
            onChange={handleChange} 
            className="input" 
            placeholder="Servicio requerido"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono" className="label">Teléfono</label>
          <input 
            id="telefono"
            type="tel" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            className="input" 
            placeholder="Tu número de teléfono"
          />
        </div>

        <button 
          type="submit" 
          className={`button ${loading ? 'button-disabled' : ''}`} 
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Registro"}
        </button>
      </form>
    </div>
  );
}