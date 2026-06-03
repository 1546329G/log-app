import { getPool } from '../config/db.js';

export async function getStatsSummary() {
  const pool = getPool();
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*) AS total_logs,
      SUM(level = 'ERROR' OR level = 'FATAL') AS total_errors,
      SUM(level = 'WARN') AS total_warnings,
      SUM(event = 'SERVICE_RESTARTED') AS service_restarts,
      SUM(event IN ('PHOTO_OBSERVER_TRIGGERED','FILE_OBSERVER_TRIGGERED','QUEUE_ADD','PHOTO_COPY_START','PHOTO_COPY_SUCCESS','PHOTO_COPY_FAILED')) AS photos_detected,
      SUM(event = 'PHOTO_COPY_SUCCESS') AS photos_copied,
      SUM(event = 'PHOTO_COPY_FAILED') AS copy_failures,
      SUM(event = 'QUEUE_PROCESS_FAILED') AS process_failures,
      SUM(event = 'RESCUE_SCAN') AS rescue_scans,
      SUM(event = 'RESCUE_COMPLETE' AND JSON_EXTRACT(details_json, '$.enqueued') > 0) AS rescue_recoveries,
      SUM(module = 'BackupService') AS service_events,
      SUM(module = 'BootReceiver') AS boot_events
    FROM logs
  `);

  return {
    total_logs: Number(rows[0].total_logs || 0),
    total_errors: Number(rows[0].total_errors || 0),
    total_warnings: Number(rows[0].total_warnings || 0),
    service_restarts: Number(rows[0].service_restarts || 0),
    photos_detected: Number(rows[0].photos_detected || 0),
    photos_copied: Number(rows[0].photos_copied || 0),
    copy_failures: Number(rows[0].copy_failures || 0),
    process_failures: Number(rows[0].process_failures || 0),
    rescue_scans: Number(rows[0].rescue_scans || 0),
    rescue_recoveries: Number(rows[0].rescue_recoveries || 0),
    service_events: Number(rows[0].service_events || 0),
    boot_events: Number(rows[0].boot_events || 0),
  };
}
