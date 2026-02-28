'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle, Loader2, ShieldBan } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function AdminReportsClient() {
    const { data: session } = useSession();
    const reports = useQuery(api.reports.getPendingReports);
    const resolveReport = useMutation(api.reports.resolveReport);
    
    // We can also let the admin delete the listing/user right from here if needed
    // const deleteListing = useMutation(api.listings.remove); 
    
    const [processingId, setProcessingId] = useState<Id<"reports"> | null>(null);

    const handleDismiss = async (id: Id<"reports">) => {
        if (!session?.user?.id) return;
        setProcessingId(id);
        try {
            await resolveReport({
                reportId: id,
                action: 'DISMISSED',
                resolvedBy: session.user.id
            });
            toast.success("Report dismissed.");
        } catch (error) {
            toast.error("Failed to dismiss report.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleActionTaken = async (id: Id<"reports">) => {
         if (!session?.user?.id) return;
        setProcessingId(id);
        try {
            await resolveReport({
                reportId: id,
                action: 'RESOLVED',
                resolvedBy: session.user.id
            });
            toast.success("Report marked as resolved.");
        } catch (error) {
            toast.error("Failed to resolve report.");
        } finally {
            setProcessingId(null);
        }
    };

    if (reports === undefined) {
        return (
            <div className="flex justify-center p-20 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-border bg-muted/10">
                <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mb-4 border border-border">
                    <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold">All caught up!</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-2 font-medium">
                    There are no pending user reports in the moderation queue.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-border overflow-hidden shadow-none bg-card animate-in fade-in duration-500">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border bg-muted/30">
                                <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest">Reporter</TableHead>
                                <TableHead className="w-[300px] text-[10px] font-bold uppercase tracking-widest">Target Item</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Reason & Details</TableHead>
                                <TableHead className="w-[120px] text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
                                <TableHead className="text-right w-[200px] text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report._id} className="group border-border hover:bg-secondary/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8 border border-border rounded-lg">
                                                <AvatarImage src={report.reporter?.image} className="rounded-lg" />
                                                <AvatarFallback className="bg-secondary text-foreground text-[10px] font-bold rounded-lg border border-border">
                                                    {report.reporter?.name?.slice(0, 2).toUpperCase() || 'R'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-sm text-foreground truncate">
                                                    {report.reporter?.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground truncate font-medium">
                                                    {report.reporterId}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="px-2 py-0.5 rounded-lg bg-secondary text-primary text-[10px] font-bold border border-border uppercase tracking-widest">
                                                {report.targetType}
                                            </div>
                                            {report.targetType === 'listing' && report.target ? (
                                                <Link href={`/listings/${report.target.id}`} className="flex items-center gap-2 hover:bg-secondary p-1 rounded-lg transition-colors min-w-0 border border-transparent hover:border-border">
                                                    {report.target.image && (
                                                        <div className="w-8 h-8 relative rounded-lg overflow-hidden shrink-0 border border-border">
                                                            <Image src={report.target.image} alt="Target" fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-bold truncate group-hover:text-primary transition-colors flex items-center gap-1">
                                                        {report.target.title} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                                                    </span>
                                                </Link>
                                            ) : report.targetType === 'user' && report.target ? (
                                                <Link href={`/store/${report.target.id}`} className="flex items-center gap-2 hover:bg-secondary p-1 rounded-lg transition-colors min-w-0 border border-transparent hover:border-border">
                                                    <span className="text-sm font-bold truncate group-hover:text-primary transition-colors flex items-center gap-1">
                                                        {report.target.name || report.target.email} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                                                    </span>
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-muted-foreground font-bold truncate">{report.targetId}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-start gap-1 w-[250px] lg:w-[350px]">
                                             <div className="px-2 py-0.5 rounded-lg bg-destructive/10 text-destructive text-[10px] font-bold border border-destructive/20 uppercase tracking-widest">
                                                {report.reason.replace(/_/g, ' ')}
                                            </div>
                                            {report.description ? (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 bg-secondary/30 p-2 rounded-lg border border-border font-medium w-full">
                                                    "{report.description}"
                                                </p>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground/60 font-medium mt-1 uppercase tracking-widest">No details</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs text-foreground whitespace-nowrap">
                                                {format(new Date(report.createdAt), "MMM d, yyyy")}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-medium">
                                                {format(new Date(report.createdAt), "h:mm a")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 text-[11px] font-bold rounded-lg"
                                                disabled={processingId === report._id}
                                                onClick={() => handleDismiss(report._id)}
                                            >
                                                Dismiss
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="destructive"
                                                className="h-8 text-[11px] font-bold rounded-lg shadow-none"
                                                disabled={processingId === report._id}
                                                onClick={() => handleActionTaken(report._id)}
                                            >
                                                {processingId === report._id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                                ) : (
                                                    <ShieldBan className="w-3.5 h-3.5 mr-1.5" />
                                                )}
                                                Resolve
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
