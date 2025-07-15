import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Turno } from '../types';
import './MisTurnos.css';

const API_BASE = 'http://localhost:3001/api/v1';

const MisTurnos: React.FC = () => {
  const { user, token } = useAuth();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Cargar turnos
  useEffect(() => {
    const loadTurnos = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/turnos`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar turnos');
        }

        const data = await response.json();
        
        if (data.success) {
          setTurnos(data.data || []);
        } else {
          throw new Error(data.message || 'Error al cargar turnos');
        }
      } catch (error) {
        console.error('Error al cargar turnos:', error);
        setMessage({ type: 'error', text: 'Error al cargar tus turnos' });
      } finally {
        setLoading(false);
      }
    };

    loadTurnos();
  }, [user, token]);

  const handleCancelTurno = async (turnoId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      return;
    }

    if (!token) {
      setMessage({ type: 'error', text: 'No estás autenticado' });
      return;
    }

    setCancelingId(turnoId);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/turnos/${turnoId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cancelar el turno');
      }

      const data = await response.json();
      
      if (data.success) {
        // Actualizar estado local
        setTurnos(prev => 
          prev.map(turno => 
            turno.id === turnoId 
              ? { ...turno, estado: 'cancelado' as const }
              : turno
          )
        );
        
        setMessage({ type: 'success', text: 'Turno cancelado exitosamente' });
      } else {
        throw new Error(data.message || 'Error al cancelar el turno');
      }
    } catch (error: any) {
      console.error('Error al cancelar turno:', error);
      setMessage({ type: 'error', text: error.message || 'Error al cancelar el turno' });
    } finally {
      setCancelingId(null);
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida recibida:', fecha);
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (hora: string) => {
    return hora.substring(0, 5);
  };

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'confirmado': return 'estado-confirmado';
      case 'cancelado': return 'estado-cancelado';
      case 'completado': return 'estado-completado';
      default: return '';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      case 'completado': return 'Completado';
      default: return estado;
    }
  };

  const puedeSerCancelado = (turno: Turno) => {
    const fechaISO = turno.fecha;
    const [hora, minutos] = turno.hora.split(':');
    
    const fechaTurno = new Date(fechaISO);
    fechaTurno.setHours(parseInt(hora), parseInt(minutos), 0, 0);
    
    const ahora = new Date();
    const horasHastaElTurno = (fechaTurno.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    
    return turno.estado === 'confirmado' && horasHastaElTurno > 24;
  };

  const turnosProximos = turnos.filter(t => t.estado === 'confirmado');
  const turnosCompletados = turnos.filter(t => t.estado === 'completado');
  const turnosCancelados = turnos.filter(t => t.estado === 'cancelado');

  if (loading) {
    return (
      <div className="mis-turnos-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando tus turnos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-turnos-page">
      <div className="container">
        <div className="page-header">
          <h1>Mis Turnos</h1>
          <p>Gestiona y visualiza todos tus turnos médicos</p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {turnos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h2>No tienes turnos reservados</h2>
            <p>¡Reserva tu primer turno médico!</p>
            <a href="/crear-turno" className="btn btn-primary">
              Reservar Turno
            </a>
          </div>
        ) : (
          <div className="turnos-sections">
            {turnosProximos.length > 0 && (
              <section className="turnos-section">
                <h2>Próximos Turnos ({turnosProximos.length})</h2>
                <div className="turnos-grid">
                  {turnosProximos.map(turno => (
                    <div key={turno.id} className="turno-card">
                      <div className="turno-header">
                        <h3>{turno.servicio}</h3>
                        <span className={`estado ${getEstadoClass(turno.estado)}`}>
                          {getEstadoText(turno.estado)}
                        </span>
                      </div>
                      
                      <div className="turno-details">
                        <div className="detail-item">
                          <span className="icon">📅</span>
                          <span>{formatFecha(turno.fecha)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="icon">⏰</span>
                          <span>{formatHora(turno.hora)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="icon">💰</span>
                          <span>${turno.precio.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="turno-actions">
                        {puedeSerCancelado(turno) && (
                          <button
                            onClick={() => handleCancelTurno(turno.id)}
                            disabled={cancelingId === turno.id}
                            className="btn btn-cancel"
                          >
                            {cancelingId === turno.id ? 'Cancelando...' : 'Cancelar Turno'}
                          </button>
                        )}
                        {!puedeSerCancelado(turno) && turno.estado === 'confirmado' && (
                          <span className="cancel-info">
                            No se puede cancelar (menos de 24hs)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {turnosCompletados.length > 0 && (
              <section className="turnos-section">
                <h2>Turnos Completados ({turnosCompletados.length})</h2>
                <div className="turnos-grid">
                  {turnosCompletados.map(turno => (
                    <div key={turno.id} className="turno-card completed">
                      <div className="turno-header">
                        <h3>{turno.servicio}</h3>
                        <span className={`estado ${getEstadoClass(turno.estado)}`}>
                          {getEstadoText(turno.estado)}
                        </span>
                      </div>
                      
                      <div className="turno-details">
                        <div className="detail-item">
                          <span className="icon">📅</span>
                          <span>{formatFecha(turno.fecha)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="icon">⏰</span>
                          <span>{formatHora(turno.hora)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="icon">💰</span>
                          <span>${turno.precio.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {turnosCancelados.length > 0 && (
              <section className="turnos-section">
                <h2>Turnos Cancelados ({turnosCancelados.length})</h2>
                <div className="turnos-grid">
                  {turnosCancelados.map(turno => (
                    <div key={turno.id} className="turno-card cancelled">
                      <div className="turno-header">
                        <h3>{turno.servicio}</h3>
                        <span className={`estado ${getEstadoClass(turno.estado)}`}>
                          {getEstadoText(turno.estado)}
                        </span>
                      </div>
                      
                      <div className="turno-details">
                        <div className="detail-item">
                          <span className="icon">📅</span>
                          <span>{formatFecha(turno.fecha)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="icon">⏰</span>
                          <span>{formatHora(turno.hora)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="icon">💰</span>
                          <span>${turno.precio.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTurnos;
