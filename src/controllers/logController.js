import { insertLog, insertLogsBatch, queryLogs, countLogs } from '../services/logService.js';

export async function createLog(req, res, next) {
  try {
    const payload = {
      level: req.body.level,
      module: req.body.module,
      event: req.body.event,
      message: req.body.message,
      details_json: req.body.details_json || {},
      device_model: req.body.device_model || null,
      android_version: req.body.android_version || null,
      app_version: req.body.app_version || null,
      battery_level: req.body.battery_level ?? null,
      screen_state: req.body.screen_state || null,
      service_state: req.body.service_state || null,
      photo_uri: req.body.photo_uri || null,
      file_path: req.body.file_path || null,
      execution_time_ms: req.body.execution_time_ms ?? null,
    };

    await insertLog(payload);
    return res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function createLogsBatch(req, res, next) {
  try {
    const logs = Array.isArray(req.body.logs) ? req.body.logs : (Array.isArray(req.body) ? req.body : [req.body]);
    if (logs.length === 0) {
      return res.status(400).json({ success: false, error: 'Se requiere al menos un log' });
    }
    if (logs.length > 100) {
      return res.status(400).json({ success: false, error: 'Maximo 100 logs por batch' });
    }
    await insertLogsBatch(logs);
    return res.status(201).json({ success: true, count: logs.length });
  } catch (error) {
    next(error);
  }
}

export async function getLogs(req, res, next) {
  try {
    const filters = {
      level: req.query.level,
      module: req.query.module,
      event: req.query.event,
      fecha_inicio: req.query.fecha_inicio,
      fecha_fin: req.query.fecha_fin,
    };
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);

    const [logs, total] = await Promise.all([
      queryLogs(filters, page, limit),
      countLogs(filters),
    ]);

    return res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}
