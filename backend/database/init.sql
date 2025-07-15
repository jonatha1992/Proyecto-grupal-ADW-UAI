-- Crear extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    duracion INTEGER NOT NULL CHECK (duracion > 0), -- en minutos
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT unique_service_name UNIQUE (nombre)
);

-- Tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    servicio VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    estado VARCHAR(20) DEFAULT 'confirmado' CHECK (estado IN ('confirmado', 'cancelado', 'completado', 'reprogramado')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT unique_datetime_slot UNIQUE (fecha, hora),
    CONSTRAINT future_appointment CHECK (fecha >= CURRENT_DATE)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_turnos_user_id ON turnos(user_id);
CREATE INDEX IF NOT EXISTS idx_turnos_fecha ON turnos(fecha);
CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos(estado);
CREATE INDEX IF NOT EXISTS idx_turnos_fecha_hora ON turnos(fecha, hora);
CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios(activo);
CREATE INDEX IF NOT EXISTS idx_servicios_precio ON servicios(precio);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicios_updated_at 
    BEFORE UPDATE ON servicios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_turnos_updated_at 
    BEFORE UPDATE ON turnos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar servicios de ejemplo
INSERT INTO servicios (nombre, precio, duracion, descripcion, activo) VALUES
('Consulta General', 50.00, 30, 'Consulta médica general', true),
('Consulta Especializada', 80.00, 45, 'Consulta con médico especialista', true),
('Chequeo Preventivo', 60.00, 60, 'Chequeo médico preventivo completo', true),
('Vacunación', 25.00, 15, 'Aplicación de vacunas', true),
('Consulta Pediátrica', 55.00, 30, 'Consulta médica para niños', true),
('Consulta Cardiológica', 100.00, 45, 'Consulta con cardiólogo', true),
('Consulta Dermatológica', 90.00, 30, 'Consulta con dermatólogo', true)
ON CONFLICT (nombre) DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla de usuarios registrados en el sistema';
COMMENT ON TABLE servicios IS 'Catálogo de servicios médicos disponibles';
COMMENT ON TABLE turnos IS 'Registro de citas médicas agendadas';

COMMENT ON COLUMN users.password_hash IS 'Hash de la contraseña del usuario (bcrypt)';
COMMENT ON COLUMN turnos.estado IS 'Estado del turno: confirmado, cancelado, completado, reprogramado';
COMMENT ON COLUMN servicios.duracion IS 'Duración del servicio en minutos';
COMMENT ON COLUMN servicios.precio IS 'Precio del servicio en la moneda local';
