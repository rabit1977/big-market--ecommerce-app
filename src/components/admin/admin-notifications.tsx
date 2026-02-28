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
                                    scale: [1, 1.1, 1],
                                }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-lg bg-red-600 px-1.5 text-[10px] font-bold text-white border-2 border-background shadow-none"
                                >
                                { unreadCount > 99 ? '99+' : unreadCount }
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-1.5 bg-card border-border shadow-none rounded-lg z-50">
                <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Activity Today
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border mx-1" />
                
                <DropdownMenuItem asChild className="p-0">
                    <Link href="/admin/revenue" className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer focus:bg-secondary outline-none w-full hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <CreditCard className="w-4.5 h-4.5 text-emerald-500" />
                            </div>
                            <span className="text-sm font-bold">Revenue</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-500">
                            {(stats?.revenueToday ?? 0).toLocaleString()} MKD
                        </span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="p-0 mt-0.5">
                    <Link href="/admin/users" className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer focus:bg-secondary outline-none w-full hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Users className="w-4.5 h-4.5 text-blue-500" />
                            </div>
                            <span className="text-sm font-bold">New Users</span>
                        </div>
                        <span className="text-sm font-bold text-blue-500">
                            +{stats?.newUsers ?? 0}
                        </span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="p-0 mt-0.5">
                    <Link href="/admin/listings" className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer focus:bg-secondary outline-none w-full hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                <Tag className="w-4.5 h-4.5 text-orange-500" />
                            </div>
                            <span className="text-sm font-bold">New Listings</span>
                        </div>
                        <span className="text-sm font-bold text-orange-500">
                            +{stats?.newListings ?? 0}
                        </span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border mt-1 mx-1" />
                <div className="py-2 px-3">
                    <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                        Real-time updates active
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
