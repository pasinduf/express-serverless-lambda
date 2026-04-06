import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import { AppDataSource, initializeDatabase } from './lib/data-source';

dotenv.config();

const app = express();

// Initialize Database
initializeDatabase().catch(err => console.error("Initial DB setup failed", err));

// Middleware
app.use(cors());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Conditionally use express.json only for methods that typically have a body
app.use((req, res, next) => {
    if (['GET', 'DELETE', 'HEAD'].includes(req.method)) {
        return next();
    }
    express.json()(req, res, next);
});

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

export default app;
