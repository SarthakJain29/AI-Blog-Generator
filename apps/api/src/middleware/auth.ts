import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { User } from '@my-scope/db';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        // Upsert user in MongoDB
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                email: email || '',
                name: name || email?.split('@')[0] || 'User',
                // Note: You might want to store the picture URL as well if your schema supports it
            });
        } else {
            // Optional: Update user info if it changed
            if (user.email !== email || user.name !== name) {
                user.email = email || user.email;
                user.name = name || user.name;
                await user.save();
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
