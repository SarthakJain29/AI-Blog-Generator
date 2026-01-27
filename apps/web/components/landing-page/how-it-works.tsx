"use client";

import { Sparkles, PenLine, UploadCloud } from "lucide-react";

const steps = [
    {
        icon: Sparkles,
        title: "1. Enter your topic",
        description: "Tell ScribeAI what you want to write about. Be as specific or broad as you like."
    },
    {
        icon: PenLine,
        title: "2. Generate & Edit",
        description: "Watch as our AI crafts a comprehensive draft. Regulate tone, style, and length with ease."
    },
    {
        icon: UploadCloud,
        title: "3. Publish Instantly",
        description: "Export to your favorite CMS or copy the formatted HTML directly to your clipboard."
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 font-medium">How it works</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        From idea to published article in three simple steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10" />

                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-lg flex items-center justify-center mb-8 relative z-10">
                                <step.icon className="w-10 h-10 text-slate-900" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
