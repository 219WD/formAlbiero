import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './css/RegistroForm.css';

// Importar CSS de Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    servicio: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);

  // URL de producción
  const WEBHOOK_URL = 'https://n8n.srv1092751.hstgr.cloud/webhook/2dbe68d9-8953-4cc9-a88f-1ba1bedf8e1d';

  // CONFIGURACIÓN - Cambia este número por tu WhatsApp
  const whatsappNumber = '5493813522339'; // Reemplaza con tu número
  const whatsappMessage = 'Hola, me interesa conocer más sobre sus servicios. ¿Podrían proporcionarme información?';

  // Función para abrir WhatsApp
  const openWhatsApp = () => {
    const message = encodeURIComponent(whatsappMessage);
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Función para mostrar alerta de éxito
  const showSuccessAlert = () => {
    return Swal.fire({
      title: '¡Registro Exitoso!',
      html: 'Hemos recibido tu información. <br />Te contactaremos pronto.',
      icon: 'success',
      iconColor: '#7D1522',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7D1522',
      background: '#FAFFFF',
      color: '#3D3D3D',
      customClass: {
        title: 'swal-title',
        htmlContainer: 'swal-text',
        confirmButton: 'swal-button'
      }
    });
  };

  // Función para mostrar alerta de error
  const showErrorAlert = (message) => {
    return Swal.fire({
      title: '¡Error!',
      html: message,
      icon: 'error',
      iconColor: '#dc2626',
      confirmButtonText: 'Intentar nuevamente',
      confirmButtonColor: '#dc2626',
      background: '#FAFFFF',
      color: '#3D3D3D',
      customClass: {
        title: 'swal-title',
        htmlContainer: 'swal-text',
        confirmButton: 'swal-button'
      }
    });
  };

  // Función para mostrar alerta de validación
  const showValidationAlert = (message) => {
    return Swal.fire({
      title: 'Campos incompletos',
      html: message,
      icon: 'warning',
      iconColor: '#f59e0b',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#f59e0b',
      background: '#FAFFFF',
      color: '#3D3D3D',
      customClass: {
        title: 'swal-title',
        htmlContainer: 'swal-text',
        confirmButton: 'swal-button'
      }
    });
  };

  // Función para mostrar alerta de carga
  const showLoadingAlert = () => {
    Swal.fire({
      title: 'Enviando registro...',
      html: 'Por favor espera un momento.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      background: '#FAFFFF',
      color: '#3D3D3D',
      customClass: {
        title: 'swal-title',
        htmlContainer: 'swal-text'
      }
    });
  };

  // Función para cerrar alerta de carga
  const closeLoadingAlert = () => {
    Swal.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.servicio || !formData.telefono) {
      showValidationAlert("Por favor completa todos los campos del formulario.");
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showValidationAlert("Por favor ingresa un email válido.");
      return;
    }

    setLoading(true);
    showLoadingAlert();
    
    try {
      console.log('📤 Enviando datos:', formData);
      console.log('🔗 URL utilizada:', WEBHOOK_URL);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'albiero-web-form',
          environment: 'production'
        })
      });

      console.log('📥 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      closeLoadingAlert();

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('✅ Resultado JSON:', result);
        } else {
          const text = await response.text();
          console.log('✅ Respuesta texto:', text);
        }
        
        await showSuccessAlert();
        
        // Limpiar formulario después del éxito
        setFormData({
          nombre: '',
          email: '',
          servicio: '',
          telefono: '',
        });
      } else {
        // Manejar errores del servidor
        let errorMessage = "Error en el servidor. Por favor intenta nuevamente.";
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('❌ Error JSON:', errorData);
          errorMessage = errorData.message || response.statusText;
        } else {
          const errorText = await response.text();
          console.error('❌ Error texto:', errorText);
          errorMessage = `${response.status} ${response.statusText}`;
        }
        
        await showErrorAlert(errorMessage);
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      closeLoadingAlert();
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        await showErrorAlert("Error de conexión. Verifica tu internet e intenta nuevamente.");
      } else {
        await showErrorAlert("Error inesperado. Por favor intenta nuevamente.");
      }
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
          <label htmlFor="nombre" className="label">Nombre *</label>
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
          <label htmlFor="email" className="label">Email *</label>
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
          <label htmlFor="servicio" className="label">Servicio *</label>
          <div className="input-container">
            <i className="fas fa-concierge-bell input-icon"></i>
            <input 
              id="servicio"
              type="text" 
              name="servicio" 
              value={formData.servicio} 
              onChange={handleChange} 
              className="input" 
              placeholder="Servicio requerido"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="telefono" className="label">Teléfono *</label>
          <div className="input-container">
            <i className="fas fa-phone input-icon"></i>
            <input 
              id="telefono"
              type="tel" 
              name="telefono" 
              value={formData.telefono} 
              onChange={handleChange} 
              className="input" 
              placeholder="Tu número de teléfono"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={`button ${loading ? 'button-disabled' : ''}`} 
          disabled={loading}
        >
          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          {loading ? " Enviando..." : " Enviar Registro"}
        </button>
      </form>

      {/* Botón de WhatsApp */}
      <div className="whatsapp-section">
        <div className="whatsapp-divider">
          <span>O contáctanos directamente</span>
        </div>
        <button 
          type="button" 
          className="whatsapp-button"
          onClick={openWhatsApp}
        >
          <i className="fab fa-whatsapp"></i>
          Contactar por WhatsApp
        </button>
      </div>
    </div>
  );
}