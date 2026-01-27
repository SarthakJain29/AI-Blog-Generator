"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    PlusCircle,
    History,
    LogOut,
    LogIn,
    User as UserIcon,
    Sparkles,
    Clock
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
        <aside className="w-[280px] h-full glass border-r border-white/5 flex flex-col hidden md:flex">
            {/* Logo Section */}
            <div className="p-6 border-b border-white/5">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight font-outfit text-white">ScribeAI</span>
                </div>
            </div>

            {/* Main Navigation / Past Chat List */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
                <div>
                    <h3 className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <PlusCircle className="w-3 h-3" />
                        Workspace
                    </h3>
                    <div className="space-y-1">
                        <Button
                            className="w-full justify-start gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white disabled:opacity-50"
                            variant="outline"
                            onClick={handleCreateChat}
                            disabled={isCreating}
                        >
                            <PlusCircle className="w-4 h-4 text-indigo-400" />
                            {isCreating ? "Creating..." : "New Blog Draft"}
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <History className="w-3 h-3" />
                        PAST DRAFTS
                    </h3>
                    <div className="space-y-1">
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <button
                                    key={chat._id}
                                    onClick={() => handleChatClick(chat._id)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 group",
                                        params?.chatId === chat._id
                                            ? "bg-white/10 text-white"
                                            : "hover:bg-white/5 text-white/70 hover:text-white"
                                    )}
                                >
                                    <Clock className="w-3.5 h-3.5 text-white/30 group-hover:text-indigo-400 transition-colors" />
                                    <span className="truncate">{chat.title}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-xs text-white/20 italic">No drafts yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Profile / Auth Section */}
            <div className="p-4 border-t border-white/5 space-y-2">
                {user ? (
                    <>
                        <div className="flex items-center gap-3 px-2 py-3">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-white/10" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <UserIcon className="w-4 h-4 text-white/50" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                                <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-white/50 hover:text-red-400 hover:bg-red-400/10 border-white/5 hover:border-red-400/30"
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                        onClick={signInWithGoogle}
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign in with Google
                    </Button>
                )}
            </div>
        </aside>
    );
}
