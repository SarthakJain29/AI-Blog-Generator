import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-50 pt-24 pb-12 px-6 border-t border-slate-100">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-black text-white p-1 rounded-md">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-xl tracking-tight text-slate-900">ScribeAI</span>
                    </Link>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                        The AI-powered writing assistant for businesses and creators. Generate high-quality content in seconds.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-slate-900 mb-6">Product</h3>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-slate-900">Features</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">API</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Changelog</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-slate-900 mb-6">Resources</h3>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-slate-900">Blog</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Community</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Terms of Service</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-slate-900 mb-6">Company</h3>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-slate-900">About</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Careers</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Contact</Link></li>
                        <li><Link href="#" className="hover:text-slate-900">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                <div>&copy; {new Date().getFullYear()} ScribeAI Inc. All rights reserved.</div>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-slate-900">Twitter</Link>
                    <Link href="#" className="hover:text-slate-900">LinkedIn</Link>
                    <Link href="#" className="hover:text-slate-900">Github</Link>
                </div>
            </div>
        </footer>
    );
}
