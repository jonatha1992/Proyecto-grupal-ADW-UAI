# 🏗️ ARQUITECTURA DEL FRONTEND - TurnosMed

## 📋 **TECNOLOGÍAS PRINCIPALES**

### **🔧 Stack Tecnológico:**
- **⚛️ React 18** con TypeScript
- **🚀 Vite** como bundler y dev server
- **🛣️ React Router DOM** para navegación
- **🎨 CSS Modules** y CSS personalizado
- **🔐 Context API** para manejo de estado global

---

## 📁 **ESTRUCTURA DE CARPETAS**

```
frontend/src/
├── 📄 main.tsx                 # Punto de entrada de la aplicación
├── 📄 App.tsx                  # Componente principal y configuración de rutas
├── 📄 App.css                  # Estilos globales de la aplicación
├── 📄 index.css                # Estilos base y reset CSS
├── 📄 vite-env.d.ts            # Definiciones de tipos para Vite
│
├── 📁 pages/                   # Páginas principales de la aplicación
│   ├── 📄 index.ts             # Barrel export de todas las páginas
│   ├── 🏠 Home.tsx/css         # Página de inicio
│   ├── 🔐 Login.tsx/css        # Página de autenticación
│   ├── 📅 CrearTurno.tsx/css   # Formulario para crear turnos
│   ├── 📋 MisTurnos.tsx/css    # Lista de turnos del usuario
│   ├── 💰 Precios.tsx/css      # Información de precios
│   └── 🤖 ChatBot.tsx/css      # Asistente virtual con IA
│
├── 📁 components/              # Componentes reutilizables
│   ├── 📄 index.ts             # Barrel export de componentes
│   ├── 🧭 Navbar.tsx/css       # Barra de navegación
│   ├── 🔒 ProtectedRoute.tsx   # Componente para rutas protegidas
│   └── ✅ PasswordValidator.tsx # Validador de contraseñas
│
├── 📁 contexts/                # Context API para estado global
│   └── 🔐 AuthContext.tsx      # Contexto de autenticación
│
├── 📁 types/                   # Definiciones de tipos TypeScript
│   └── 📄 index.ts             # Interfaces y tipos principales
│
└── 📁 assets/                  # Recursos estáticos
    └── 🖼️ react.svg            # Iconos y imágenes
```

---

## 🏛️ **ARQUITECTURA POR CAPAS**

### **1️⃣ CAPA DE PRESENTACIÓN (UI)**
```
┌─────────────────────────────────────┐
│           PÁGINAS (Pages)           │
│  Home | Login | Turnos | ChatBot    │
└─────────────────────────────────────┘
```

### **2️⃣ CAPA DE COMPONENTES**
```
┌─────────────────────────────────────┐
│       COMPONENTES REUTILIZABLES     │
│   Navbar | ProtectedRoute | etc.   │
└─────────────────────────────────────┘
```

### **3️⃣ CAPA DE ESTADO**
```
┌─────────────────────────────────────┐
│        GESTIÓN DE ESTADO            │
│      AuthContext | Local State     │
└─────────────────────────────────────┘
```

### **4️⃣ CAPA DE DATOS**
```
┌─────────────────────────────────────┐
│         COMUNICACIÓN API            │
│     fetch() calls to backend       │
└─────────────────────────────────────┘
```

---

## 🔄 **FLUJO DE LA APLICACIÓN**

### **📱 Punto de Entrada:**
```tsx
main.tsx → App.tsx → AuthProvider → Router → Pages
```

### **🛣️ Sistema de Rutas:**
```tsx
// App.tsx - Configuración principal
<AuthProvider>
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/precios" element={<Precios />} />
      <Route path="/chatbot" element={<ChatBot />} />
      <Route path="/crear-turno" element={
        <ProtectedRoute><CrearTurno /></ProtectedRoute>
      } />
      <Route path="/mis-turnos" element={
        <ProtectedRoute><MisTurnos /></ProtectedRoute>
      } />
    </Routes>
  </Router>
</AuthProvider>
```

---

## 🎯 **PATRONES DE DISEÑO IMPLEMENTADOS**

### **🏭 1. Component Composition Pattern**
```tsx
// Ejemplo: ProtectedRoute
<ProtectedRoute>
  <CrearTurno />  {/* Componente hijo protegido */}
</ProtectedRoute>
```

### **🎪 2. Context Provider Pattern**
```tsx
// AuthContext.tsx - Estado global de autenticación
const AuthContext = createContext<AuthContextType>({...});

export const useAuth = () => {
  return useContext(AuthContext);
};
```

### **📦 3. Barrel Exports Pattern**
```tsx
// pages/index.ts - Exportaciones centralizadas
export { default as Home } from './Home';
export { default as Login } from './Login';
export { default as ChatBot } from './ChatBot';
```

### **🎨 4. CSS Co-location Pattern**
```
CrearTurno.tsx  ←→  CrearTurno.css
MisTurnos.tsx   ←→  MisTurnos.css
ChatBot.tsx     ←→  ChatBot.css
```

---

## 🔐 **SISTEMA DE AUTENTICACIÓN**

### **🏗️ Arquitectura de Auth:**
```
AuthContext (Global State)
    ↓
ProtectedRoute (Route Guard)
    ↓
Protected Pages (Turnos, Perfil)
```

### **📊 Estado de Autenticación:**
```tsx
interface AuthContextType {
  user: User | null;           // Usuario actual
  token: string | null;        // JWT token
  loading: boolean;            // Estado de carga
  login: (email, password) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
}
```

---

## 📡 **COMUNICACIÓN CON BACKEND**

### **🔗 Endpoints Utilizados:**
```tsx
const API_BASE = 'http://localhost:3001/api/v1';

// Autenticación
POST /auth/login
POST /auth/register

// Turnos
GET    /turnos           // Obtener turnos del usuario
POST   /turnos           // Crear nuevo turno
PATCH  /turnos/:id/cancel // Cancelar turno

// Servicios
GET    /servicios        // Obtener lista de servicios

// ChatBot
POST   /chat/message     // Enviar mensaje al chatbot
```

### **🛡️ Autenticación en Requests:**
```tsx
// Ejemplo en MisTurnos.tsx
const response = await fetch(`${API_BASE}/turnos`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🎨 **SISTEMA DE ESTILOS**

### **📐 Metodología CSS:**
- **🎯 Component-scoped CSS:** Cada página tiene su propio archivo CSS
- **🌍 Global styles:** `index.css` para reset y estilos base
- **🎨 CSS Variables:** Para colores y espaciados consistentes
- **📱 Responsive Design:** Mobile-first approach

### **🎨 Paleta de Colores:**
```css
/* Chatbot gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Buttons y acciones */
.btn-primary: #007bff;
.btn-success: #28a745;
.btn-cancel: #dc3545;
```

---

## ⚡ **OPTIMIZACIONES IMPLEMENTADAS**

### **🚀 Performance:**
- **📦 Code Splitting:** Rutas cargadas dinámicamente
- **💾 Local Storage:** Persistencia de tokens de auth
- **🔄 Error Boundaries:** Manejo graceful de errores
- **📱 Responsive:** Optimizado para mobile y desktop

### **🎯 UX/UI:**
- **⏳ Loading States:** Spinners y estados de carga
- **❌ Error Handling:** Mensajes de error claros
- **✅ Success Feedback:** Confirmaciones de acciones
- **🎨 Smooth Animations:** Transiciones suaves

---

## 🔮 **EXTENSIBILIDAD**

### **➕ Fácil agregar nuevas páginas:**
```tsx
// 1. Crear PageName.tsx en /pages
// 2. Crear PageName.css para estilos
// 3. Exportar en pages/index.ts
// 4. Agregar ruta en App.tsx
```

### **🧩 Componentes reutilizables:**
```tsx
// Ejemplo: Crear nuevo componente
components/
  ├── NewComponent.tsx
  ├── NewComponent.css
  └── index.ts (export)
```

---

## 🎯 **VENTAJAS DE ESTA ARQUITECTURA**

### **✅ Beneficios:**
- 🔧 **Mantenible:** Separación clara de responsabilidades
- 📈 **Escalable:** Fácil agregar nuevas funcionalidades
- 🔄 **Reutilizable:** Componentes y utilidades compartidas
- 🧪 **Testeable:** Estructura que facilita testing
- 🎨 **Consistente:** Patrones uniformes en toda la app
- 🚀 **Performante:** Optimizaciones de React y Vite

---

## 🎉 **ESTADO ACTUAL**

### **✅ Completamente Implementado:**
- 🏠 **5 páginas principales** funcionando
- 🔐 **Sistema de autenticación** robusto
- 📱 **Responsive design** en todos los componentes
- 🤖 **Chatbot con IA** integrado
- 🎨 **UI/UX moderna** y profesional

**¡Tu frontend está construido con una arquitectura sólida y profesional!** 🚀
