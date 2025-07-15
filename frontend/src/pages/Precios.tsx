import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ServicioPrecios } from '../types';
import './Precios.css';

const Precios: React.FC = () => {
  const { user } = useAuth();

  const servicios: ServicioPrecios[] = [
    {
      id: '1',
      nombre: 'Consulta General',
      precio: 5000,
      duracion: '30 minutos',
      descripcion: 'Consulta médica general para diagnóstico y seguimiento de salud'
    },
    {
      id: '2',
      nombre: 'Cardiología',
      precio: 8000,
      duracion: '45 minutos',
      descripcion: 'Consulta especializada en enfermedades del corazón y sistema cardiovascular'
    },
    {
      id: '3',
      nombre: 'Dermatología',
      precio: 7500,
      duracion: '30 minutos',
      descripcion: 'Consulta especializada en enfermedades de la piel, cabello y uñas'
    },
    {
      id: '4',
      nombre: 'Pediatría',
      precio: 6000,
      duracion: '30 minutos',
      descripcion: 'Consulta médica especializada para niños y adolescentes'
    },
    {
      id: '5',
      nombre: 'Ginecología',
      precio: 7000,
      duracion: '45 minutos',
      descripcion: 'Consulta especializada en salud reproductiva femenina'
    },
    {
      id: '6',
      nombre: 'Traumatología',
      precio: 8500,
      duracion: '45 minutos',
      descripcion: 'Consulta especializada en lesiones del sistema musculoesquelético'
    }
  ];

  return (
    <div className="precios-page">
      <div className="container">
        <div className="page-header">
          <h1>Precios y Servicios</h1>
          <p>Conoce nuestros servicios médicos y sus precios</p>
        </div>

        <div className="precios-grid">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="precio-card">
              <div className="precio-header">
                <h3>{servicio.nombre}</h3>
                <div className="precio">
                  <span className="moneda">$</span>
                  <span className="monto">{servicio.precio.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="precio-details">
                <div className="detalle">
                  <span className="icon">⏱️</span>
                  <span>Duración: {servicio.duracion}</span>
                </div>
                <p className="descripcion">{servicio.descripcion}</p>
              </div>

              {user && (
                <div className="precio-actions">
                  <Link 
                    to="/crear-turno" 
                    className="btn btn-primary"
                  >
                    Reservar Turno
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="info-adicional">
          <div className="info-section">
            <h2>Información Importante</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">💳</div>
                <h3>Formas de Pago</h3>
                <p>Aceptamos efectivo, tarjetas de débito y crédito. El pago se realiza en el consultorio.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">🏥</div>
                <h3>Cobertura de Obra Social</h3>
                <p>Consultá disponibilidad de tu obra social. Algunos servicios pueden tener cobertura parcial.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">📋</div>
                <h3>Documentación</h3>
                <p>Recordá traer tu DNI, carnet de obra social (si corresponde) y estudios previos.</p>
              </div>
              
              <div className="info-item">
                <div className="info-icon">⏰</div>
                <h3>Puntualidad</h3>
                <p>Te pedimos llegar 10 minutos antes de tu turno para completar la documentación.</p>
              </div>
            </div>
          </div>

          <div className="promociones-section">
            <h2>Promociones Especiales</h2>
            <div className="promociones">
              <div className="promocion">
                <h3>🎯 Primera Consulta</h3>
                <p>20% de descuento en tu primera consulta general</p>
              </div>
              <div className="promocion">
                <h3>👨‍👩‍👧‍👦 Plan Familiar</h3>
                <p>15% de descuento para familias de 4 o más integrantes</p>
              </div>
              <div className="promocion">
                <h3>🎓 Estudiantes</h3>
                <p>10% de descuento presentando credencial estudiantil vigente</p>
              </div>
            </div>
          </div>
        </div>

        {!user && (
          <div className="cta-section">
            <h2>¿Listo para reservar tu turno?</h2>
            <p>Inicia sesión para acceder a nuestro sistema de reservas</p>
            <Link to="/login" className="btn btn-primary btn-large">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Precios;
