import { Types } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    firebaseUid: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IChat {
    userId: Types.ObjectId;
    title: string;
    msgCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISource {
    title: string;
    url: string;
}

export interface IMessage {
    userId: Types.ObjectId;
    chatId: Types.ObjectId;
    role: 'user' | 'assistant';
    content: string;
    blog: boolean;
    meta?: Record<string, any>;
    topic: string;
    version: number;
    sources: ISource[];
    plan: string[];
    createdAt: Date;
    updatedAt: Date;
}
