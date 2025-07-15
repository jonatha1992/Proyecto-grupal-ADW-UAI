# TurnosMed Backend

Backend API para el sistema de gestión de turnos médicos. Desarrollado con Node.js, Express, TypeScript, PostgreSQL y autenticación JWT.

## 🚀 Tecnologías

- **Node.js** & **Express.js** - Servidor web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos principal
- **JWT** - Autenticación con JSON Web Tokens
- **bcryptjs** - Encriptación de contraseñas
- **Express Validator** - Validación de datos
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de requests
- **CORS** - Configuración de CORS

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuraciones (DB)
│   ├── controllers/      # Controladores de rutas
│   │   ├── authController.ts      # Autenticación
│   │   ├── userController.ts      # Usuarios
│   │   ├── turnoController.ts     # Turnos
│   │   └── servicioController.ts  # Servicios
│   ├── middlewares/      # Middlewares personalizados
│   │   ├── auth.ts              # Autenticación JWT
│   │   ├── validation.ts        # Validaciones
│   │   └── errorHandler.ts      # Manejo de errores
│   ├── models/          # Modelos de datos
│   │   ├── User.ts             # Modelo de usuarios
│   │   ├── Turno.ts           # Modelo de turnos
│   │   └── Servicio.ts        # Modelo de servicios
│   ├── routes/          # Definición de rutas
│   │   ├── authRoutes.ts       # Rutas de autenticación
│   │   ├── userRoutes.ts       # Rutas de usuarios
│   │   ├── turnoRoutes.ts      # Rutas de turnos
│   │   ├── servicioRoutes.ts   # Rutas de servicios
│   │   └── index.ts           # Router principal
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades
│   │   └── auth.ts            # Funciones JWT y bcrypt
│   └── index.ts         # Punto de entrada
├── database/
│   └── init.sql         # Script de inicialización DB
├── .env.example         # Variables de entorno de ejemplo
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración TypeScript
└── nodemon.json         # Configuración Nodemon
```

## ⚙️ Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=turnosmed
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Password Security
BCRYPT_ROUNDS=12
```

### 2. Base de Datos PostgreSQL

1. **Instalar PostgreSQL**
2. **Crear base de datos:**
   ```sql
   CREATE DATABASE turnosmed;
   ```
3. **Ejecutar script de inicialización:**
   ```bash
   psql -U postgres -d turnosmed -f database/init.sql
   ```

## 🏃‍♂️ Instalación y Ejecución

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El servidor estará disponible en http://localhost:3001
```

### Producción

```bash
# Construir proyecto
npm run build

# Ejecutar en producción
npm start
```

### Scripts Disponibles

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar versión construida
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir errores de ESLint automáticamente

## 📚 API Endpoints

### Autenticación
Todas las rutas protegidas requieren header:
```
Authorization: Bearer <jwt_token>
```

### Autenticación (Públicas)
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/profile` - Obtener perfil (protegida)
- `POST /api/v1/auth/refresh` - Renovar token (protegida)

### Usuarios (Protegidas)
- `PUT /api/v1/users/profile` - Actualizar perfil
- `DELETE /api/v1/users/account` - Eliminar cuenta

### Turnos (Protegidas)
- `POST /api/v1/turnos` - Crear turno
- `GET /api/v1/turnos` - Listar turnos del usuario
- `GET /api/v1/turnos/:id` - Obtener turno específico
- `PUT /api/v1/turnos/:id` - Actualizar turno
- `PATCH /api/v1/turnos/:id/cancel` - Cancelar turno
- `GET /api/v1/turnos/availability/slots?fecha=YYYY-MM-DD` - Horarios disponibles

### Servicios (Públicas)
- `GET /api/v1/servicios` - Listar servicios (con paginación)
- `GET /api/v1/servicios/active` - Servicios activos
- `GET /api/v1/servicios/:id` - Obtener servicio específico
- `GET /api/v1/servicios/price-range?min=X&max=Y` - Servicios por rango de precio

### Sistema
- `GET /api/v1/health` - Estado del API
- `GET /` - Información general del API

## 🔒 Seguridad

- **Helmet.js** - Headers de seguridad HTTP
- **CORS** - Configurado para frontend específico
- **JWT Authentication** - Tokens con expiración configurable
- **bcryptjs** - Hash de contraseñas con salt rounds
- **Input Validation** - Validación con express-validator
- **SQL Injection Protection** - Queries parametrizadas
- **Password Policy** - Validación de contraseñas seguras

## 🔐 Política de Contraseñas

Las contraseñas deben cumplir con:
- Mínimo 8 caracteres
- Al menos una letra minúscula
- Al menos una letra mayúscula
- Al menos un número
- Al menos un carácter especial

## 🗄️ Modelos de Datos

### Usuario
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}
```

### Turno
```typescript
interface Turno {
  id: string;
  user_id: string;
  fecha: Date;
  hora: string;
  servicio: string;
  precio: number;
  estado: 'confirmado' | 'cancelado' | 'completado' | 'reprogramado';
  notas?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Servicio
```typescript
interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion: number; // minutos
  descripcion?: string;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}
```

## 🔄 Flujo de Autenticación

1. **Registro**: `POST /api/v1/auth/register`
   - Se valida email único
   - Se verifica política de contraseñas
   - Se encripta contraseña con bcrypt
   - Se retorna usuario y JWT token

2. **Login**: `POST /api/v1/auth/login`
   - Se verifica email y contraseña
   - Se retorna usuario y JWT token

3. **Rutas Protegidas**:
   - Se envía token en header `Authorization: Bearer <token>`
   - Se verifica token y se extrae información del usuario
   - Se permite acceso a los recursos

## 🐛 Debugging

1. **Logs del servidor**: Activados por defecto con Morgan
2. **Database queries**: Logged en desarrollo
3. **Error handling**: Middleware centralizado de errores
4. **Health check**: `GET /api/v1/health`

## 🚀 Deployment

### Variables de Entorno para Producción
```env
NODE_ENV=production
PORT=3001
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://yourdomain.com
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔄 Cambios vs Firebase

### Eliminado:
- ❌ Firebase Admin SDK
- ❌ Autenticación con Firebase
- ❌ Dependencia de servicios externos

### Agregado:
- ✅ Autenticación JWT local
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Sistema de registro de usuarios
- ✅ Validación de contraseñas seguras
- ✅ Renovación de tokens
- ✅ Control total sobre autenticación

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "phone": "+1234567890",
    "password": "MiPassword123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "MiPassword123!"
  }'
```

### Crear Turno
```bash
curl -X POST http://localhost:3001/api/v1/turnos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fecha": "2024-12-01",
    "hora": "10:00",
    "servicio": "Consulta General",
    "precio": 50.00,
    "notas": "Primera consulta"
  }'
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 📞 Soporte

Para preguntas o problemas, crear un issue en el repositorio.
