"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
    const [topic, setTopic] = useState("");
    const router = useRouter();

    const handleStart = () => {
        // In a real app, pass the topic to the onboarding or chat
        router.push("/chat");
    };

    return (
        <section className="flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center max-w-5xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-7xl font-serif text-slate-900 tracking-tight leading-[1.1]">
                The AI blog builder <br /> for small businesses
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl font-light">
                Create your blog and generate dozens of engaging posts in seconds.
            </p>

            <div className="w-full max-w-2xl relative group mt-8">
                <div className="absolute inset-0 bg-slate-200 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl p-2 pl-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
                    <input
                        type="text"
                        placeholder="What type of business are you building?"
                        className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 placeholder:text-slate-400 h-12"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    />
                    <Button
                        onClick={handleStart}
                        className="h-12 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2 text-base font-medium ml-2"
                    >
                        Start for free <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="pt-12 flex justify-center w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    
                </div>
            </div>
        </section>
    );
}
