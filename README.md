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

```java
public interface TelemetryApi {
    @POST("/api/logs")
    Call<ApiResponse> sendLog(@Body LogRequest payload);

    @GET("/api/logs")
    Call<LogsResponse> listLogs(@Query("level") String level,
                                @Query("module") String module,
                                @Query("event") String event,
                                @Query("fecha_inicio") String fechaInicio,
                                @Query("fecha_fin") String fechaFin,
                                @Query("page") int page,
                                @Query("limit") int limit);

    @GET("/api/stats")
    Call<StatsResponse> getStats();
}
```

Modelo de petición `LogRequest`:

```java
public class LogRequest {
    public String level;
    public String module;
    public String event;
    public String message;
    public Map<String, Object> details_json;
    public String device_model;
    public String android_version;
    public String app_version;
    public Integer battery_level;
    public String screen_state;
    public String service_state;
    public String photo_uri;
    public String file_path;
    public Integer execution_time_ms;
}
```

Ejemplo de consumo básico:

```java
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://tu-dominio.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build();

TelemetryApi api = retrofit.create(TelemetryApi.class);

LogRequest log = new LogRequest();
log.level = "INFO";
log.module = "BackupService";
log.event = "SERVICE_STARTED";
log.message = "Servicio iniciado";
log.details_json = new HashMap<>();
log.device_model = "Redmi Note";
log.android_version = "15";
log.app_version = "1.0.0";
log.battery_level = 85;
log.screen_state = "OFF";
log.service_state = "RUNNING";
log.photo_uri = "";
log.file_path = "";
log.execution_time_ms = 0;

api.sendLog(log).enqueue(new Callback<ApiResponse>() {
    @Override
    public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
        if (response.isSuccessful() && response.body() != null && response.body().success) {
            Log.i("Telemetry", "Log enviado correctamente");
        }
    }

    @Override
    public void onFailure(Call<ApiResponse> call, Throwable t) {
        Log.e("Telemetry", "Error enviando log", t);
    }
});
```

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
