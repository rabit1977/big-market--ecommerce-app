'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

interface ReportModalProps {
    targetId: string;
    targetType: 'listing' | 'user' | 'review';
    children: ReactNode;
}

const REPORT_REASONS = [
    { value: 'SCAM', label: 'Fraud or Scam' },
    { value: 'DUPLICATE', label: 'Duplicate Listing' },
    { value: 'WRONG_CATEGORY', label: 'Wrong Category' },
    { value: 'OFFENSIVE', label: 'Offensive or Inappropriate Content' },
    { value: 'OTHER', label: 'Other' },
];

export function ReportModal({ targetId, targetType, children }: ReportModalProps) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitReport = useMutation(api.reports.submitReport);

    const handleSubmit = async () => {
        if (!session?.user?.id) {
            toast.error('You must be logged in to report items.');
            return;
        }
        if (!reason) {
            toast.error('Please select a reason.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitReport({
                reporterId: session.user.id,
                targetId,
                targetType,
                reason,
                description,
            });
            toast.success('Report submitted successfully. Thank you for keeping our community safe!');
            setOpen(false);
            setReason('');
            setDescription('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-full">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-black">Report Issue</DialogTitle>
                    </div>
                    <DialogDescription>
                        Help us keep the marketplace safe. What's wrong with this {targetType}?
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
                        {REPORT_REASONS.map((r) => (
                            <div key={r.value} className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg border border-transparent hover:border-border transition-colors">
                                <RadioGroupItem value={r.value} id={r.value} />
                                <Label htmlFor={r.value} className="cursor-pointer flex-1 font-medium">{r.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="space-y-2 mt-2">
                        <Label htmlFor="description" className="font-bold">Additional Details (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Help us understand the issue better by providing more context..."
                            className="resize-none h-24 rounded-xl bg-muted/50 focus:bg-background transition-colors"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl font-bold">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!reason || isSubmitting}
                        className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                        ) : (
                            'Submit Report'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
