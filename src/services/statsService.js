import { getPool } from '../config/db.js';

export async function getStatsSummary() {
  const pool = getPool();
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*) AS total_logs,
      SUM(level = 'ERROR' OR level = 'FATAL') AS total_errors,
      SUM(event = 'SERVICE_RESTARTED') AS service_restarts,
      SUM(event IN ('PHOTO_OBSERVER_TRIGGERED','PHOTO_COPY_START','PHOTO_COPY_SUCCESS','PHOTO_COPY_FAILED')) AS photos_detected,
      SUM(event = 'PHOTO_COPY_SUCCESS') AS photos_copied,
      SUM(event = 'PHOTO_COPY_FAILED') AS copy_failures
    FROM logs
  `);

  return {
    total_logs: Number(rows[0].total_logs || 0),
    total_errors: Number(rows[0].total_errors || 0),
    service_restarts: Number(rows[0].service_restarts || 0),
    photos_detected: Number(rows[0].photos_detected || 0),
    photos_copied: Number(rows[0].photos_copied || 0),
    copy_failures: Number(rows[0].copy_failures || 0),
  };
}
