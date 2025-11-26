import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      isAuthenticated: false,
      user: null,
      loading: true,
      
      // Actions
      setLoading: (loading) => set({ loading }),
      
      login: (token, userData) => {
        localStorage.setItem('admin_token', token);
        set({ 
          isAuthenticated: true, 
          user: userData,
          loading: false 
        });
      },
      
      logout: () => {
        localStorage.removeItem('admin_token');
        set({ 
          isAuthenticated: false, 
          user: null,
          loading: false 
        });
      },
      
      setUser: (userData) => set({ user: userData }),
      
      // Verificar autenticación
      verifyAuth: async () => {
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          set({ isAuthenticated: false, loading: false });
          return false;
        }

        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            set({ 
              isAuthenticated: true, 
              user: userData.data,
              loading: false 
            });
            return true;
          } else {
            localStorage.removeItem('admin_token');
            set({ 
              isAuthenticated: false, 
              user: null,
              loading: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Error verifying auth:', error);
          localStorage.removeItem('admin_token');
          set({ 
            isAuthenticated: false, 
            user: null,
            loading: false 
          });
          return false;
        }
      }
    }),
    {
      name: 'auth-storage', // nombre para el localStorage
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      })
    }
  )
);