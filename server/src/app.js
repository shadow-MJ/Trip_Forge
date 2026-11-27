import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import { errorHandler, notFound } from './middleware/index.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api/auth', authRoutes);
app.use('/api', tripRoutes);
app.use('/api', memberRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', moduleRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
