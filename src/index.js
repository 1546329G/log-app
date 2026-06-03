import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimiter from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { sanitizeRequest } from './middlewares/sanitize.js';
import logsRouter from './routes/logs.js';
import statsRouter from './routes/stats.js';
import dashboardRouter from './routes/dashboard.js';
import { connectDatabase } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(sanitizeRequest);
app.use(rateLimiter);

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));

app.use('/api/logs', logsRouter);
app.use('/api/stats', statsRouter);
app.use('/dashboard', dashboardRouter);
app.use('/static', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.json({ service: 'PhotoBackup Telemetry API', version: '1.0.0' });
});

app.use(errorHandler);

const port = Number(process.env.PORT || 4000);

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`PhotoBackup Telemetry API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  });
