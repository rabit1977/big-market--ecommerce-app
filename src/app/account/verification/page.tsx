'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery } from 'convex/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    ShieldCheck,
    Upload,
    XCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function VerificationPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    
    const user = useQuery(api.users.getByExternalId, { externalId: userId });
    const request = useQuery(api.verification.getRequest, { userId });
    const submitRequest = useMutation(api.verification.submit);

    const [fileUrl, setFileUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleUpload = () => {
        // Mock upload
        setFileUrl('https://example.com/id-doc.jpg');
        toast.success("Document uploaded successfully");
    };

    const handleSubmit = async () => {
        if (!fileUrl) {
            toast.error("Please upload a document first");
            return;
        }
        setSubmitting(true);
        try {
            await submitRequest({
                userId,
                idDocument: fileUrl
            });
            toast.success("Verification request submitted!");
        } catch (err: any) {
            toast.error(err.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-muted/10">
            <div className="container max-w-2xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900">Account Verification</h1>
                </div>

                {user.isVerified ? (
                    <Card className="border-green-500/20 bg-green-500/5 overflow-hidden rounded-3xl">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-green-700">You are Verified!</CardTitle>
                            <CardDescription className="text-green-600/80">
                                Your identity has been confirmed. You now have full access to all classifieds features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center pb-8 pt-4">
                             <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                                 <ShieldCheck className="w-4 h-4" />
                                 Verified Member
                             </div>
                        </CardContent>
                    </Card>
                ) : request && request.status === "PENDING" ? (
                    <Card className="border-amber-500/20 bg-amber-500/5 rounded-3xl">
                         <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-500/20">
                                <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-amber-700">Verification Pending</CardTitle>
                            <CardDescription className="text-amber-600/80">
                                We've received your document and it's currently under review. This usually takes 24-48 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="bg-white/50 border rounded-2xl p-4 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <FileText className="w-5 h-5 text-muted-foreground" />
                                     <div>
                                         <p className="text-sm font-bold">Document Submitted</p>
                                         <p className="text-xs text-muted-foreground">ID_Document_Photo.jpg</p>
                                     </div>
                                 </div>
                                 <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">In Review</Badge>
                             </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {request && request.status === "REJECTED" && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-2xl flex items-start gap-3">
                                <XCircle className="w-5 h-5 mt-0.5" />
                                <div>
                                    <p className="font-bold">Verification Request Rejected</p>
                                    <p className="text-sm opacity-90">{request.notes || "The document provided was not clear or did not match our requirements. Please try again."}</p>
                                </div>
                            </div>
                        )}

                        <Card className="border-slate-200 rounded-3xl">
                            <CardHeader>
                                <CardTitle>Identity Verification</CardTitle>
                                <CardDescription>
                                    Upload a clear photo of your ID Card or Driver's License to become a verified seller.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:bg-slate-100/50 transition-colors cursor-pointer" onClick={handleUpload}>
                                         <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-primary transition-colors" />
                                         <p className="text-sm font-bold text-slate-900">Front Side</p>
                                         <p className="text-xs text-slate-500 mt-1">Click to upload</p>
                                         {fileUrl && <Badge className="mt-4 bg-green-600 hover:bg-green-700">Selected</Badge>}
                                     </div>
                                     <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group">
                                         <Upload className="w-10 h-10 text-slate-400 mb-3" />
                                         <p className="text-sm font-bold text-slate-900">Back Side</p>
                                         <p className="text-xs text-slate-500 mt-1">Optional</p>
                                     </div>
                                </div>

                                <div className="space-y-5">
                                     <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                         <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                         <p>Make sure the photo is well-lit and all information is readable. We protect your data according to our privacy policy.</p>
                                     </div>
                                     <Button className="w-full py-7 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20" disabled={!fileUrl || submitting} onClick={handleSubmit}>
                                         {submitting ? "Submitting Request..." : "Submit for Verification"}
                                     </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
