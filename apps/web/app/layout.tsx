import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'AI Blog Generator | Create Content Effortlessly',
    description: 'A minimal, production-grade AI-powered blog generator with premium aesthetics.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} dark`}>
            <body className="font-inter whitespace-pre-wrap">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
