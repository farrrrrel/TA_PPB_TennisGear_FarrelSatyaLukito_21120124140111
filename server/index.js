import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './src/config/supabaseClient.js'; // Fail fast if database credentials are missing.
import categoryRoutes from './src/routes/categoryRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4180')
    .split(',').map(s => s.trim()).filter(Boolean)
);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    callback(new Error('Origin not allowed'));
  }
}));
app.use(express.json({ limit: '64kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Health check, consistent with the existing frontend/backend contract.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Tennis Gear API', storage: 'supabase' });
});

// Routes -> Controllers -> Models -> Supabase PostgreSQL.
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Tennis Gear API: http://localhost:${PORT} (Supabase only)`);
});
