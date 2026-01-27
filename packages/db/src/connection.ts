import mongoose from 'mongoose';

export async function connectToDatabase(uri: string) {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(uri);
        console.log('🍃 Successfully connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

export async function disconnectFromDatabase() {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
}
