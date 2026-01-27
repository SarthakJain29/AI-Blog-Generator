"use client";

const testimonials = [
    {
        quote: "ScribeAI has completely transformed our content strategy. We're publishing 3x more content with the same team.",
        author: "Sarah J.",
        role: "Content Manager at TechFlow",
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        quote: "The quality of the drafts is incredible. It captures our brand voice perfectly. Highly recommended!",
        author: "Michael C.",
        role: "Founder, GrowthEngine",
        avatar: "https://i.pravatar.cc/150?u=michael"
    },
    {
        quote: "I was skeptical about AI writers, but ScribeAI is on another level. It's like having a senior copywriter on demand.",
        author: "Elena R.",
        role: "Marketing Director",
        avatar: "https://i.pravatar.cc/150?u=elena"
    }
];

export function Testimonials() {
    return (
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 font-medium">Loved by content creators</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Join thousands of marketers and writers who trust ScribeAI.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                            <p className="text-slate-700 italic leading-relaxed mb-6 font-serif text-lg">"{t.quote}"</p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full bg-slate-200" />
                                <div>
                                    <div className="font-bold text-slate-900">{t.author}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
