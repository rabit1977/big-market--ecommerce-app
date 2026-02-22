'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Tag, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserAvatar } from "../shared/user-avatar";

export function AdminNotifications({ user }: { user: any }) {
    const stats = useQuery(api.admin.getDailyDeltas);
    const [seenData, setSeenData] = useState<{ date: string; count: number }>({ date: "", count: 0 });
    
    // Load persisted seen stats from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("admin_seen_stats");
            if (stored) {
                setSeenData(JSON.parse(stored));
            }
        } catch (e) {
            // Ignore error
        }
    }, []);

    if (!stats) return <UserAvatar user={user} className="w-9 h-9" />;

    const todayString = new Date().toDateString();
    
    // Calculate how many notifications are "unread"
    let unreadCount = 0;
    const currentTotal = stats?.totalCount ?? 0;
    
    if (currentTotal > 0) {
        if (seenData.date === todayString) {
            unreadCount = Math.max(0, currentTotal - seenData.count);
        } else {
            // New day, show the full fresh count
            unreadCount = currentTotal;
        }
    }

    const hasNotifications = unreadCount > 0;

    const markAsRead = (open: boolean) => {
        if (!open) return;
        
        // When opening the dropdown, mark current total as seen for today
        const newSeenData = { date: todayString, count: currentTotal };
        setSeenData(newSeenData);
        try {
            localStorage.setItem("admin_seen_stats", JSON.stringify(newSeenData));
        } catch (e) {
            // Ignore error
        }
    };

    return (
        <DropdownMenu onOpenChange={markAsRead}>
            <DropdownMenuTrigger asChild>
                <button className="relative outline-none group">
                    <UserAvatar user={user} className="w-9 h-9 transition-transform group-hover:scale-105" />
                    <AnimatePresence>
                        {hasNotifications && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    transition: { repeat: Infinity, duration: 2 }
                                }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white border-2 border-background shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                >
                                { unreadCount > 99 ? '99+' : unreadCount }
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 glass-card border-white/20">
                <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Activity Today
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem asChild className="p-0">
                    <Link href="/admin/revenue" className="flex items-center justify-between gap-4 p-2 rounded-lg cursor-pointer focus:bg-primary/5 outline-none w-full hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-sm font-medium">Revenue</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-500">
                            {(stats?.revenueToday ?? 0).toLocaleString()} MKD
                        </span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="p-0 mt-1">
                    <Link href="/admin/users" className="flex items-center justify-between gap-4 p-2 rounded-lg cursor-pointer focus:bg-primary/5 outline-none w-full hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium">New Users</span>
                        </div>
                        <span className="text-sm font-bold text-blue-500">
                            +{stats?.newUsers ?? 0}
                        </span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="p-0 mt-1">
                    <Link href="/admin/listings" className="flex items-center justify-between gap-4 p-2 rounded-lg cursor-pointer focus:bg-primary/5 outline-none w-full hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <Tag className="w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-sm font-medium">New Listings</span>
                        </div>
                        <span className="text-sm font-bold text-orange-500">
                            +{stats?.newListings ?? 0}
                        </span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10 mt-1" />
                <div className="p-2">
                    <p className="text-[10px] text-center text-muted-foreground italic">
                        Updates automatically in real-time
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
