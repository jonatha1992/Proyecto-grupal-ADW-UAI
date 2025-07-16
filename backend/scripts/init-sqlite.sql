-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    precio REAL NOT NULL CHECK (precio >= 0),
    duracion INTEGER NOT NULL CHECK (duracion > 0),
    descripcion TEXT,
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    servicio TEXT NOT NULL,
    precio REAL NOT NULL CHECK (precio >= 0),
    estado TEXT DEFAULT 'confirmado' CHECK (
        estado IN (
            'confirmado',
            'cancelado',
            'completado',
            'reprogramado'
        )
    ),
    notas TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (fecha, hora)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE INDEX IF NOT EXISTS idx_turnos_user_id ON turnos (user_id);

CREATE INDEX IF NOT EXISTS idx_turnos_fecha ON turnos (fecha);

CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos (estado);

CREATE INDEX IF NOT EXISTS idx_turnos_fecha_hora ON turnos (fecha, hora);

CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios (activo);

CREATE INDEX IF NOT EXISTS idx_servicios_precio ON servicios (precio);

-- Triggers para updated_at en usuarios
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
AFTER UPDATE ON users 
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Triggers para updated_at en servicios
CREATE TRIGGER IF NOT EXISTS update_servicios_updated_at 
AFTER UPDATE ON servicios 
BEGIN
    UPDATE servicios SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Triggers para updated_at en turnos
CREATE TRIGGER IF NOT EXISTS update_turnos_updated_at 
AFTER UPDATE ON turnos 
BEGIN
    UPDATE turnos SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Insertar servicios de ejemplo
INSERT OR IGNORE INTO
    servicios (
        id,
        nombre,
        precio,
        duracion,
        descripcion,
        activo
    )
VALUES (
        '1',
        'Consulta General',
        50.00,
        30,
        'Consulta médica general',
        1
    ),
    (
        '2',
        'Consulta Especializada',
        80.00,
        45,
        'Consulta con médico especialista',
        1
    ),
    (
        '3',
        'Chequeo Preventivo',
        60.00,
        60,
        'Chequeo médico preventivo completo',
        1
    ),
    (
        '4',
        'Vacunación',
        25.00,
        15,
        'Aplicación de vacunas',
        1
    ),
    (
        '5',
        'Consulta Pediátrica',
        55.00,
        30,
        'Consulta médica para niños',
        1
    ),
    (
        '6',
        'Consulta Cardiológica',
        100.00,
        45,
        'Consulta con cardiólogo',
        1
    ),
    (
        '7',
        'Consulta Dermatológica',
        90.00,
        30,
        'Consulta con dermatólogo',
        1
    );