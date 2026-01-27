import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";

export default function Home() {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <ChatArea />
            </main>
        </div>
    );
}
