import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import EmailMarketing from './EmailMarketing.jsx';
import RegistroForm from './RegistroForm.jsx';
import Navbar from './Navbar.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Ruta por defecto redirige al formulario de registro */}
          <Route path="/" element={<Navigate to="/registro" replace />} />
          
          {/* Ruta del formulario de registro de leads */}
          <Route path="/registro" element={<RegistroForm />} />
          
          {/* Ruta del email marketing */}
          <Route path="/email-marketing" element={<EmailMarketing />} />
          
          {/* Ruta 404 - Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente para página 404
function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Página no encontrada</p>
        <a href="/registro" className="not-found-button">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}

export default App;