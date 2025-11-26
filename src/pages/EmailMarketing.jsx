import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './css/EmailMarketing.css';

// Importar CSS de Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function EmailMarketing() {
  const [formData, setFormData] = useState({
    asunto: '',
    mensaje: '',
    archivos: []
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  // URL del webhook para email marketing
  const WEBHOOK_URL = 'https://n8n.srv1092751.hstgr.cloud/webhook/email-marketing';

  // Configuración de SweetAlert2 con la fuente Bai Jamjuree
  const swalConfig = {
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-text',
      confirmButton: 'custom-swal-button',
      cancelButton: 'custom-swal-button',
      actions: 'custom-swal-actions'
    },
    buttonsStyling: false,
    background: '#FAFFFF',
    color: '#3D3D3D'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      archivos: files
    }));
  };

  // Función para generar preview del email
  const generarPreview = () => {
    const previewHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${formData.asunto || 'Sin asunto'}</title>
          <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: "Bai Jamjuree", sans-serif; background-color: #FAFFFF; color: #3D3D3D; line-height: 1.6; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
              .banner { background: linear-gradient(135deg, #7D1522 0%, #9c1d2e 100%); padding: 30px 20px; text-align: center; }
              .logo { width: 120px; height: auto; margin-bottom: 15px; }
              .banner h1 { color: #FAFFFF; font-size: 32px; font-weight: 700; margin-bottom: 10px; }
              .banner p { color: #FAFFFF; font-size: 18px; font-weight: 400; opacity: 0.9; }
              .content { padding: 30px; }
              .mensaje { background-color: #f8f9fa; border-radius: 10px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #7D1522; }
              .mensaje h2 { color: #7D1522; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
              .texto-mensaje { color: #3D3D3D; font-size: 16px; line-height: 1.6; white-space: pre-wrap; }
              .footer { background-color: #f1f3f4; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; }
              .footer p { font-size: 14px; color: #7a7a7a; margin-bottom: 10px; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="banner">
                  <img src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png" alt="Logo Albiero" class="logo">
                  <h1>${formData.asunto || 'Nuevo Mensaje'}</h1>
                  <p>Albiero - Soluciones profesionales</p>
              </div>
              
              <div class="content">
                  <div class="mensaje">
                      <h2>Mensaje Importante</h2>
                      <div class="texto-mensaje">${formData.mensaje || 'Tu mensaje aparecerá aquí...'}</div>
                  </div>
              </div>
              
              <div class="footer">
                  <p>Este es un mensaje enviado por Albiero</p>
                  <p>© ${new Date().getFullYear()} Albiero. Todos los derechos reservados.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    setPreview(previewHTML);
  };

  // Función para mostrar alerta de éxito
  const showSuccessAlert = () => {
    return Swal.fire({
      ...swalConfig,
      title: '¡Emails Enviados!',
      html: 'Los emails se han enviado correctamente a todos los contactos de la base de datos.',
      icon: 'success',
      iconColor: '#7D1522',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7D1522'
    });
  };

  // Función para mostrar alerta de error
  const showErrorAlert = (message) => {
    return Swal.fire({
      ...swalConfig,
      title: '¡Error!',
      html: message,
      icon: 'error',
      iconColor: '#dc2626',
      confirmButtonText: 'Intentar nuevamente',
      confirmButtonColor: '#dc2626'
    });
  };

  // Función para mostrar alerta de validación
  const showValidationAlert = (message) => {
    return Swal.fire({
      ...swalConfig,
      title: 'Campos incompletos',
      html: message,
      icon: 'warning',
      iconColor: '#f59e0b',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#f59e0b'
    });
  };

  // Función para mostrar alerta de carga
  const showLoadingAlert = () => {
    Swal.fire({
      ...swalConfig,
      title: 'Enviando emails...',
      html: 'Estamos enviando los emails a todos los contactos. Esto puede tomar unos minutos.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false
    });
  };

  // Función para cerrar alerta de carga
  const closeLoadingAlert = () => {
    Swal.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.asunto || !formData.mensaje) {
      showValidationAlert("Por favor completa el asunto y el mensaje del email.");
      return;
    }

    setLoading(true);
    showLoadingAlert();
    
    try {
      console.log('📤 Enviando campaña de email:', formData);

      // Convertir archivos a base64 si existen
      const archivosBase64 = [];
      if (formData.archivos.length > 0) {
        for (const archivo of formData.archivos) {
          const base64 = await convertirABase64(archivo);
          archivosBase64.push({
            nombre: archivo.name,
            tipo: archivo.type,
            contenido: base64
          });
        }
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asunto: formData.asunto,
          mensaje: formData.mensaje,
          archivos: archivosBase64,
          timestamp: new Date().toISOString(),
          tipo: 'email-marketing'
        })
      });

      console.log('📥 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      closeLoadingAlert();

      if (response.ok) {
        await showSuccessAlert();
        
        // Limpiar formulario después del éxito
        setFormData({
          asunto: '',
          mensaje: '',
          archivos: []
        });
        setPreview('');
      } else {
        const errorText = await response.text();
        console.error('❌ Error:', errorText);
        await showErrorAlert("Error al enviar los emails. Por favor intenta nuevamente.");
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      closeLoadingAlert();
      await showErrorAlert("Error de conexión. Verifica tu internet e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Función para convertir archivo a base64
  const convertirABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="email-marketing-container">
      {/* Logo */}
      <div className="logo-container">
        <img 
          src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png" 
          alt="Logo" 
          className="logo"
        />
      </div>

      <h1 className="title">Email Marketing</h1>
      <p className="subtitle">Crea y envía emails a todos los contactos de tu base de datos</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="asunto" className="label">
            <i className="fas fa-tag icon-label"></i>
            Asunto del Email *
          </label>
          <div className="input-container">
            <i className="fas fa-heading input-icon"></i>
            <input 
              id="asunto"
              type="text" 
              name="asunto" 
              value={formData.asunto} 
              onChange={handleChange} 
              className="input" 
              placeholder="Ingresa el asunto del email"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mensaje" className="label">
            <i className="fas fa-envelope-open-text icon-label"></i>
            Mensaje del Email *
          </label>
          <div className="input-container">
            <i className="fas fa-edit input-icon"></i>
            <textarea 
              id="mensaje"
              name="mensaje" 
              value={formData.mensaje} 
              onChange={handleChange} 
              className="textarea" 
              placeholder="Escribe el contenido del email aquí..."
              rows="6"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="archivos" className="label">
            <i className="fas fa-paperclip icon-label"></i>
            Adjuntar Archivos
          </label>
          <div className="input-container">
            <i className="fas fa-file-upload input-icon"></i>
            <input 
              id="archivos"
              type="file" 
              name="archivos" 
              onChange={handleFileChange} 
              className="file-input" 
              multiple
              disabled={loading}
            />
          </div>
          {formData.archivos.length > 0 && (
            <div className="archivos-lista">
              <p>Archivos seleccionados:</p>
              <ul>
                {formData.archivos.map((archivo, index) => (
                  <li key={index}>
                    <i className="fas fa-file"></i> {archivo.name} 
                    <span className="tamano-archivo">
                      ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="button preview-button"
            onClick={generarPreview}
            disabled={loading || !formData.asunto}
          >
            <i className="fas fa-eye"></i>
            Vista Previa
          </button>
          
          <button 
            type="submit" 
            className={`button send-button ${loading ? 'button-disabled' : ''}`} 
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
            {loading ? " Enviando..." : " Enviar a Todos los Contactos"}
          </button>
        </div>
      </form>

      {preview && (
        <div className="preview-section">
          <h3 className="preview-title">
            <i className="fas fa-desktop"></i>
            Vista Previa del Email
          </h3>
          <div className="preview-container">
            <iframe 
              srcDoc={preview}
              title="Vista previa del email"
              className="preview-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
}