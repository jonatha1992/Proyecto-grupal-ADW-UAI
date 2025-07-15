import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FormTurnoData, ServicioPrecios } from '../types';
import './CrearTurno.css';

const API_BASE = 'http://localhost:3001/api/v1';

const CrearTurno: React.FC = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState<FormTurnoData>({
    fecha: '',
    hora: '',
    servicio: ''
  });
  const [servicios] = useState<ServicioPrecios[]>([
    { id: '1', nombre: 'Consulta General', precio: 5000, duracion: '30 min', descripcion: 'Consulta médica general' },
    { id: '2', nombre: 'Cardiología', precio: 8000, duracion: '45 min', descripcion: 'Consulta especializada en cardiología' },
    { id: '3', nombre: 'Dermatología', precio: 7500, duracion: '30 min', descripcion: 'Consulta especializada en dermatología' },
    { id: '4', nombre: 'Pediatría', precio: 6000, duracion: '30 min', descripcion: 'Consulta pediátrica' },
    { id: '5', nombre: 'Ginecología', precio: 7000, duracion: '45 min', descripcion: 'Consulta ginecológica' }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const horariosDisponibles = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Mínimo mañana
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 60); // Máximo 2 meses
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setMessage({ type: 'error', text: 'Debes estar autenticado para crear un turno' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const servicioSeleccionado = servicios.find(s => s.id === formData.servicio);
      
      if (!servicioSeleccionado) {
        throw new Error('Debe seleccionar un servicio válido');
      }
      
      const turnoData = {
        fecha: formData.fecha,
        hora: formData.hora,
        servicio: servicioSeleccionado.nombre,
        precio: servicioSeleccionado.precio,
        notas: `Consulta de ${servicioSeleccionado.nombre} - ${servicioSeleccionado.descripcion}`
      };
      
      const response = await fetch(`${API_BASE}/turnos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(turnoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el turno');
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Turno reservado exitosamente!' });
        setFormData({ fecha: '', hora: '', servicio: '' });
      } else {
        throw new Error(data.message || 'Error al crear el turno');
      }
      
    } catch (error: any) {
      console.error('Error al crear turno:', error);
      setMessage({ type: 'error', text: error.message || 'Error al reservar el turno. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const servicioSeleccionado = servicios.find(s => s.id === formData.servicio);

  return (
    <div className="crear-turno-page">
      <div className="container">
        <div className="page-header">
          <h1>Reservar Nuevo Turno</h1>
          <p>Completa el formulario para reservar tu cita médica</p>
        </div>

        <div className="turno-form-container">
          <form onSubmit={handleSubmit} className="turno-form">
            <div className="form-group">
              <label htmlFor="servicio">Tipo de Consulta *</label>
              <select
                id="servicio"
                name="servicio"
                value={formData.servicio}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - ${servicio.precio.toLocaleString()} ({servicio.duracion})
                  </option>
                ))}
              </select>
            </div>

            {servicioSeleccionado && (
              <div className="servicio-info">
                <h3>{servicioSeleccionado.nombre}</h3>
                <p>{servicioSeleccionado.descripcion}</p>
                <div className="servicio-details">
                  <span className="precio">Precio: ${servicioSeleccionado.precio.toLocaleString()}</span>
                  <span className="duracion">Duración: {servicioSeleccionado.duracion}</span>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hora">Horario *</label>
                <select
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  disabled={!formData.fecha}
                >
                  <option value="">Selecciona un horario</option>
                  {horariosDisponibles.map(hora => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </form>

          <div className="info-panel">
            <h3>Información Importante</h3>
            <ul>
              <li>📅 Los turnos se pueden reservar con hasta 2 meses de anticipación</li>
              <li>⏰ Puedes cancelar o reprogramar hasta 24 horas antes</li>
              <li>📧 Recibirás una confirmación por email</li>
              <li>🔔 Te enviaremos recordatorios el día anterior</li>
              <li>💳 El pago se realiza en el consultorio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearTurno;
