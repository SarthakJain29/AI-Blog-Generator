"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, User, Terminal, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";


type Message = {
    role: "user" | "assistant";
    content: string;
}


export function ChatArea() {
    const { user, token, loading: authLoading } = useAuth();
    const params = useParams();
    const chatId = params?.chatId as string;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!chatId) {
                setMessages([{ role: "assistant", content: "Hello! I'm your AI Blog Generator. What topic should we write about today?" }]);
                return;
            }

            // Wait until auth is not loading and we have a token (or we know we're not logged in)
            if (authLoading) return;
            if (!token) {
                setMessages([{ role: "assistant", content: "Please sign in to view your messages." }]);
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get(`/api/chats/${chatId}/messages`);
                if (response.data.length === 0) {
                    setMessages([{ role: "assistant", content: "I've loaded your draft. What would you like to add or change?" }]);
                } else {
                    setMessages(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [chatId, token, authLoading]);

    const handleSend = async () => {
        if (!input.trim() || !chatId || isSending) return;

        const content = input.trim();
        const userMessage: Message = { role: "user", content };

        // Optimistic update
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsSending(true);

        try {
            await api.post(`/api/chats/${chatId}/messages`, { content });

            // For now, simulate AI response since we haven't implemented the AI route yet
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: "I've saved your message. I'm ready to help you generate content based on this!"
                }]);
            }, 1000);
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const copyToClipboard = () => {
        const lastAiMsg = [...messages].reverse().find(m => m.role === "assistant")?.content;
        if (lastAiMsg) {
            navigator.clipboard.writeText(lastAiMsg);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0a0a0c]">
            {/* Header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 glass z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-sm font-medium text-white/80 tracking-tight">
                        {chatId ? "Editing Draft" : "New Writing Session"}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white/40 hover:text-white" onClick={copyToClipboard}>
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 max-w-3xl mx-auto w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <div key={i} className={cn("flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === "user" ? "justify-end" : "justify-start")}>
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shrink-0">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                    </div>
                                )}
                                <div className={cn(
                                    "px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-white/5 text-white/90 border border-white/10 glass"
                                )}>
                                    {msg.content}
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                                        <User className="w-4 h-4 text-white/70" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-[#0a0a0c]">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                    <div className="relative flex items-center bg-[#0d0d12] border border-white/10 rounded-2xl p-2 pl-4 shadow-2xl">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={chatId ? "Start writing..." : "Select or create a draft to start writing..."}
                            disabled={!chatId || isSending}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white/90 placeholder:text-white/20 resize-none h-11 py-3 custom-scrollbar disabled:opacity-50"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <Button
                            onClick={handleSend}
                            size="icon"
                            disabled={!chatId || !input.trim() || isSending}
                            className="rounded-xl h-10 w-10 bg-indigo-600 hover:bg-indigo-700 transition-all shrink-0 ml-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                        </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-white/20 uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> Shift + Enter for new line</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-indigo-400/50" /> Powered by AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
