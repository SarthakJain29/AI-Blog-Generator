import { Navbar } from "@/components/landing-page/navbar";
import { Hero } from "@/components/landing-page/hero";
import { Features } from "@/components/landing-page/features";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Testimonials } from "@/components/landing-page/testimonials";
import { FAQ } from "@/components/landing-page/faq";
import { Footer } from "@/components/landing-page/footer";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
