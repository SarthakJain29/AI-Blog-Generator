"use client";

import { Sidebar } from "@/components/sidebar";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 bg-white">
                {children}
            </main>
        </div>
    );
}
