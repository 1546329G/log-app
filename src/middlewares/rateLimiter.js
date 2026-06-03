import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const maxRequests = Number(process.env.RATE_LIMIT_MAX || 120);

const limiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Límite de solicitudes excedido. Intenta nuevamente más tarde.',
  },
});

export default limiter;
