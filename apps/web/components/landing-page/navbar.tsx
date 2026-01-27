"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-black text-white p-1 rounded-md">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-xl tracking-tight">ScribeAI</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <Link href="#" className="hover:text-black transition-colors">Products</Link>
                <Link href="#" className="hover:text-black transition-colors">Pricing</Link>
                <Link href="#" className="hover:text-black transition-colors">Resources</Link>
                <Link href="#" className="hover:text-black transition-colors">Tools</Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <Link href="/chat">
                        <Button className="rounded-full px-6 bg-black text-white hover:bg-gray-800">
                            Go to App
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Button variant="ghost" className="text-gray-600 hover:text-black font-medium">
                            Sign in
                        </Button>
                        <Link href="/chat">
                            <Button className="rounded-full px-6 bg-black text-white hover:bg-gray-800 transition-all shadow-md hover:shadow-lg">
                                Start for free
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
