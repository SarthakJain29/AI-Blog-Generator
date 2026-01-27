import express from 'express';
// Trigger nodemon restart
import cors from 'cors';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { formatDate } from '@my-scope/utils';
import { connectToDatabase, Chat, Message } from '@my-scope/db';
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

// Message Routes
app.get('/api/chats/:chatId/messages', authMiddleware, async (req, res) => {
    try {
        const user = (req as any).user;
        const { chatId } = req.params;

        // Verify chat ownership
        const chat = await Chat.findOne({ _id: chatId, userId: user._id });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found or unauthorized' });
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.post('/api/chats/:chatId/messages', authMiddleware, async (req, res) => {
    try {
        const user = (req as any).user;
        const { chatId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        // Verify chat ownership
        const chat = await Chat.findOne({ _id: chatId, userId: user._id });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found or unauthorized' });
        }

        const message = await Message.create({
            userId: user._id,
            chatId,
            role: 'user',
            content,
            blog: false
        });

        // Increment msgCount
        await Chat.findByIdAndUpdate(chatId, { $inc: { msgCount: 1 } });

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
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

