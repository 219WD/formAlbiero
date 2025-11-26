import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import EmailMarketing from './pages/EmailMarketing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import RegistroForm from './pages/RegistroForm.jsx';
import { useAuthStore } from './store/authStore';

function App() {
  const { 
    isAuthenticated, 
    user, 
    loading, 
    verifyAuth, 
    logout 
  } = useAuthStore();

  // Verificar autenticación al cargar la app
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Componente para rutas protegidas
  const ProtectedRoute = ({ children, requireAdmin = false }) => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Navbar solo se muestra cuando el usuario está autenticado Y NO está en registroForm */}
        {isAuthenticated && (
          <Navbar user={user} onLogout={logout} />
        )}
        
        <Routes>
          {/* Ruta por defecto: Redirige a email-marketing si está autenticado, sino a login */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/email-marketing" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Ruta de login - SIN navbar */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/email-marketing" replace /> : 
                <Login />
            } 
          />
          
          {/* Ruta de registro - SIN navbar */}
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
                <Navigate to="/email-marketing" replace /> : 
                <Register />
            } 
          />
          
          {/* RUTA REGISTRO FORM - PÚBLICA y SIN navbar */}
          <Route 
            path="/registroForm" 
            element={<RegistroForm />} 
          />
          
          {/* Ruta protegida - CON navbar */}
          <Route 
            path="/email-marketing" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <EmailMarketing />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente para página 404
function NotFound() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Página no encontrada</p>
        <a href={isAuthenticated ? "/email-marketing" : "/login"} className="not-found-button">
          {isAuthenticated ? "Volver al Dashboard" : "Volver al Login"}
        </a>
      </div>
    </div>
  );
}

export default App;