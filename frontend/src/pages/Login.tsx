import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordValidator from '../components/PasswordValidator';
import './Login.css';

const Login: React.FC = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      if (isRegistering) {
        await register(formData.email, formData.password, formData.name, formData.phone);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err: any) {
      // Parsear errores de validación
      const errorMessage = err.message || 'Error en la autenticación';
      if (errorMessage.includes('Errores de validación:')) {
        const validationErrors = errorMessage
          .replace('Errores de validación: ', '')
          .split('; ')
          .filter((msg: string) => msg.trim());
        setErrors(validationErrors);
      } else {
        setErrors([errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h1>
            <p>
              {isRegistering 
                ? 'Crea tu cuenta para gestionar tus turnos médicos'
                : 'Accede a tu cuenta para gestionar tus turnos médicos'
              }
            </p>
          </div>
          
          <div className="login-content">
            <div className="welcome-message">
              <div className="medical-icon-login">🏥</div>
              <h2>Bienvenido a TurnosMed</h2>
              <p>
                {isRegistering 
                  ? 'Completa el formulario para crear tu cuenta.'
                  : 'Inicia sesión para acceder a todas las funcionalidades.'
                }
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              {isRegistering && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Nombre completo</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ingresa tu teléfono"
                    />
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa tu email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              {errors.length > 0 && (
                <div className="error-message">
                  {errors.length === 1 ? (
                    <div>{errors[0]}</div>
                  ) : (
                    <div>
                      <div className="error-title">Se encontraron los siguientes errores:</div>
                      <ul className="error-list">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {isRegistering && (
                <PasswordValidator 
                  password={formData.password} 
                  showRequirements={true} 
                />
              )}

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span>⏳ {isRegistering ? 'Creando cuenta...' : 'Iniciando sesión...'}</span>
                ) : (
                  <span>{isRegistering ? '✅ Crear cuenta' : '🔑 Iniciar sesión'}</span>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setErrors([]);
                    setFormData({ email: '', password: '', name: '', phone: '' });
                  }}
                  className="switch-auth-btn"
                >
                  {isRegistering ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
