# TurnosMed - Sistema de Gestión de Turnos Médicos

Sistema fullstack moderno para la gestión de turnos médicos con autenticación local, chatbot con inteligencia artificial y arquitectura escalable.

## � Descripción del Sistema

TurnosMed es una plataforma web completa que permite a los usuarios gestionar turnos médicos de manera eficiente. El sistema cuenta con autenticación segura, gestión completa de turnos, múltiples especialidades médicas y un chatbot inteligente para asistencia al usuario.

### 🎯 Casos de Uso Principales

1. **Registrarse**: Los usuarios pueden crear una cuenta nueva con email, nombre, teléfono y contraseña
2. **Login**: Autenticación segura con JWT para usuarios existentes
3. **Chatear con el bot**: Asistente virtual con IA para consultas sobre servicios, precios y navegación
4. **Sacar turno**: Reservar turnos seleccionando especialidad, fecha y horario disponible
5. **Ver turnos**: Visualizar todos los turnos agendados con detalles completos
6. **Cancelar turnos**: Cancelar turnos con hasta 24 horas de anticipación

## 🏗️ Arquitectura del Sistema

### **Patrón Arquitectónico**: Cliente-Servidor (Modelo de 3 capas)

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    SQL    ┌─────────────────┐
│   FRONTEND      │◄───────────────►│    BACKEND      │◄─────────►│   DATABASE      │
│   (Cliente)     │                 │   (Servidor)    │           │  (PostgreSQL)   │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
│ React + TypeScript                │ Node.js + Express           │ Tablas relacionales
│ SPA (Single Page App)             │ API REST                    │ Constraints
│ State Management                  │ JWT Authentication          │ Índices
│ React Router                      │ Validaciones                │ ACID
│ Axios HTTP Client                 │ Middleware Stack            │ Backups
└─────────────────                  └─────────────────            └─────────────────
```

### **Frontend - Arquitectura en Capas**

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                    │
├─────────────────────────────────────────────────────────────┤
│ Páginas (Pages)                                            │
│ • Home.tsx - Página principal                             │
│ • Login.tsx - Autenticación                               │
│ • CrearTurno.tsx - Formulario de turnos                   │
│ • MisTurnos.tsx - Lista de turnos del usuario             │
│ • ChatBot.tsx - Interfaz del chatbot                      │
│ • Precios.tsx - Lista de precios y servicios              │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE COMPONENTES                     │
├─────────────────────────────────────────────────────────────┤
│ Componentes Reutilizables                                  │
│ • Navbar.tsx - Barra de navegación                        │
│ • ProtectedRoute.tsx - Rutas protegidas                   │
│ • PasswordValidator.tsx - Validador de contraseñas        │
├─────────────────────────────────────────────────────────────┤
│                   CAPA DE ESTADO GLOBAL                    │
├─────────────────────────────────────────────────────────────┤
│ Contextos (Context API)                                    │
│ • AuthContext.tsx - Estado de autenticación               │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE SERVICIOS                       │
├─────────────────────────────────────────────────────────────┤
│ • Fetch API - Cliente HTTP nativo para API calls          │
│ • LocalStorage - Persistencia del token JWT               │
│ • Validaciones del lado del cliente                       │
└─────────────────────────────────────────────────────────────┘
```

### **Backend - Arquitectura en Capas**

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
├─────────────────────────────────────────────────────────────┤
│ Rutas (Routes)                                             │
│ • authRoutes.ts - /api/v1/auth/*                          │
│ • turnoRoutes.ts - /api/v1/turnos/*                       │
│ • chatRoutes.ts - /api/v1/chat/*                          │
│ • servicioRoutes.ts - /api/v1/servicios/*                 │
│ • userRoutes.ts - /api/v1/users/*                         │
├─────────────────────────────────────────────────────────────┤
│                   CAPA DE MIDDLEWARES                       │
├─────────────────────────────────────────────────────────────┤
│ • auth.ts - Verificación de JWT                           │
│ • validation.ts - Express Validator                       │
│ • errorHandler.ts - Manejo centralizado de errores        │
│ • helmet, cors, morgan - Seguridad y logging              │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE LÓGICA DE NEGOCIO               │
├─────────────────────────────────────────────────────────────┤
│ Controladores (Controllers)                               │
│ • authController.ts - Registro, login                     │
│ • turnoController.ts - CRUD de turnos                     │
│ • chatController.ts - IA + Fallback                       │
│ • servicioController.ts - Gestión del catálogo            │
│ • userController.ts - Gestión de usuarios                 │
├─────────────────────────────────────────────────────────────┤
│                   CAPA DE ACCESO A DATOS                   │
├─────────────────────────────────────────────────────────────┤
│ Modelos (Models)                                           │
│ • User.ts - Operaciones de usuarios                       │
│ • Turno.ts - Operaciones de turnos                        │
│ • Servicio.ts - Operaciones de servicios                  │
├─────────────────────────────────────────────────────────────┤
│                      CAPA DE DATOS                         │
├─────────────────────────────────────────────────────────────┤
│ • PostgreSQL Database                                      │
│ • Pool de conexiones                                       │
│ • Transacciones ACID                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🛠 Stack Tecnológico Detallado

### **Frontend**
- **React 18**: Biblioteca de UI con componentes funcionales y hooks
- **TypeScript**: Tipado estático para mayor robustez del código
- **Vite**: Build tool moderno y rápido para desarrollo
- **React Router DOM**: Navegación SPA con rutas cliente
- **Fetch API**: Cliente HTTP nativo para comunicación con la API
- **CSS3**: Estilos modernos con variables CSS y flexbox/grid

### **Backend**
- **Node.js**: Runtime de JavaScript para el servidor
- **Express.js**: Framework web minimalista y flexible
- **TypeScript**: Tipado estático en el backend
- **PostgreSQL**: Base de datos relacional robusta
- **JWT (jsonwebtoken)**: Autenticación stateless
- **bcryptjs**: Hash seguro de contraseñas
- **express-validator**: Validación de datos de entrada
- **Helmet**: Middleware de seguridad HTTP
- **Morgan**: Logging de requests HTTP
- **CORS**: Configuración de políticas de origen cruzado

### **IA y Servicios Externos**
- **OpenAI GPT**: Integración con API de OpenAI para respuestas inteligentes
- **Fallback System**: Sistema de respuestas predefinidas cuando IA no está disponible

## �️ Entidades de Negocio y Relaciones

### **1. Usuario (User)**
Representa a los usuarios del sistema que pueden ser pacientes.

**Atributos:**
- `id`: Identificador único (UUID)
- `email`: Correo electrónico único
- `name`: Nombre completo
- `phone`: Número de teléfono (opcional)
- `password_hash`: Contraseña hasheada con bcrypt
- `created_at`: Fecha de registro
- `updated_at`: Fecha de última actualización

### **2. Turno**
Representa una cita médica agendada por un usuario.

**Atributos:**
- `id`: Identificador único (UUID)
- `user_id`: Referencia al usuario (FK)
- `fecha`: Fecha del turno
- `hora`: Hora del turno
- `servicio`: Tipo de consulta/especialidad
- `precio`: Costo del servicio
- `estado`: Estado del turno (confirmado, cancelado, completado)
- `notas`: Observaciones adicionales
- `created_at`: Fecha de creación del turno
- `updated_at`: Fecha de última actualización

### **3. Servicio**
Catálogo de especialidades médicas disponibles.

**Atributos:**
- `id`: Identificador único (UUID)
- `nombre`: Nombre de la especialidad
- `descripcion`: Descripción del servicio
- `precio`: Precio base del servicio
- `duracion`: Duración estimada en minutos
- `activo`: Estado de disponibilidad
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

### **Relaciones Entre Entidades**

```
┌─────────────┐     1:N     ┌─────────────┐
│   Usuario   │◄────────────│    Turno    │
│             │             │             │
│ • id (PK)   │             │ • user_id(FK)│
│ • email     │             │ • fecha     │
│ • name      │             │ • hora      │
│ • phone     │             │ • servicio  │
│ • password  │             │ • precio    │
└─────────────┘             └─────────────┘
                                    │
                                    │ N:1
                                    ▼
                            ┌─────────────┐
                            │  Servicio   │
                            │             │
                            │ • id (PK)   │
                            │ • nombre    │
                            │ • precio    │
                            │ • duracion  │
                            └─────────────┘
```

**Cardinalidades:**
- Un **Usuario** puede tener **muchos Turnos** (1:N)
- Un **Turno** pertenece a **un Usuario** (N:1)
- Un **Servicio** puede estar en **muchos Turnos** (1:N)
- Un **Turno** tiene **un Servicio** (N:1)

## 🗄️ Estructura de Base de Datos

### **Tabla: users**
```sql
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### **Tabla: servicios**
```sql
CREATE TABLE servicios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion INTEGER NOT NULL, -- en minutos
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_servicios_activo ON servicios(activo);
CREATE INDEX idx_servicios_precio ON servicios(precio);
```

### **Tabla: turnos**
```sql
CREATE TABLE turnos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    servicio VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmado',
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Claves foráneas
    CONSTRAINT fk_turnos_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT estado_valido CHECK (estado IN ('confirmado', 'cancelado', 'completado')),
    CONSTRAINT fecha_futura CHECK (fecha >= CURRENT_DATE),
    CONSTRAINT horario_valido CHECK (hora BETWEEN '08:00' AND '18:00'),
    
    -- Constraint único para evitar doble reserva
    CONSTRAINT unique_fecha_hora UNIQUE (fecha, hora)
);

-- Índices
CREATE INDEX idx_turnos_user_id ON turnos(user_id);
CREATE INDEX idx_turnos_fecha ON turnos(fecha);
CREATE INDEX idx_turnos_estado ON turnos(estado);
CREATE INDEX idx_turnos_fecha_hora ON turnos(fecha, hora);
```

### **Relaciones y Constraints**

1. **Integridad Referencial**: 
   - `turnos.user_id` → `users.id` (CASCADE DELETE)

2. **Constraints de Dominio**:
   - Email válido en usuarios
   - Estados válidos en turnos (confirmado, cancelado, completado)
   - Fechas futuras para turnos
   - Horarios laborales (8:00-18:00)

3. **Constraints de Negocio**:
   - Un horario no puede ser reservado dos veces
   - Los precios deben ser positivos
   - Los usuarios deben tener email único

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Proyecto_Final_arquitectura
   ```

2. **Configurar Base de Datos**
   ```bash
   # Crear base de datos PostgreSQL
   createdb turnosmed
   
   # Ejecutar script de inicialización
   psql -d turnosmed -f backend/database/init.sql
   ```

3. **Backend (Node.js + Express + TypeScript)**
   ```bash
   cd backend
   cp .env.example .env
   # Configurar variables de entorno en .env
   npm install
   npm run dev
   ```

4. **Frontend (React + TypeScript + Vite)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📚 Documentación Técnica

Toda la documentación técnica detallada se encuentra en la carpeta **[documentación/](./documentación/)**:

- **[Manual de Deploy](./MANUAL_DEPLOY.md)** - Guía paso a paso para desplegar en producción
- **[Índice de Documentación](./documentación/INDICE_DOCUMENTACION.md)** - Punto de entrada
- **[Arquitectura Frontend](./documentación/FRONTEND_ARQUITECTURA.md)** - Análisis detallado del frontend
- **[Backend API](./documentación/README_backend.md)** - Documentación completa del backend
- **[Chatbot IA](./documentación/CHATBOT_IA_IMPLEMENTACION.md)** - Implementación del chatbot

## 📄 Licencia

Este proyecto es parte de un trabajo académico para el curso de Desarrollo y Arquitecturas Web.
