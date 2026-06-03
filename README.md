# PhotoBackup Telemetry API

API de telemetría para PhotoBackup con dashboard integrado y endpoints de logging en tiempo real.

## Estructura del proyecto

- `src/`
  - `index.js`: servidor Express principal
  - `config/db.js`: configuración de conexión MySQL
  - `routes/`: rutas de API y dashboard
  - `controllers/`: lógica de controladores
  - `services/`: acceso a datos y cálculos de estadísticas
  - `middlewares/`: validación, sanitización, rate limit y manejo de errores
- `public/`: dashboard web estático
- `sql/init.sql`: script de creación de base de datos y tablas
- `.env.example`: variables de entorno de ejemplo

## Endpoints disponibles

- `POST /api/logs`: ingresa un nuevo log
- `GET /api/logs`: consulta logs con filtros y paginación
- `GET /api/stats`: obtiene estadísticas de telemetría
- `GET /dashboard`: dashboard web en tiempo real

## Base de datos

Crear la base de datos y tabla con el script:

```bash
mysql -u root -p < sql/init.sql
```

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar las credenciales:

```bash
cp .env.example .env
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

O en producción:

```bash
npm start
```

## Uso desde Android con Retrofit

Este repositorio incluye un helper Android de telemetría basado en Retrofit y compatible con la API de logs de `https://log-app.gandywilliam.dev`.

### Dependencias necesarias

Agrega estas dependencias a tu `build.gradle` de módulo:

```gradle
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
```

### Clases Android disponibles

Los archivos de ayuda se encuentran en `android/com/photobackup/telemetry/`:

- `TelemetryLogger.java`
- `TelemetryApi.java`
- `TelemetryLogRequest.java`
- `TelemetryResponse.java`
- `TelemetryConstants.java`

### Inicialización

Inicializa el singleton en tu `Application` o en el primer punto de entrada:

```java
public class App extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        TelemetryLogger.init(this);
    }
}
```

### Uso básico

```java
TelemetryLogger.getInstance().logInfo(
    TelemetryConstants.Module.BACKUP_SERVICE,
    TelemetryConstants.Event.SERVICE_STARTED,
    "Servicio BackupService iniciado correctamente"
);
```

### Manejo de excepciones

En todos los `catch (Exception e)` del flujo crítico debes registrar el error:

```java
try {
    // operación crítica
} catch (Exception e) {
    TelemetryLogger.getInstance().logError(
        TelemetryConstants.Module.BACKUP_SERVICE,
        TelemetryConstants.Event.UNKNOWN_ERROR,
        "Error en BackupService",
        e
    );
}
```

### Eventos recomendados

BackupService:
- `SERVICE_CREATED`
- `SERVICE_STARTED`
- `SERVICE_DESTROYED`
- `SERVICE_RESTARTED`
- `SERVICE_TASK_REMOVED`

PhotoObserver:
- `PHOTO_OBSERVER_STARTED`
- `PHOTO_OBSERVER_TRIGGERED`

CameraFileObserver:
- `FILE_OBSERVER_STARTED`
- `FILE_OBSERVER_TRIGGERED`

PhotoQueueManager:
- `QUEUE_ADD`
- `QUEUE_PROCESS_START`
- `QUEUE_PROCESS_SUCCESS`
- `QUEUE_PROCESS_FAILED`

FileCopier:
- `PHOTO_COPY_START`
- `PHOTO_COPY_SUCCESS`
- `PHOTO_COPY_FAILED`

Android:
- `SCREEN_ON`
- `SCREEN_OFF`
- `USER_PRESENT`
- `DEVICE_LOCKED`

Errores:
- `IS_PENDING`
- `SECURITY_EXCEPTION`
- `FILE_NOT_FOUND`
- `URI_INVALID`
- `UNKNOWN_ERROR`

### Campos enviados en cada log

Cada registro incluye:
- `timestamp` (la API lo agrega automáticamente)
- `module`
- `event`
- `level`
- `message`
- `android_version`
- `device_model`
- `app_version`
- `battery_level`

### Ejemplo con detalles adicionales

```java
Map<String, Object> details = new HashMap<>();
details.put("photo_uri", uri);
details.put("attempt", attempt);

TelemetryLogger.getInstance().logWarning(
    TelemetryConstants.Module.FILE_COPIER,
    TelemetryConstants.Event.PHOTO_COPY_FAILED,
    "Fallo al copiar la foto",
    details
);
```

### Nota

Esta integración está diseñada para que puedas ver en tiempo real cada paso de PhotoBackup en el dashboard web de la API de telemetría.

## Despliegue en VPS Linux

1. Clonar el repositorio.
2. Instalar Node.js 18+.
3. Configurar MySQL y ejecutar `sql/init.sql`.
4. Copiar `.env.example` a `.env` y ajustar:
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `CORS_ORIGIN`
5. Instalar dependencias:
   ```bash
   npm install
   ```
6. Iniciar la API:
   ```bash
   npm start
   ```
7. Configurar un proxy inverso (Nginx) para servir `/dashboard` y `/api`.

## Observabilidad

- `POST /api/logs` permite recibir todos los eventos del servicio.
- `GET /api/logs` filtra por `level`, `module`, `event`, `fecha_inicio`, `fecha_fin`, `page` y `limit`.
- `GET /api/stats` devuelve métricas de errores y operaciones clave.
- El dashboard actualiza cada 5 segundos para mantener visibilidad en tiempo real.
