"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, User, Copy, Check, Loader2, ArrowUp } from "lucide-react";
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
                setMessages([]);
                return;
            }

            // Wait until auth is not loading and we have a token (or we know we're not logged in)
            if (authLoading) return;
            if (!token) {
                // If not logged in, we might want to redirect or show a different state, 
                // but for now keeping empty to show the "What shall we write today?" UI 
                // or we could show a specific "Sign in" message if desired.
                // For this request, we just want to avoid the "Loaded draft" message overriding the UI.
                setMessages([]);
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get(`/api/chats/${chatId}/messages`);
                setMessages(response.data);
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
        <div className="flex-1 flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${messages.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <h1 className="text-sm font-medium text-slate-900 tracking-tight">
                        {messages.length > 0 ? "Smart Draft" : "New Post"}
                    </h1>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Draft
                    </span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto p-8 opacity-0 animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-forwards" style={{ opacity: 1 }}>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-lg shadow-indigo-100 border border-indigo-50 flex items-center justify-center mb-6 rotate-3 transform transition-transform hover:rotate-0">
                            <Sparkles className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-serif font-medium text-slate-900 mb-3 tracking-tight">
                            What shall we write today?
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed mb-8">
                            I can draft blog posts, brainstorm ideas, or outline articles. Just tell me your topic.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            {["Top 10 trends in AI", "Benefits of remote work", "How to verify a startup idea", "Will AI take over jobs?"].map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => setInput(`Write a blog post about: ${topic}`)}
                                    className="p-3 text-sm text-slate-600 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md transition-all text-left"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 max-w-4xl mx-auto ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.role === "assistant" && (
                                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/10 mt-0.5">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                            )}

                            <div
                                className={`rounded-2xl px-5 py-3.5 shadow-sm ring-1 ring-inset ${msg.role === "user"
                                    ? "bg-slate-900 text-white ring-slate-900/10 rounded-br-none ml-12"
                                    : "bg-white text-slate-700 ring-slate-200/50 rounded-bl-none mr-12"
                                    }`}
                            >
                                {msg.role === "assistant" ? (
                                    <div
                                        className="prose prose-slate prose-sm max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:leading-relaxed prose-a:text-indigo-600 hover:prose-a:text-indigo-500"
                                        dangerouslySetInnerHTML={{ __html: msg.content }}
                                    />
                                ) : (
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                                )}
                            </div>

                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                                    <User className="w-4 h-4 text-slate-500" />
                                </div>
                            )}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex gap-4 max-w-4xl mx-auto animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-indigo-300" />
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 w-2/3">
                            <div className="h-4 bg-slate-100 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-8 bg-white/90 backdrop-blur-xl border-t border-slate-100 relative z-20">
                <div className="max-w-4xl mx-auto relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your blog post idea..."
                        className="min-h-[60px] max-h-[200px] w-full bg-slate-50 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-100/50 rounded-2xl pr-14 pl-5 py-4 resize-none text-base shadow-sm transition-all placeholder:text-slate-400"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className={`absolute right-2 bottom-2 rounded-xl w-10 h-10 p-0 transition-all duration-300 shadow-sm ${input.trim() ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20" : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ArrowUp className="w-5 h-5" />
                        )}
                    </Button>
                </div>
                <div className="text-center mt-3">
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">AI-generated content can be inaccurate.</p>
                </div>
            </div>
        </div>
    );
}

