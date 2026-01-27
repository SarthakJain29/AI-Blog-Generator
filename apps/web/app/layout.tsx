import type { Metadata } from 'next';
import { Inter, Outfit, Playfair_Display } from 'next/font/google';
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

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
});

export const metadata: Metadata = {
    title: 'ScribeAI | The AI Blog Builder',
    description: 'Create engaging blog posts in seconds with AI.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} ${playfair.variable}`}>
            <body className="font-sans antialiased text-slate-900 bg-white selection:bg-black selection:text-white">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
