import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏥 TurnosMed
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Inicio</Link>
          <Link to="/precios" className="navbar-link">Precios</Link>
          <Link to="/chatbot" className="navbar-link">💬 Asistente</Link>
          
          {user ? (
            <>
              <Link to="/crear-turno" className="navbar-link">Sacar Turno</Link>
              <Link to="/mis-turnos" className="navbar-link">Mis Turnos</Link>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar-link login-btn">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
