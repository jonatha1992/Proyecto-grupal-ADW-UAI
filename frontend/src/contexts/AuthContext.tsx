import React, { createContext, useContext, useEffect, useState } from 'react';

// Tipos
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  token: null
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('userData');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores de validación específicos
        if (data.error === 'VALIDATION_ERROR' && data.data && Array.isArray(data.data)) {
          const validationErrors = data.data.map((err: any) => err.msg).join('; ');
          throw new Error(`Errores de validación: ${validationErrors}`);
        }
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar datos en localStorage
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('userData', JSON.stringify(data.data.user));
      
      setUser(data.data.user);
      setToken(data.data.token);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          phone: phone || undefined 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores de validación específicos
        if (data.error === 'VALIDATION_ERROR' && data.data && Array.isArray(data.data)) {
          const validationErrors = data.data.map((err: any) => err.msg).join('; ');
          throw new Error(`Errores de validación: ${validationErrors}`);
        }
        throw new Error(data.message || "Error al registrarse");
      }

      // Guardar datos en localStorage
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('userData', JSON.stringify(data.data.user));
      
      setUser(data.data.user);
      setToken(data.data.token);
      
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
