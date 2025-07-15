# Índice de Documentación - TurnosMed

Este directorio contiene toda la documentación técnica y de arquitectura del sistema de gestión de turnos médicos.

## 📋 Descripción del Sistema

**TurnosMed** es un sistema fullstack para gestión de turnos médicos con autenticación local, chatbot con IA, y arquitectura moderna de 3 capas.

### 🎯 Casos de Uso Implementados
1. **Registrarse** - Crear cuenta nueva con validaciones
2. **Login** - Autenticación segura con JWT
3. **Chatear con el bot** - Asistente virtual con IA y fallback
4. **Sacar turno** - Reservar citas médicas
5. **Ver turnos** - Visualizar turnos agendados
6. **Cancelar turnos** - Cancelar con políticas de tiempo

### 🛠 Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Vite + React Router
- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Autenticación**: JWT + bcrypt
- **IA**: OpenAI GPT con sistema de fallback
- **Base de Datos**: PostgreSQL con constraints y relaciones

## 📚 Documentación Técnica

### 🏗 Arquitectura y Setup

- **[Documentación Técnica Completa](DOCUMENTACION_TECNICA_COMPLETA.md)** - Documentación integral del sistema
- **[Manual de Deploy](../MANUAL_DEPLOY.md)** - Guía completa para desplegar en producción
- **[README Frontend](README_frontend.md)** - Configuración del cliente React
- **[README Backend](README_backend.md)** - API y configuración del servidor
- **[Arquitectura Frontend](FRONTEND_ARQUITECTURA.md)** - Análisis detallado de la arquitectura del frontend

### 🤖 Funcionalidades del Chatbot

- **[README Chatbot](CHATBOT_README.md)** - Documentación principal del asistente virtual
- **[Implementación IA](CHATBOT_IA_IMPLEMENTACION.md)** - Integración con OpenAI GPT y fallback inteligente

## 🗄️ Modelo de Datos

### Entidades Principales
1. **Usuario**: Gestión de cuentas y autenticación
2. **Turno**: Citas médicas con estados y validaciones
3. **Servicio**: Catálogo de especialidades médicas

### Relaciones
- Usuario (1) → Turnos (N)
- Servicio (1) → Turnos (N)

### Tablas de Base de Datos
- `users`: Usuarios del sistema
- `turnos`: Citas médicas agendadas
- `servicios`: Especialidades médicas disponibles

## 🚀 Flujo de Trabajo

### Para Desarrolladores
1. Leer la **Documentación Técnica Completa** para entender el sistema completo
2. Seguir **README Backend** o **README Frontend** según necesidad
3. Consultar **Arquitectura Frontend** para entender patrones de diseño
4. Revisar **Chatbot IA** para funcionalidades del asistente virtual
5. Usar **Manual de Deploy** para desplegar en producción

### Para Mantenimiento
1. Verificar **Chatbot IA** para updates del sistema de IA
2. Consultar documentación técnica para troubleshooting
3. Revisar implementaciones para validación continua
4. Seguir **Manual de Deploy** para actualizaciones en producción

## 📊 Estado del Proyecto

### ✅ Completado
- Migración completa de Firebase a autenticación local
- Sistema de turnos con validaciones robustas
- Chatbot con integración de IA real
- Documentación completa y actualizada
- Interfaz de usuario moderna y responsiva

### 🔍 Arquitectura Verificada
- Separación clara de responsabilidades (3 capas)
- API REST bien documentada
- Base de datos normalizada con constraints
- Autenticación stateless con JWT
- Validaciones en frontend y backend
