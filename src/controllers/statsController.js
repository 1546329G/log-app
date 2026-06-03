import { getStatsSummary } from '../services/statsService.js';

export async function getStats(req, res, next) {
  try {
    const stats = await getStatsSummary();
    return res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}
