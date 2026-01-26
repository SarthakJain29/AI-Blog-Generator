import express from 'express';
import cors from 'cors';
import { formatDate } from '@prescription-ai/utils';

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        formattedDate: formatDate(new Date()),
        service: 'prescription-ai-api',
        version: '0.1.0',
    });
});

// API routes
app.get('/api/prescriptions', (_req, res) => {
    res.json({
        message: 'Prescriptions endpoint',
        data: [],
    });
});

app.post('/api/prescriptions', (req, res) => {
    res.status(201).json({
        message: 'Prescription created',
        data: req.body,
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
    });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📅 Server started at: ${formatDate(new Date())}`);
});
