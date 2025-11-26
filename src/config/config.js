const config = {
  development: {
    API_URL: import.meta.env.VITE_API_URL_DEV || 'http://localhost:5000/api',
    APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Albiero Admin',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL_PROD || 'https://albiero-backend.vercel.app/api',
    APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Albiero Admin',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
  }
};

// Determina el entorno automáticamente
const getConfig = () => {
  // Si estamos en el navegador, usa window.location
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    return isLocalhost ? config.development : config.production;
  }
  
  // Si estamos en el servidor (SSR), usa import.meta.env
  return import.meta.env.MODE === 'development' 
    ? config.development 
    : config.production;
};

export default getConfig();