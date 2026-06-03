import { Router } from 'express';
import { body, query } from 'express-validator';
import { createLog, createLogsBatch, getLogs } from '../controllers/logController.js';
import { validateRequest } from '../middlewares/validation.js';

const router = Router();

const logValidationRules = [
  body('level').isString().trim().notEmpty().isIn([
    'INFO', 'DEBUG', 'WARN', 'ERROR', 'FATAL',
  ]),
  body('module').isString().trim().notEmpty(),
  body('event').isString().trim().notEmpty(),
  body('message').isString().trim().notEmpty(),
  body('details_json').optional().isObject(),
  body('device_model').optional().isString().trim().isLength({ max: 100 }),
  body('android_version').optional().isString().trim().isLength({ max: 50 }),
  body('app_version').optional().isString().trim().isLength({ max: 50 }),
  body('battery_level').optional().isInt({ min: 0, max: 100 }),
  body('screen_state').optional().isString().trim().isIn(['ON', 'OFF']),
  body('service_state').optional().isString().trim().isIn(['RUNNING', 'STOPPED', 'PAUSED', 'STARTING', 'DESTROYED']),
  body('photo_uri').optional().isString().trim().isLength({ max: 255 }),
  body('file_path').optional().isString().trim().isLength({ max: 255 }),
  body('execution_time_ms').optional().isInt({ min: 0 }),
];

const logsQueryValidation = [
  query('level').optional().isString().trim(),
  query('module').optional().isString().trim(),
  query('event').optional().isString().trim(),
  query('fecha_inicio').optional().isISO8601(),
  query('fecha_fin').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 200 }),
];

router.post('/', logValidationRules, validateRequest, createLog);
router.post('/batch', createLogsBatch);
router.get('/', logsQueryValidation, validateRequest, getLogs);

export default router;
