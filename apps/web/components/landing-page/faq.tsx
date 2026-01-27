"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does the AI generate content?",
        answer: "ScribeAI uses advanced large language models trained on high-quality blog posts. It analyzes your topic and keywords to create structured, engaging, and SEO-friendly articles."
    },
    {
        question: "Can I customize the tone of voice?",
        answer: "Yes! You can specify the desired tone (e.g., professional, casual, witty) before generating content. ScribeAI adapts its writing style to match your brand."
    },
    {
        question: "Is the content plagiarism-free?",
        answer: "Absolutely. ScribeAI generates unique content from scratch for every request. We recommend running a plagiarism check as a best practice, but our outputs are original."
    },
    {
        question: "Do you offer a free trial?",
        answer: "Yes, you can generate up to 3 blog posts for free to test the quality of our service. No credit card required."
    }
];

export function FAQ() {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 font-medium">Frequently asked questions</h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-100">
                            <AccordionTrigger className="text-left text-lg font-medium text-slate-900 hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed text-base pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
