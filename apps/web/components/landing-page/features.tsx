"use client";

import { Zap, Layout, PenTool, Globe } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Instant Content Generation",
        description: "Generate high-quality, SEO-optimized blog posts in seconds based on your keywords."
    },
    {
        icon: Layout,
        title: "Beautiful Formatting",
        description: "Automatic formatting with headers, bullet points, and images that look great on any device."
    },
    {
        icon: PenTool,
        title: "Brand Voice Customization",
        description: "Train the AI to write in your specific tone and style to maintain brand consistency."
    },
    {
        icon: Globe,
        title: "One-Click Publishing",
        description: "Seamlessly publish your content to your CMS or export as markdown/HTML."
    }
];

export function Features() {
    return (
        <section className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 font-medium">Why use ScribeAI?</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Everything you need to scale your content marketing without increasing your headcount.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6 text-slate-900 icon-wrapper">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
