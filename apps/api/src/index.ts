import express from 'express';
// Trigger nodemon restart
import cors from 'cors';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { formatDate } from '@my-scope/utils';
import { connectToDatabase, Chat } from '@my-scope/db';
import { authMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.API_PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize Firebase Admin
try {
    const existingApps = getApps();
    if (existingApps.length === 0) {
        console.log('Initializing Firebase Admin...');
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin initialized');
    }
} catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
}

if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not defined in environment variables');
}

// Middleware
app.use(cors());
app.use(express.json());

// Start server
const start = async () => {
    try {
        if (MONGODB_URI) {
            await connectToDatabase(MONGODB_URI);
        }

        app.listen(PORT, () => {
            console.log(`API server running on http://localhost:${PORT}`);
            console.log(`Server started at: ${formatDate(new Date())}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

start();

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

// API routes (Protected)
app.get('/api/users/sync', authMiddleware, (req, res) => {
    res.json({
        message: 'User synced successfully',
        user: (req as any).user,
    });
});

// Chat Routes
app.post('/api/chats', authMiddleware, async (req, res) => {
    try {
        const user = (req as any).user;
        const chat = await Chat.create({
            userId: user._id,
            title: 'New Blog Draft'
        });
        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
});

app.get('/api/chats', authMiddleware, async (req, res) => {
    try {
        const user = (req as any).user;
        const chats = await Chat.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

app.get('/api/prescriptions', authMiddleware, (_req, res) => {
    res.json({
        message: 'Prescriptions endpoint',
        data: [],
        user: (_req as any).user,
    });
});

app.post('/api/prescriptions', authMiddleware, (req, res) => {
    res.status(201).json({
        message: 'Prescription created',
        data: req.body,
        user: (req as any).user,
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

