import { getPool } from '../config/db.js';

const allowedFilters = ['level', 'module', 'event'];

export async function insertLog(payload) {
  const pool = getPool();
  const query = `INSERT INTO logs (
    level, module, event, message, details_json,
    device_model, android_version, app_version,
    battery_level, screen_state, service_state,
    photo_uri, file_path, execution_time_ms
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    payload.level,
    payload.module,
    payload.event,
    payload.message,
    JSON.stringify(payload.details_json),
    payload.device_model,
    payload.android_version,
    payload.app_version,
    payload.battery_level,
    payload.screen_state,
    payload.service_state,
    payload.photo_uri,
    payload.file_path,
    payload.execution_time_ms,
  ];

  await pool.execute(query, values);
}

export async function insertLogsBatch(logs) {
  const pool = getPool();
  const query = `INSERT INTO logs (
    level, module, event, message, details_json,
    device_model, android_version, app_version,
    battery_level, screen_state, service_state,
    photo_uri, file_path, execution_time_ms
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  for (const log of logs) {
    const values = [
      log.level || 'INFO',
      log.module || 'unknown',
      log.event || 'UNKNOWN',
      log.message || '',
      log.details_json ? JSON.stringify(log.details_json) : '{}',
      log.device_model || null,
      log.android_version || null,
      log.app_version || null,
      log.battery_level ?? null,
      log.screen_state || null,
      log.service_state || null,
      log.photo_uri || null,
      log.file_path || null,
      log.execution_time_ms ?? null,
    ];
    await pool.execute(query, values);
  }
}

export async function queryLogs(filters, page, limit) {
  const pool = getPool();
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (filters.level) {
    conditions.push('level = ?');
    values.push(filters.level);
  }
  if (filters.module) {
    conditions.push('module = ?');
    values.push(filters.module);
  }
  if (filters.event) {
    conditions.push('event = ?');
    values.push(filters.event);
  }
  if (filters.fecha_inicio) {
    conditions.push('created_at >= ?');
    values.push(filters.fecha_inicio);
  }
  if (filters.fecha_fin) {
    conditions.push('created_at <= ?');
    values.push(filters.fecha_fin);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT id, created_at, level, module, event, message,
    details_json, device_model, android_version, app_version,
    battery_level, screen_state, service_state, photo_uri,
    file_path, execution_time_ms
    FROM logs ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?`;

  const [rows] = await pool.execute(sql, [...values, limit, offset]);
  return rows.map((row) => ({
    ...row,
    details_json: row.details_json ? JSON.parse(row.details_json) : {},
  }));
}

export async function countLogs(filters) {
  const pool = getPool();
  const conditions = [];
  const values = [];

  if (filters.level) {
    conditions.push('level = ?');
    values.push(filters.level);
  }
  if (filters.module) {
    conditions.push('module = ?');
    values.push(filters.module);
  }
  if (filters.event) {
    conditions.push('event = ?');
    values.push(filters.event);
  }
  if (filters.fecha_inicio) {
    conditions.push('created_at >= ?');
    values.push(filters.fecha_inicio);
  }
  if (filters.fecha_fin) {
    conditions.push('created_at <= ?');
    values.push(filters.fecha_fin);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT COUNT(*) AS count FROM logs ${whereClause}`, values);
  return rows[0].count || 0;
}
