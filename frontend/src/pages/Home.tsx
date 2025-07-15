import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a TurnosMed</h1>
          <p className="hero-subtitle">
            Sistema profesional de gestión de turnos médicos
          </p>
          <p className="hero-description">
            Reserva tus citas médicas de forma fácil y rápida. 
            Gestiona tus turnos desde cualquier lugar y en cualquier momento.
          </p>
          
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/crear-turno" className="btn btn-primary">
                  Sacar Nuevo Turno
                </Link>
                <Link to="/mis-turnos" className="btn btn-secondary">
                  Ver Mis Turnos
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Iniciar Sesión
                </Link>
                <Link to="/precios" className="btn btn-secondary">
                  Ver Precios
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="hero-image">
          <div className="medical-icon">🏥</div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>¿Por qué elegir TurnosMed?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Fácil Programación</h3>
              <p>Reserva tus turnos en pocos clicks, selecciona fecha y hora que mejor te convenga.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Confirmación Instantánea</h3>
              <p>Recibe confirmación inmediata de tu turno y recordatorios automáticos.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Gestión Online</h3>
              <p>Administra todos tus turnos desde tu dispositivo, cancela o reagenda cuando necesites.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Seguro y Confiable</h3>
              <p>Tus datos están protegidos con autenticación segura y encriptación avanzada.</p>
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <section className="cta">
          <div className="container">
            <h2>¿Listo para comenzar?</h2>
            <p>Únete a miles de usuarios que ya gestionan sus turnos médicos con nosotros</p>
            <Link to="/login" className="btn btn-primary btn-large">
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
