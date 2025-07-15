import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ChatBot.css';

const API_BASE = 'http://localhost:3001/api/v1';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente virtual de TurnosMed. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Respuestas predefinidas del chatbot
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();

    // Saludos
    if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
      return `¡Hola${user ? ` ${user.name}` : ''}! ¿Cómo puedo ayudarte con tus consultas médicas?`;
    }

    // Preguntas sobre turnos
    if (message.includes('turno') || message.includes('cita') || message.includes('reserva')) {
      if (user) {
        return 'Para sacar un turno, puedes ir a la sección "Sacar Turno" en el menú. Allí podrás elegir el tipo de consulta, fecha y horario. ¿Te gustaría que te ayude con algo específico sobre los turnos?';
      } else {
        return 'Para sacar turnos necesitas registrarte en nuestra plataforma. Es gratis y muy fácil. Una vez registrado, podrás reservar turnos para consultas médicas. ¿Te gustaría saber cómo registrarte?';
      }
    }

    // Preguntas sobre precios
    if (message.includes('precio') || message.includes('costo') || message.includes('cuanto')) {
      return 'Puedes ver todos nuestros precios en la sección "Precios" del menú. Tenemos consultas desde $5,000 para consulta general hasta $8,000 para especialidades como cardiología.';
    }

    // Preguntas sobre especialidades
    if (message.includes('especialidad') || message.includes('doctor') || message.includes('medico')) {
      return 'Ofrecemos las siguientes especialidades:\n• Consulta General - $5,000\n• Cardiología - $8,000\n• Dermatología - $7,500\n• Pediatría - $6,000\n• Ginecología - $7,000\n\n¿Te interesa alguna en particular?';
    }

    // Preguntas sobre horarios
    if (message.includes('horario') || message.includes('hora') || message.includes('cuando')) {
      return 'Nuestros horarios de atención son:\n• Mañana: 9:00 - 11:30\n• Tarde: 14:00 - 17:00\n\nPuedes reservar turnos en cualquiera de estos horarios según disponibilidad.';
    }

    // Preguntas sobre cancelaciones
    if (message.includes('cancelar') || message.includes('cancelacion')) {
      return 'Puedes cancelar tu turno hasta 24 horas antes de la cita. Para cancelar, ve a "Mis Turnos" y selecciona "Cancelar Turno". No se cobra ningún costo por cancelaciones con más de 24hs de anticipación.';
    }

    // Preguntas sobre registro
    if (message.includes('registro') || message.includes('registrar') || message.includes('cuenta')) {
      return 'Para registrarte es muy fácil:\n1. Haz clic en "Iniciar Sesión" en el menú\n2. Selecciona "Crear cuenta"\n3. Completa tus datos (email, nombre, teléfono y contraseña)\n4. ¡Ya puedes sacar turnos!\n\nEl registro es gratuito y seguro.';
    }

    // Preguntas sobre ubicación
    if (message.includes('donde') || message.includes('direccion') || message.includes('ubicacion')) {
      return 'Nuestra clínica está ubicada en el centro de la ciudad. Una vez que reserves tu turno, recibirás todos los detalles de ubicación y cómo llegar.';
    }

    // Preguntas sobre ayuda
    if (message.includes('ayuda') || message.includes('help') || message.includes('problema')) {
      return 'Estoy aquí para ayudarte. Puedo responder preguntas sobre:\n• Sacar turnos\n• Precios y especialidades\n• Horarios de atención\n• Cancelaciones\n• Registro de cuenta\n\n¿Qué necesitas saber?';
    }

    // Despedidas
    if (message.includes('gracias') || message.includes('chau') || message.includes('adios')) {
      return '¡De nada! Fue un placer ayudarte. Si necesitas algo más, no dudes en escribirme. ¡Que tengas un excelente día!';
    }

    // Respuesta por defecto
    return 'Entiendo que necesitas ayuda, pero no estoy seguro de cómo responder a eso. Puedo ayudarte con:\n• Información sobre turnos\n• Precios y especialidades\n• Horarios\n• Registro de cuenta\n\n¿Podrías ser más específico sobre lo que necesitas?';
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Intentar usar el endpoint de IA del backend
      const response = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify({
          message: currentInput,
          isAuthenticated: !!user,
          userName: user?.name || ''
        })
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();

      if (data.success) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.data.response,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(data.message || 'Error al procesar mensaje');
      }

    } catch (error) {
      console.error('Error al comunicarse con el bot:', error);
      
      // Fallback a respuestas locales si falla la IA
      const fallbackResponse = getBotResponse(currentInput);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedQuestions = [
    "¿Cómo saco un turno?",
    "¿Cuáles son los precios?",
    "¿Qué especialidades tienen?",
    "¿Cuáles son los horarios?",
    "¿Cómo me registro?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="chatbot-page">
      <div className="container">
        <div className="chatbot-header">
          <h1>🤖 Asistente Virtual TurnosMed</h1>
          <p>
            {user 
              ? `¡Hola ${user.name}! Pregúntame lo que necesites sobre nuestros servicios médicos.`
              : 'Hola! Soy tu asistente virtual. Puedo ayudarte con información sobre turnos, precios y servicios.'
            }
          </p>
        </div>

        <div className="chat-container">
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.isUser ? (
                    <span className="user-avatar">👤</span>
                  ) : (
                    <span className="bot-avatar">🤖</span>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.text.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < message.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <span className="bot-avatar">🤖</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {!user && (
            <div className="guest-notice">
              💡 <strong>Tip:</strong> Si te registras, podré darte información más personalizada y podrás sacar turnos directamente.
            </div>
          )}

          <div className="suggested-questions">
            <p>Preguntas frecuentes:</p>
            <div className="suggestions-grid">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="suggestion-btn"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta aquí..."
                rows={2}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="send-btn"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
