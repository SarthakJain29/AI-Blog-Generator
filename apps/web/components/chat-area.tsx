"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, User, Terminal, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatArea() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your AI Blog Generator. What topic should we write about today?" },
    ]);
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: "user", content: input }]);
        setInput("");
        // In a real app, you'd trigger the AI here
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "That's a great topic! Let me help you outline and write a compelling blog post about '" + input + "'."
            }]);
        }, 1000);
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
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
            {/* Header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 glass z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-sm font-medium text-white/80 tracking-tight">AI Writing Session</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white/40 hover:text-white" onClick={copyToClipboard}>
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 max-w-3xl mx-auto w-full">
                {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === "user" ? "justify-end" : "justify-start")}>
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        <div className={cn(
                            "px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                            msg.role === "user"
                                ? "bg-primary text-white"
                                : "bg-white/5 text-white/90 border border-white/10"
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
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-background">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                    <div className="relative flex items-center bg-[#0d0d12] border border-white/10 rounded-2xl p-2 pl-4 shadow-2xl">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Start writing or ask AI for a blog idea..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white/90 placeholder:text-white/20 resize-none h-11 py-3 custom-scrollbar"
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
                            className="rounded-xl h-10 w-10 bg-primary hover:bg-primary/90 transition-all shrink-0 ml-2"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-white/20 uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> Shift + Enter for new line</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-primary/50" /> Powered by AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
