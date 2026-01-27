import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, History, Settings, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pastChats = [
        { id: "1", title: "Modern AI in 2026", date: "2h ago" },
        { id: "2", title: "Sustainable Tech Trends", date: "5h ago" },
        { id: "3", title: "The Future of Web Dev", date: "Yesterday" },
        { id: "4", title: "Productivity Hacks", date: "2 days ago" },
    ];

    return (
        <div className="w-[280px] h-full glass border-r border-white/5 flex flex-col hidden md:flex">
            <div className="p-4">
                <Button className="w-full justify-start gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white" variant="outline">
                    <Plus className="w-4 h-4" />
                    New Blog Draft
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
                <div className="px-2 py-2 text-xs font-semibold text-white/40 flex items-center gap-2">
                    <History className="w-3 h-3" />
                    PAST DRAFTS
                </div>
                {pastChats.map((chat) => (
                    <button
                        key={chat.id}
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex flex-col gap-0.5 group",
                            "hover:bg-white/5 text-white/70 hover:text-white"
                        )}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <MessageSquare className="w-3.5 h-3.5 text-white/30 group-hover:text-primary transition-colors" />
                            <span className="truncate">{chat.title}</span>
                        </div>
                        <span className="text-[10px] text-white/30 ml-5">{chat.date}</span>
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-white/5 space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors group">
                    <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                    Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Documentation
                </button>
            </div>
        </div>
    );
}
