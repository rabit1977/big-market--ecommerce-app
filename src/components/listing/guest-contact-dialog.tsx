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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'convex/react';
import { CheckCircle2, Mail, Phone, Send, User, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

interface GuestContactDialogProps {
    listingId: string;
    sellerId: string;
    listingTitle: string;
    trigger?: React.ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function GuestContactDialog({ 
    listingId, 
    sellerId, 
    listingTitle,
    trigger,
    defaultOpen,
    onOpenChange 
}: GuestContactDialogProps) {
    const [open, setOpen] = useState(defaultOpen || false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Use the action we created
    const submitInquiry = useAction(api.inquiries.submit);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            message: `Hi, I'm interested in your listing "${listingTitle}". Is it still available?`,
        },
    });

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
        if (!newOpen) {
            // Reset state after close
            setTimeout(() => {
                setIsSuccess(false);
                form.reset();
            }, 300);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await submitInquiry({
                listingId: listingId as Id<"listings">,
                sellerId: sellerId,
                guestName: values.name,
                guestEmail: values.email,
                guestPhone: values.phone,
                message: values.message,
            });
            
            console.log("Inquiry submission result:", result);

            if (result && 'emailStatus' in result && result.emailStatus === 'failed') {
                 console.error("Email sending failed:", result);
                 toast.warning(`Email saved, but notification failed: ${result.reason}`);
            }

            setIsSuccess(true);
            toast.success("Email sent successfully!");
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send email. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="w-full gap-2 font-bold uppercase tracking-tight">
                        <Mail className="w-4 h-4" />
                        Send an Email
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-0 gap-0 border-0 rounded-3xl overflow-hidden bg-background shadow-2xl [&>button]:hidden">
                {/* Decorative Header */}
                <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
                    
                    <DialogHeader className="relative z-10 text-left space-y-2">
                        <DialogTitle className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                            {!isSuccess ? (
                                <>
                                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white/90" />
                                    Contact Seller
                                </>
                            ) : (
                                <>
                                    <div className="bg-white text-primary rounded-full p-1.5">
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    Sent!
                                </>
                            )}
                        </DialogTitle>
                    <DialogDescription className="text-white/80 font-medium text-sm sm:text-base">
                        {!isSuccess ? (
                            <span>Inquiry about <strong className="text-white border-b border-white/30">{listingTitle}</strong></span> 
                        ) : (
                            <span>Your email has been sent to the seller. Check your inbox for updates.</span>
                        )}
                    </DialogDescription>
                    </DialogHeader>

                     <button 
                        onClick={() => handleOpenChange(false)}
                        className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-foreground">Email Sent Successfully!</h3>
                            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
                                The seller has been notified via email. They will reply directly to your email address.
                            </p>
                        </div>
                        <Button 
                            onClick={() => handleOpenChange(false)} 
                            className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold h-12 rounded-xl"
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-5">
                            <div className="grid gap-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Input 
                                                        placeholder="Your Name" 
                                                        {...field} 
                                                        className="pl-12 h-14 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background hover:bg-muted/50 transition-all rounded-2xl font-medium placeholder:text-muted-foreground/50 shadow-sm" 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="pl-2" />
                                        </FormItem>
                                    )}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                     <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                        <Input 
                                                            placeholder="Email Address" 
                                                            {...field} 
                                                            className="pl-12 h-14 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background hover:bg-muted/50 transition-all rounded-2xl font-medium placeholder:text-muted-foreground/50 shadow-sm" 
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="pl-2" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                     <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                        <Input 
                                                            placeholder="Phone (Optional)" 
                                                            {...field} 
                                                            className="pl-12 h-14 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background hover:bg-muted/50 transition-all rounded-2xl font-medium placeholder:text-muted-foreground/50 shadow-sm" 
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="pl-2" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                     <Textarea 
                                                        placeholder="Write your message here..." 
                                                        className="min-h-[140px] p-5 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background hover:bg-muted/50 transition-all rounded-2xl font-medium placeholder:text-muted-foreground/50 shadow-sm resize-none" 
                                                        {...field} 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="pl-2" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    className="w-full bg-gradient-to-br from-primary to-primary/80 hover:to-primary text-white font-black uppercase tracking-tight h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Send Email
                                            <Send className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
