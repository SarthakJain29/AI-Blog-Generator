import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";

export default function ChatPage() {
    return (
        <div className="flex h-screen w-full bg-[#0a0a0c] overflow-hidden text-zinc-100">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <ChatArea />
            </main>
        </div>
    );
}
