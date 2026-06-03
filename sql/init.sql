-- ============================================================
-- PhotoBackup Telemetry API - Inicialización de Base de Datos
-- ============================================================
-- Ejecutar: mysql -u root -p < sql/init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS photobackup_logs
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE photobackup_logs;

-- Tabla principal de logs de telemetría
CREATE TABLE IF NOT EXISTS logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  -- Nivel del log: INFO, DEBUG, WARN, ERROR, FATAL
  level VARCHAR(10) NOT NULL DEFAULT 'INFO',

  -- Módulo que originó el log: BackupService, PhotoObserver, etc.
  module VARCHAR(50) NOT NULL,

  -- Evento específico: SERVICE_STARTED, PHOTO_COPY_SUCCESS, etc.
  event VARCHAR(60) NOT NULL,

  -- Mensaje descriptivo del evento
  message TEXT NOT NULL,

  -- JSON con detalles adicionales (uri, fileName, error, etc.)
  details_json JSON DEFAULT NULL,

  -- Metadatos del dispositivo
  device_model VARCHAR(100) DEFAULT NULL,
  android_version VARCHAR(50) DEFAULT NULL,
  app_version VARCHAR(50) DEFAULT NULL,
  battery_level TINYINT UNSIGNED DEFAULT NULL COMMENT '0-100',

  -- Estado del dispositivo y servicio
  screen_state VARCHAR(10) DEFAULT NULL COMMENT 'ON, OFF',
  service_state VARCHAR(20) DEFAULT NULL COMMENT 'RUNNING, STOPPED, PAUSED, STARTING, DESTROYED',

  -- Información específica de la operación
  photo_uri VARCHAR(255) DEFAULT NULL,
  file_path VARCHAR(255) DEFAULT NULL,
  execution_time_ms INT UNSIGNED DEFAULT NULL,

  -- Timestamp (lo asigna MySQL automáticamente)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Índices para consultas rápidas
  INDEX idx_created_at (created_at DESC),
  INDEX idx_level (level),
  INDEX idx_module (module),
  INDEX idx_event (event),
  INDEX idx_level_module_event (level, module, event),
  INDEX idx_created_at_level (created_at, level)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Nota: Si ya existe la tabla y solo quieres agregar índices:
--
--   CREATE INDEX idx_created_at ON logs (created_at DESC);
--   CREATE INDEX idx_level ON logs (level);
--   CREATE INDEX idx_module ON logs (module);
--   CREATE INDEX idx_event ON logs (event);
--   CREATE INDEX idx_level_module_event ON logs (level, module, event);
--   CREATE INDEX idx_created_at_level ON logs (created_at, level);
-- ============================================================
