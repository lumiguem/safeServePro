-- Script de Base de Datos para SafeServe Pro
-- Motor: MySQL 8.0+

CREATE DATABASE IF NOT EXISTS safeserve_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE safeserve_db;

-- 1. TABLA DE ESTABLECIMIENTOS (Locales)
CREATE TABLE establecimientos (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    gerente VARCHAR(100),
    riesgo_actual INT DEFAULT 0,
    inspecciones_abiertas INT DEFAULT 0,
    estado ENUM('ACTIVE', 'FLAGGED', 'SUSPENDED') DEFAULT 'ACTIVE',
    coord_x DECIMAL(5,2), -- Para el mapa de riesgo
    coord_y DECIMAL(5,2), -- Para el mapa de riesgo
    ultima_inspeccion DATETIME,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABLA DE PLANTILLAS DE INSPECCIÓN
CREATE TABLE plantillas (
    id VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB;

-- 3. TABLA DE ITEMS DE CADA PLANTILLA
CREATE TABLE plantilla_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plantilla_id VARCHAR(20),
    tarea VARCHAR(255) NOT NULL,
    es_critico BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (plantilla_id) REFERENCES plantillas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. TABLA DE AUDITORÍAS REALIZADAS
CREATE TABLE auditorias (
    id VARCHAR(20) PRIMARY KEY,
    establecimiento_id VARCHAR(20),
    plantilla_id VARCHAR(20),
    fecha_auditoria DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntuacion_cumplimiento INT,
    progreso INT DEFAULT 0,
    sincronizado_servidor BOOLEAN DEFAULT FALSE,
    observaciones_generales TEXT,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos(id),
    FOREIGN KEY (plantilla_id) REFERENCES plantillas(id)
) ENGINE=InnoDB;

-- 6. TABLA DE EVIDENCIA (Fotos/Archivos)
CREATE TABLE evidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auditoria_id VARCHAR(20),
    url_archivo TEXT NOT NULL,
    tipo_archivo VARCHAR(50), -- image/jpeg, etc
    timestamp_captura DATETIME,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. TABLA DE HALLAZGOS / INFRACCIONES
CREATE TABLE hallazgos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auditoria_id VARCHAR(20),
    evidencia_id INT NOT NULL,
    categoria VARCHAR(50),
    descripcion TEXT NOT NULL,
    prioridad ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    accion_correctiva TEXT,
    esta_resuelto BOOLEAN DEFAULT FALSE,
    fecha_hallazgo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE,
    FOREIGN KEY (evidencia_id) REFERENCES evidencias(id)
) ENGINE=InnoDB;



-- INDICES PARA OPTIMIZACIÓN
CREATE INDEX idx_riesgo ON establecimientos(riesgo_actual);
CREATE INDEX idx_fecha_auditoria ON auditorias(fecha_auditoria);
CREATE INDEX idx_prioridad_hallazgo ON hallazgos(prioridad);

-- ================================
-- Tabla: users (empleados del sistema)
-- ================================

CREATE TABLE usuario (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         username VARCHAR(50) NOT NULL UNIQUE,
                         email VARCHAR(100) NOT NULL UNIQUE,
                         password_hash VARCHAR(255) NOT NULL,
                         nombre VARCHAR(100),
                         apellido VARCHAR(100),
                         foto_url VARCHAR(255),
                         activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- ===============================
-- TABLA ROLES
-- ===============================
CREATE TABLE roles (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       nombre VARCHAR(50) NOT NULL UNIQUE,
                       descripcion VARCHAR(255),
                       activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla intermedia explícita con su propio id

CREATE TABLE usuario_rol (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             usuario_id BIGINT NOT NULL,
                             rol_id BIGINT NOT NULL,
                             activo BOOLEAN NOT NULL DEFAULT TRUE,
                             FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
                             FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- CARGA DE DATOS INICIALES (Matching Mock Data)
-- ---------------------------------------------------------

-- ===============================
-- ROLES
-- ===============================
INSERT INTO roles (nombre, descripcion, activo)
VALUES
    ('ADMIN', 'Acceso total al sistema', TRUE),
    ('INSPECTOR', 'Acceso básico al sistema', TRUE),
    ('GERENTE', 'Acceso a reportes y gestión avanzada', TRUE);
    
    -- ===============================
-- USUARIOS
-- (contraseñas simuladas como hash: "admin123")
-- ===============================
INSERT INTO usuario (username, email, password_hash, nombre, apellido, activo)
VALUES
    ('admin', 'admin@empresa.com', '$2a$10$neJ49B5F/bS/3BmoAuEOGe/YEUgRroeWGaxJTC.f5n8RJVZhXY2OG', 'Miguel', 'Moreno', TRUE);


INSERT INTO establecimientos (id, nombre, direccion, gerente, riesgo_actual, inspecciones_abiertas, estado, coord_x, coord_y) VALUES
('LOC-001', 'Bistro del Centro', 'Calle Mayor 123', 'Alex Rivera', 78, 4, 'FLAGGED', 45.00, 30.00),
('LOC-002', 'Airport Express', 'Terminal 4', 'Sara Chen', 12, 0, 'ACTIVE', 80.00, 15.00),
('LOC-003', 'Parrilla del Puerto', 'Muelle 39', 'Marcos Thompson', 45, 2, 'ACTIVE', 20.00, 70.00),
('LOC-004', 'Pizzería Urbana', 'Av. Las Palmeras 88', 'Lisa G.', 89, 7, 'FLAGGED', 65.00, 60.00);

INSERT INTO plantillas (id, titulo, categoria) VALUES
('TMPL-1', 'Higiene de Cámara Frigorífica', 'Almacenamiento'),
('TMPL-2', 'Separación de Carnes Crudas', 'Seguridad'),
('TMPL-3', 'Control de Lavado de Manos', 'Limpieza'),
('TMPL-4', 'EPP del Personal', 'Personal');

INSERT INTO plantilla_items (plantilla_id, tarea, es_critico) VALUES
('TMPL-1', 'Juntas de puertas limpias y herméticas', FALSE),
('TMPL-1', 'Suelo libre de residuos', FALSE),
('TMPL-1', 'Temperatura ambiente < 4°C', TRUE),
('TMPL-2', 'Aves crudas en el estante inferior', TRUE),
('TMPL-2', 'Separación de alimentos listos para consumo', TRUE),
('TMPL-3', 'Jabón y toallas disponibles', TRUE);

INSERT INTO plantilla_items (plantilla_id, tarea, es_critico) VALUES
('TMPL-1', 'Alimentos a 15cm del suelo', TRUE),
('TMPL-1', 'Sin óxido en el interior', TRUE),
('TMPL-2', 'Recipientes cubiertos', FALSE),
('TMPL-2', 'Sin goteos', FALSE),
('TMPL-2', 'Etiquetado de fechas correcto', TRUE),
('TMPL-3', 'Accesible y sin obstáculos', FALSE),
('TMPL-3', 'Agua fría/caliente operativa', FALSE),
('TMPL-3', 'Papelera disponible', TRUE),
('TMPL-3', 'Señalización visible', FALSE),
('TMPL-4', 'Redes para el cabello puestas', TRUE),
('TMPL-4', 'Sin joyas en manos', FALSE),
('TMPL-4', 'Delantales limpios', TRUE),
('TMPL-4', 'Cambio de guantes frecuente', FALSE),
('TMPL-4', 'No comer en área de preparación', TRUE);


-- Vista útil para el Panel de Control
CREATE VIEW vista_resumen_riesgo AS
SELECT 
    e.nombre, 
    e.riesgo_actual, 
    COUNT(a.id) as total_inspecciones,
    AVG(a.puntuacion_cumplimiento) as promedio_historico
FROM establecimientos e
LEFT JOIN auditorias a ON e.id = a.establecimiento_id
GROUP BY e.id;