
# 🏥 TurnosMed - Frontend

Sistema de gestión de turnos médicos desarrollado con React + TypeScript y autenticación local JWT.

## ✨ Características

- **🔐 Autenticación**: Sistema de login/registro con JWT
- **📅 Reserva de Turnos**: Sistema completo para sacar turnos médicos
- **👀 Gestión de Turnos**: Ver y cancelar turnos existentes
- **💰 Lista de Precios**: Información detallada de servicios y precios
- **🤖 Chatbot**: Asistente virtual con inteligencia artificial
- **📱 Responsive**: Diseño adaptativo para mobile y desktop
- **⚡ TypeScript**: Tipado estático para mejor desarrollo

## 🚀 Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Autenticación**: JWT con autenticación local
- **HTTP Client**: Fetch API nativo
- **Routing**: React Router DOM
- **Estilos**: CSS3 con variables CSS customizadas
- **Build Tool**: Vite

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_OPENAI_API_KEY=tu_openai_api_key_opcional
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📂 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Navbar.tsx       # Barra de navegación
│   └── ProtectedRoute.tsx # Rutas protegidas
├── contexts/            # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── pages/               # Páginas principales
│   ├── Home.tsx         # Página principal
│   ├── Login.tsx        # Página de login/registro
│   ├── CrearTurno.tsx   # Formulario para crear turnos
│   ├── MisTurnos.tsx    # Gestión de turnos del usuario
│   ├── ChatBot.tsx      # Asistente virtual con IA
│   └── Precios.tsx      # Lista de precios y servicios
├── types/               # Definiciones de TypeScript
│   └── index.ts         # Tipos principales
├── App.tsx              # Componente principal
└── main.tsx            # Punto de entrada
```

## 📋 Funcionalidades Principales

### 🏠 Página Principal
- Hero section con llamadas a la acción
- Características destacadas del sistema
- Navegación diferenciada para usuarios logueados/no logueados

### 🔑 Login/Registro
- Sistema de autenticación local con JWT
- Formularios de registro y login
- Validación de contraseñas en tiempo real
- Redirección automática después del login
- Interfaz moderna y amigable

### 🤖 Chatbot
- Asistente virtual con inteligencia artificial
- Respuestas contextuales sobre servicios
- Sistema de fallback cuando IA no está disponible
- Interfaz de chat intuitiva

### 📅 Crear Turno
- Selección de tipo de consulta
- Calendario para elegir fecha
- Horarios disponibles
- Información de precios en tiempo real
- Validaciones de formulario

### 👤 Mis Turnos
- Lista de todos los turnos del usuario
- Organización por estado (próximos, completados, cancelados)
- Funcionalidad de cancelación (con restricciones de tiempo)
- Información detallada de cada turno

### 💰 Precios
- Lista completa de servicios médicos
- Precios actualizados
- Información de duración
- Promociones especiales
- Acceso directo para reservar turnos

## 🔧 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Preview de la build de producción
- `npm run lint`: Ejecuta el linter de TypeScript

---

**TurnosMed** - Facilitando el acceso a la salud con tecnología moderna 🏥✨
