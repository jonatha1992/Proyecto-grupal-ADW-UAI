"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});
const SYSTEM_CONTEXT = `
Eres un asistente virtual especializado para TurnosMed, una plataforma de gestión de turnos médicos.

INFORMACIÓN IMPORTANTE:
- Especialidades disponibles: Consulta General ($5,000), Cardiología ($8,000), Dermatología ($7,500), Pediatría ($6,000), Ginecología ($7,000)
- Horarios: Mañana 9:00-11:30, Tarde 14:00-17:00
- Política de cancelación: Hasta 24 horas antes sin costo
- Registro gratuito requerido para sacar turnos
- Ubicación: Centro de la ciudad

INSTRUCCIONES:
- Sé amable, profesional y empático
- Responde en español
- Proporciona información específica sobre servicios médicos
- Si el usuario pregunta sobre turnos, explica el proceso
- Si no está registrado, menciona los beneficios del registro
- Mantén respuestas concisas pero informativas
- Siempre ofrece ayuda adicional

TEMAS QUE PUEDES MANEJAR:
- Información sobre especialidades y precios
- Proceso de reserva de turnos
- Registro de usuarios
- Horarios de atención
- Política de cancelaciones
- Ubicación de la clínica
- Navegación en la plataforma
`;
exports.chatController = {
    sendMessage: async (req, res) => {
        try {
            const { message, isAuthenticated = false, userName = '' } = req.body;
            if (!message || message.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El mensaje no puede estar vacío'
                });
            }
            let contextualSystem = SYSTEM_CONTEXT;
            if (isAuthenticated && userName) {
                contextualSystem += `\n\nNOTA: El usuario está autenticado como ${userName}. Puedes personalizar las respuestas y mencionar funciones específicas para usuarios registrados.`;
            }
            else {
                contextualSystem += `\n\nNOTA: El usuario NO está autenticado. Menciona los beneficios del registro cuando sea relevante.`;
            }
            const messages = [
                {
                    role: 'system',
                    content: contextualSystem
                },
                {
                    role: 'user',
                    content: message
                }
            ];
            if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
                const fallbackResponse = getFallbackResponse(message, isAuthenticated, userName);
                return res.json({
                    success: true,
                    data: {
                        response: fallbackResponse,
                        isAI: false,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 300,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            });
            const aiResponse = completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. ¿Podrías intentar de nuevo?';
            return res.json({
                success: true,
                data: {
                    response: aiResponse,
                    isAI: true,
                    timestamp: new Date().toISOString(),
                    usage: completion.usage
                }
            });
        }
        catch (error) {
            console.error('❌ Error en chatbot:', error);
            const { message, isAuthenticated = false, userName = '' } = req.body;
            const fallbackResponse = getFallbackResponse(message, isAuthenticated, userName);
            return res.json({
                success: true,
                data: {
                    response: fallbackResponse,
                    isAI: false,
                    timestamp: new Date().toISOString(),
                    fallback: true,
                    error: error.message
                }
            });
        }
    },
    getChatHistory: async (req, res) => {
        try {
            return res.json({
                success: true,
                data: {
                    messages: [],
                    timestamp: new Date().toISOString()
                }
            });
        }
        catch (error) {
            console.error('Error obteniendo historial:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener historial de chat'
            });
        }
    }
};
function getFallbackResponse(message, isAuthenticated, userName) {
    const msg = message.toLowerCase().trim();
    if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas')) {
        return `¡Hola${isAuthenticated && userName ? ` ${userName}` : ''}! ¿Cómo puedo ayudarte con tus consultas médicas?`;
    }
    if (msg.includes('turno') || msg.includes('cita') || msg.includes('reserva')) {
        if (isAuthenticated) {
            return 'Para sacar un turno, puedes ir a la sección "Sacar Turno" en el menú. Allí podrás elegir el tipo de consulta, fecha y horario. ¿Te gustaría que te ayude con algo específico sobre los turnos?';
        }
        else {
            return 'Para sacar turnos necesitas registrarte en nuestra plataforma. Es gratis y muy fácil. Una vez registrado, podrás reservar turnos para consultas médicas. ¿Te gustaría saber cómo registrarte?';
        }
    }
    if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuanto')) {
        return 'Nuestros precios son: Consulta General $5,000, Cardiología $8,000, Dermatología $7,500, Pediatría $6,000, Ginecología $7,000. Puedes ver más detalles en la sección "Precios".';
    }
    if (msg.includes('especialidad') || msg.includes('doctor') || msg.includes('medico')) {
        return 'Ofrecemos: Consulta General ($5,000), Cardiología ($8,000), Dermatología ($7,500), Pediatría ($6,000), Ginecología ($7,000). ¿Te interesa alguna en particular?';
    }
    if (msg.includes('horario') || msg.includes('hora') || msg.includes('cuando')) {
        return 'Nuestros horarios son: Mañana 9:00-11:30, Tarde 14:00-17:00. Puedes reservar turnos en cualquiera de estos horarios según disponibilidad.';
    }
    return 'Puedo ayudarte con información sobre turnos, precios, especialidades, horarios y registro. ¿Qué necesitas saber específicamente?';
}
//# sourceMappingURL=chatController.js.map