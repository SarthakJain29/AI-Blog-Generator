import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser, IChat, IMessage } from '../types';

// User Schema
const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        firebaseUid: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export const User = (mongoose.models.User as Model<IUser>) || model<IUser>('User', UserSchema);

// Chat Schema
const ChatSchema = new Schema<IChat>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        msgCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Chat = (mongoose.models.Chat as Model<IChat>) || model<IChat>('Chat', ChatSchema);

// Message Schema
const MessageSchema = new Schema<IMessage>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        blog: { type: Boolean, default: false },
        meta: { type: Schema.Types.Mixed },
        topic: { type: String },
        version: { type: Number, default: 1 },
        sources: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
        plan: [{ type: String }],
    },
    { timestamps: true }
);

export const Message = (mongoose.models.Message as Model<IMessage>) || model<IMessage>('Message', MessageSchema);
