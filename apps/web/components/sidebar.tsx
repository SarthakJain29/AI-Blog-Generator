"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    PlusCircle,
    LogOut,
    LogIn,
    Sparkles,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface Chat {
    _id: string;
    title: string;
    createdAt: string;
}

export function Sidebar() {
    const { user, signInWithGoogle, logout, token } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [chats, setChats] = useState<Chat[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (user && token) {
            fetchChats();
        } else {
            setChats([]);
        }
    }, [user, token]);

    const fetchChats = async () => {
        try {
            const response = await api.get("/api/chats");
            setChats(response.data);
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    const handleCreateChat = async () => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        try {
            setIsCreating(true);
            const response = await api.post("/api/chats");
            const newChat = response.data;
            setChats([newChat, ...chats]);
            router.push(`/chat/${newChat._id}`);
        } catch (error) {
            console.error("Failed to create chat:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleChatClick = (chatId: string) => {
        router.push(`/chat/${chatId}`);
    };

    return (
        <aside className="w-[280px] h-full bg-slate-50/50 border-r border-slate-200/60 backdrop-blur-xl flex flex-col hidden md:flex font-sans">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <div
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push("/")}
                >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900 font-serif">ScribeAI</span>
                </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4 pt-6">
                <Button
                    onClick={handleCreateChat}
                    disabled={isCreating}
                    className="w-full justify-start gap-2.5 bg-white hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm hover:shadow transition-all h-10 px-4 rounded-xl"
                    variant="ghost"
                >
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-sm">New Blog Post</span>
                </Button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 custom-scrollbar">
                <div className="px-3 pb-2 pt-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Drafts</h3>
                </div>
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <button
                            key={chat._id}
                            onClick={() => handleChatClick(chat._id)}
                            className={cn(
                                "w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 truncate group",
                                params?.chatId === chat._id
                                    ? "bg-white shadow-sm border border-slate-200 text-slate-900 font-medium"
                                    : "hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border border-transparent"
                            )}
                        >
                            <MessageSquare className={cn("w-4 h-4 shrink-0 transition-colors", params?.chatId === chat._id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500")} />
                            <span className="truncate">{chat.title || "Untitled Draft"}</span>
                        </button>
                    ))
                ) : (
                    <div className="px-3 py-8 text-center bg-slate-100/50 rounded-lg mx-3 border border-slate-100 border-dashed">
                        <p className="text-xs text-slate-400 font-medium">No drafts yet</p>
                    </div>
                )}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200/60 bg-white/40">
                {user ? (
                    <div className="group">
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm hover:border hover:border-slate-100 transition-all">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                    <span className="text-sm font-semibold text-slate-600">
                                        {user.displayName?.[0] || user.email?.[0] || "U"}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0 flex flex-col items-start">
                                <span className="text-sm font-semibold text-slate-900 truncate">{user.displayName}</span>
                                <button onClick={logout} className="text-xs text-slate-500 hover:text-rose-600 text-left transition-colors flex items-center gap-1 mt-0.5">
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20"
                        size="sm"
                        onClick={signInWithGoogle}
                    >
                        <LogIn className="w-3.5 h-3.5 mr-2" />
                        Sign in
                    </Button>
                )}
            </div>
        </aside>
    );
}
