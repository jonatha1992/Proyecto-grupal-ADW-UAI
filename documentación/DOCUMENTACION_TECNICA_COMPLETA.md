# Documentación Técnica Completa - TurnosMed

## 📋 Descripción del Sistema

TurnosMed es un sistema de gestión de turnos médicos fullstack que implementa una arquitectura moderna de 3 capas con separación clara de responsabilidades. El sistema permite a los usuarios gestionar citas médicas de manera eficiente, con autenticación segura y asistencia de IA.

## 🎯 Casos de Uso del Sistema

### 1. **Registrarse**
- **Actor**: Usuario no registrado
- **Descripción**: El usuario puede crear una cuenta nueva proporcionando email, nombre, teléfono (opcional) y contraseña
- **Flujo**: 
  1. Usuario accede a la página de registro
  2. Completa formulario con validaciones en tiempo real
  3. Sistema valida datos y fortaleza de contraseña
  4. Se crea cuenta y se genera token JWT
  5. Usuario queda autenticado automáticamente

### 2. **Login**
- **Actor**: Usuario registrado
- **Descripción**: Autenticación segura para acceder al sistema
- **Flujo**:
  1. Usuario ingresa email y contraseña
  2. Sistema valida credenciales
  3. Se genera token JWT con expiración
  4. Token se almacena localmente
  5. Usuario accede a funcionalidades protegidas

### 3. **Chatear con el bot**
- **Actor**: Cualquier usuario (registrado o no)
- **Descripción**: Interactuar con asistente virtual para obtener información
- **Flujo**:
  1. Usuario accede a la página del chatbot
  2. Envía mensajes de texto
  3. Sistema intenta respuesta con IA (OpenAI)
  4. Si falla IA, usa sistema de fallback
  5. Bot responde con información contextual

### 4. **Sacar turno**
- **Actor**: Usuario autenticado
- **Descripción**: Reservar una cita médica seleccionando especialidad, fecha y hora
- **Flujo**:
  1. Usuario accede a "Crear Turno"
  2. Selecciona especialidad del catálogo
  3. Elige fecha (mínimo día siguiente)
  4. Selecciona horario disponible
  5. Sistema valida disponibilidad
  6. Se confirma la reserva

### 5. **Ver turnos**
- **Actor**: Usuario autenticado
- **Descripción**: Visualizar todos los turnos agendados con detalles completos
- **Flujo**:
  1. Usuario accede a "Mis Turnos"
  2. Sistema muestra lista de turnos ordenados por fecha
  3. Se visualiza estado, fecha, hora, especialidad y precio
  4. Se indica si el turno puede ser cancelado

### 6. **Cancelar turnos**
- **Actor**: Usuario autenticado
- **Descripción**: Cancelar turnos confirmados con hasta 24 horas de anticipación
- **Flujo**:
  1. Usuario selecciona turno a cancelar
  2. Sistema valida que falten más de 24 horas
  3. Usuario confirma cancelación
  4. Estado cambia a "cancelado"
  5. El horario queda disponible para otros usuarios

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
- **PostgreSQL**: Base de datos relacional robusta con driver `pg`
- **JWT (jsonwebtoken)**: Autenticación stateless
- **bcryptjs**: Hash seguro de contraseñas
- **express-validator**: Validación de datos de entrada
- **Helmet**: Middleware de seguridad HTTP
- **Morgan**: Logging de requests HTTP
- **CORS**: Configuración de políticas de origen cruzado

### **IA y Servicios Externos**
- **OpenAI GPT**: Integración con API de OpenAI para respuestas inteligentes
- **Fallback System**: Sistema de respuestas predefinidas cuando IA no está disponible

## 🏗️ Arquitectura del Sistema

### **Patrón Arquitectónico Principal**: Modelo de 3 Capas

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                         │
│                          (Frontend SPA)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   Páginas   │    │ Componentes │    │  Contextos  │             │
│  │             │    │             │    │             │             │
│  │ • Home      │    │ • Navbar    │    │ • Auth      │             │
│  │ • Login     │    │ • Protected │    │ • State     │             │
│  │ • Turnos    │    │ • Validator │    │ Management  │             │
│  │ • ChatBot   │    │ • Forms     │    │             │             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│                                                                     │
│                     React + TypeScript + Vite                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST API
                                    │ JSON + JWT
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE LÓGICA DE NEGOCIO                   │
│                          (Backend API REST)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   Rutas     │    │Controladores│    │Middlewares  │             │
│  │             │    │             │    │             │             │
│  │ • Auth      │    │ • Auth      │    │ • JWT       │             │
│  │ • Turnos    │    │ • Turnos    │    │ • Validation│             │
│  │ • Chat      │    │ • Chat      │    │ • Error     │             │
│  │ • Users     │    │ • Users     │    │ • Security  │             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│                                                                     │
│                   Node.js + Express + TypeScript                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL Queries
                                    │ Pool Connections
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CAPA DE DATOS                              │
│                        (PostgreSQL)                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   Tablas    │    │ Constraints │    │   Índices   │             │
│  │             │    │             │    │             │             │
│  │ • users     │    │ • FK        │    │ • Primary   │             │
│  │ • turnos    │    │ • Check     │    │ • Foreign   │             │
│  │ • servicios │    │ • Unique    │    │ • Search    │             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│                                                                     │
│                     Transacciones ACID + Backup                    │
└─────────────────────────────────────────────────────────────────────┘
```

### **Comunicación entre Capas**

1. **Frontend ↔ Backend**: 
   - Protocolo HTTP/HTTPS
   - Formato JSON para intercambio de datos
   - Autenticación con Bearer Token (JWT)
   - CORS configurado para desarrollo y producción

2. **Backend ↔ Base de Datos**:
   - Pool de conexiones PostgreSQL
   - Consultas SQL parametrizadas (prevención de SQL injection)
   - Transacciones para operaciones complejas
   - Manejo de errores y rollback automático

## 🗃️ Entidades de Negocio

### **1. Usuario (User)**

**Propósito**: Representa a los pacientes que utilizan el sistema para gestionar sus citas médicas.

**Atributos**:
- `id` (UUID): Identificador único universal
- `email` (VARCHAR): Correo electrónico único para login
- `name` (VARCHAR): Nombre completo del usuario
- `phone` (VARCHAR, opcional): Número de contacto
- `password_hash` (VARCHAR): Contraseña encriptada con bcrypt
- `created_at` (TIMESTAMP): Fecha de registro en el sistema
- `updated_at` (TIMESTAMP): Última modificación del perfil

**Reglas de Negocio**:
- Email debe ser único en el sistema
- Contraseña debe cumplir políticas de seguridad (8+ caracteres, mayúsculas, números)
- Teléfono es opcional pero recomendado para notificaciones

### **2. Turno (Appointment)**

**Propósito**: Representa una cita médica agendada por un usuario en una fecha y hora específica.

**Atributos**:
- `id` (UUID): Identificador único del turno
- `user_id` (UUID): Referencia al usuario que reservó
- `fecha` (DATE): Fecha de la cita médica
- `hora` (TIME): Hora específica del turno
- `servicio` (VARCHAR): Especialidad médica solicitada
- `precio` (DECIMAL): Costo del servicio
- `estado` (ENUM): Estado actual del turno
- `notas` (TEXT): Observaciones adicionales
- `created_at` (TIMESTAMP): Fecha de creación de la reserva
- `updated_at` (TIMESTAMP): Última modificación

**Estados Posibles**:
- `confirmado`: Turno activo y confirmado
- `cancelado`: Turno cancelado por el usuario
- `completado`: Cita ya realizada

**Reglas de Negocio**:
- Un horario específico no puede tener múltiples reservas activas
- Solo se pueden cancelar turnos con más de 24 horas de anticipación
- Las fechas deben ser futuras (no pasadas)
- Horarios restringidos a horario laboral (8:00-18:00)

### **3. Servicio (Medical Service)**

**Propósito**: Catálogo de especialidades médicas disponibles con sus características.

**Atributos**:
- `id` (UUID): Identificador único del servicio
- `nombre` (VARCHAR): Nombre de la especialidad (ej: "Cardiología")
- `descripcion` (TEXT): Descripción detallada del servicio
- `precio` (DECIMAL): Precio base del servicio
- `duracion` (INTEGER): Duración en minutos
- `activo` (BOOLEAN): Si está disponible para reservas
- `created_at` (TIMESTAMP): Fecha de creación del servicio
- `updated_at` (TIMESTAMP): Última modificación

**Reglas de Negocio**:
- Solo servicios activos aparecen en el frontend
- Precios deben ser positivos
- Duración mínima de 15 minutos

## 🔗 Relaciones Entre Entidades

### **Diagrama Entidad-Relación**

```
                    1                          N
┌─────────────────┐     tiene      ┌─────────────────┐
│     Usuario     │◄────────────────│     Turno       │
│                 │                 │                 │
│ • id (PK)       │                 │ • id (PK)       │
│ • email (UNIQUE)│                 │ • user_id (FK)  │
│ • name          │                 │ • fecha         │
│ • phone         │                 │ • hora          │
│ • password_hash │                 │ • servicio      │
│ • created_at    │                 │ • precio        │
│ • updated_at    │                 │ • estado        │
└─────────────────┘                 │ • notas         │
                                    │ • created_at    │
                                    │ • updated_at    │
                                    └─────────────────┘
                                              │
                                              │ N
                                              │
                                              │ 1
                                    ┌─────────────────┐
                                    │    Servicio     │
                                    │                 │
                                    │ • id (PK)       │
                                    │ • nombre        │
                                    │ • descripcion   │
                                    │ • precio        │
                                    │ • duracion      │
                                    │ • activo        │
                                    │ • created_at    │
                                    │ • updated_at    │
                                    └─────────────────┘
```

### **Cardinalidades**:

1. **Usuario → Turno**: 1:N (Un usuario puede tener múltiples turnos)
2. **Turno → Usuario**: N:1 (Cada turno pertenece a un usuario)
3. **Servicio → Turno**: 1:N (Un servicio puede estar en múltiples turnos)
4. **Turno → Servicio**: N:1 (Cada turno es de un servicio específico)

### **Integridad Referencial**:

- **CASCADE DELETE**: Si se elimina un usuario, se eliminan todos sus turnos
- **RESTRICT**: No se puede eliminar un servicio si tiene turnos asociados
- **FOREIGN KEYS**: Garantizan que las referencias sean válidas

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
    
    -- Constraints de dominio
    CONSTRAINT email_format CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT phone_format CHECK (
        phone IS NULL OR LENGTH(phone) >= 8
    )
);

-- Índices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Propósito de Índices**:
- `idx_users_email`: Optimiza login y verificación de email único
- `idx_users_created_at`: Optimiza reportes y ordenamiento por fecha

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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints de negocio
    CONSTRAINT precio_positivo CHECK (precio > 0),
    CONSTRAINT duracion_minima CHECK (duracion >= 15),
    CONSTRAINT nombre_unico UNIQUE (nombre)
);

-- Índices
CREATE INDEX idx_servicios_activo ON servicios(activo);
CREATE INDEX idx_servicios_precio ON servicios(precio);
CREATE INDEX idx_servicios_nombre ON servicios(nombre);
```

**Datos Iniciales**:
```sql
INSERT INTO servicios (nombre, descripcion, precio, duracion) VALUES
('Consulta General', 'Consulta médica general', 5000.00, 30),
('Cardiología', 'Consulta especializada en cardiología', 8000.00, 45),
('Dermatología', 'Consulta especializada en dermatología', 7500.00, 30),
('Pediatría', 'Consulta pediátrica', 6000.00, 30),
('Ginecología', 'Consulta ginecológica', 7000.00, 45);
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
    CONSTRAINT fk_turnos_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Constraints de dominio
    CONSTRAINT estado_valido CHECK (
        estado IN ('confirmado', 'cancelado', 'completado')
    ),
    CONSTRAINT fecha_futura CHECK (fecha >= CURRENT_DATE),
    CONSTRAINT horario_laboral CHECK (
        hora BETWEEN '08:00' AND '18:00'
    ),
    CONSTRAINT precio_positivo CHECK (precio > 0),
    
    -- Constraint de negocio único
    CONSTRAINT unique_fecha_hora UNIQUE (fecha, hora)
);

-- Índices para optimización de consultas
CREATE INDEX idx_turnos_user_id ON turnos(user_id);
CREATE INDEX idx_turnos_fecha ON turnos(fecha);
CREATE INDEX idx_turnos_estado ON turnos(estado);
CREATE INDEX idx_turnos_fecha_hora ON turnos(fecha, hora);
CREATE INDEX idx_turnos_user_fecha ON turnos(user_id, fecha);
```

**Propósito de Constraints**:
- `unique_fecha_hora`: Evita doble reserva del mismo horario
- `fecha_futura`: Previene reservas en fechas pasadas
- `horario_laboral`: Restringe a horarios de atención
- `estado_valido`: Garantiza estados consistentes

**Propósito de Índices**:
- `idx_turnos_user_id`: Optimiza consulta "Mis Turnos"
- `idx_turnos_fecha`: Optimiza búsquedas por fecha
- `idx_turnos_fecha_hora`: Optimiza verificación de disponibilidad
- `idx_turnos_user_fecha`: Optimiza turnos de usuario por fecha

## 🔐 Seguridad y Validaciones

### **Autenticación y Autorización**
- **JWT (JSON Web Tokens)**: Autenticación stateless
- **bcrypt**: Hash de contraseñas con salt
- **Middleware de autenticación**: Verificación en cada request protegido

### **Validaciones de Datos**
- **Frontend**: Validación en tiempo real con React
- **Backend**: Express Validator para validación robusta
- **Base de Datos**: Constraints para integridad de datos

### **Seguridad HTTP**
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **SQL Injection**: Consultas parametrizadas

## 🚀 Escalabilidad y Rendimiento

### **Base de Datos**
- **Índices optimizados** para consultas frecuentes
- **Pool de conexiones** para manejo eficiente
- **Transacciones** para operaciones atómicas

### **Backend**
- **Middleware en capas** para separación de responsabilidades
- **Manejo de errores centralizado**
- **Logging estructurado** para monitoring

### **Frontend**
- **Code splitting** con Vite
- **State management** eficiente con Context API
- **Caching** de datos de autenticación

Este documento técnico proporciona una visión completa del sistema TurnosMed, desde la arquitectura hasta los detalles de implementación, asegurando que toda la información esté actualizada y sea válida para el estado actual del proyecto.
