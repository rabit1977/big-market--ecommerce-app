'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/60 bg-muted/10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold">All caught up!</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-2">
                    There are no pending user reports in the moderation queue.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl border border-border/60 overflow-hidden shadow-sm animate-in fade-in duration-500">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/30">
                                <TableHead className="w-[200px]">Reporter</TableHead>
                                <TableHead className="w-[300px]">Target Item</TableHead>
                                <TableHead>Reason & Details</TableHead>
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead className="text-right w-[200px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report._id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8 border border-border">
                                                <AvatarImage src={report.reporter?.image} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                    {report.reporter?.name?.slice(0, 2).toUpperCase() || 'R'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-sm text-foreground truncate">
                                                    {report.reporter?.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground truncate">
                                                    {report.reporterId}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="shrink-0 uppercase text-[10px] font-black border-primary/20 bg-primary/5 text-primary">
                                                {report.targetType}
                                            </Badge>
                                            {report.targetType === 'listing' && report.target ? (
                                                <Link href={`/listings/${report.target.id}`} className="flex items-center gap-2 hover:bg-muted p-1 rounded-md transition-colors min-w-0">
                                                    {report.target.image && (
                                                        <div className="w-8 h-8 relative rounded overflow-hidden shrink-0">
                                                            <Image src={report.target.image} alt="Target" fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-medium hover:underline truncate group-hover:text-primary transition-colors flex items-center gap-1">
                                                        {report.target.title} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                                                    </span>
                                                </Link>
                                            ) : report.targetType === 'user' && report.target ? (
                                                <Link href={`/store/${report.target.id}`} className="flex items-center gap-2 hover:bg-muted p-1 rounded-md transition-colors min-w-0">
                                                    <span className="text-sm font-medium hover:underline truncate group-hover:text-primary transition-colors flex items-center gap-1">
                                                        {report.target.name || report.target.email} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                                                    </span>
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-muted-foreground font-mono truncate">{report.targetId}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-start gap-1 w-[250px] lg:w-[350px]">
                                             <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 font-bold tracking-tight rounded-sm">
                                                {report.reason.replace(/_/g, ' ')}
                                            </Badge>
                                            {report.description ? (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 bg-muted/40 p-2 rounded-md border border-border/50 text-wrap break-words w-full">
                                                    "{report.description}"
                                                </p>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground/60 italic mt-1">No additional details provided</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-xs text-foreground whitespace-nowrap">
                                                {format(new Date(report.createdAt), "MMM d, yyyy")}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {format(new Date(report.createdAt), "h:mm a")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 text-[11px] font-bold"
                                                disabled={processingId === report._id}
                                                onClick={() => handleDismiss(report._id)}
                                            >
                                                Dismiss
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="default"
                                                className="h-8 text-[11px] font-bold bg-destructive hover:bg-destructive/90 text-white shadow-sm"
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
