'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    HelpCircle,
    KeyRound,
    LayoutList,
    Mail,
    MessageCircle,
    Search,
    Settings,
    ShieldCheck,
    Slack,
    Timer
} from 'lucide-react';
import Link from 'next/link';

const faqs = [
    {
        id: 'contact',
        icon: Mail,
        color: 'text-blue-600',
        bgColor: 'bg-blue-600/10',
        q: 'How do I establish contact with a seller?',
        mk_q: 'Како да воспоставам контакт со понудувачот?',
        a: "We provide a secure communication channel through our integrated email form, located adjacent to every listing. Once you initiate contact, the seller's direct email will be available in their response for further communication. Many sellers also choose to provide a direct telephone number for immediate inquiries.",
    },
    {
        id: 'editing',
        icon: LayoutList,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-600/10',
        q: 'How can I modify or edit my listing?',
        mk_q: 'Како можам да го променам огласот?',
        a: "All listing attributes—including title, price, description, and imagery—are fully editable. Registered members can manage their ads directly via the 'My Listings' dashboard. For non-members, a unique modification link is included in the confirmation email sent upon publication.",
    },
    {
        id: 'profile',
        icon: Settings,
        color: 'text-purple-600',
        bgColor: 'bg-purple-600/10',
        q: 'How do I update my profile details?',
        mk_q: 'Уредување на профилот',
        a: "You can manage your account credentials and personal details through the 'Profile Settings' section. To ensure platform integrity, please ensure your address information is complete and accurate, as the system may restrict access to accounts with incomplete logistics data.",
    },
    {
        id: 'duration',
        icon: Timer,
        color: 'text-amber-600',
        bgColor: 'bg-amber-600/10',
        q: 'How long does a listing remain active?',
        mk_q: 'Колку долго огласот останува онлајн?',
        a: "Standard listings remain active for a 90-day cycle. Within this period, you have the option to extend the listing for another 90 days. You may also deactivate or permanently remove your ad at any time once the item is no longer available.",
    },
    {
        id: 'bump',
        icon: Slack,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        q: 'How can I "bump" my ad to the top?',
        mk_q: 'Како мојот оглас да стои најгоре?',
        a: "The 'Daily Bump' feature allows you to update your listing to the current date. This repositioning ensures your ad appears at the top of search results, similar to a newly published listing, significantly increasing its visibility.",
    },
    {
        id: 'password',
        icon: KeyRound,
        color: 'text-slate-600',
        bgColor: 'bg-slate-600/10',
        q: 'I forgot my password, what should I do?',
        mk_q: 'Ја заборавив мојата лозинка',
        a: "Utilize the 'Forgot Password' link on the login page. Enter your registered email address, and we will dispatch a secure reset link. For security reasons, we recommend updating your password to a complex string following recovery.",
    },
    {
        id: 'missing',
        icon: Search,
        color: 'text-red-600',
        bgColor: 'bg-red-600/10',
        q: 'Where is my ad? I cannot find it on the site.',
        mk_q: 'Каде е мојот оглас?',
        a: "If your ad is not visible, it may be undergoing mandatory administrative review (up to 24 hours). Alternatively, it may have been removed for policy violations (duplicates/prohibited content), categorized incorrectly by the system, or simply expired after the 90-day limit.",
    }
];

export default function FAQHelpPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="bg-muted/30 border-b border-border/50 py-12 md:py-20 relative overflow-hidden">
                <div className="container-wide relative z-10">
                    <AppBreadcrumbs className="mb-6" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
                            <HelpCircle className="w-4 h-4" />
                            Knowledge Base
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                            Questions & <span className="text-primary">Answers</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            Find answers to the most common inquiries regarding listing management, security, and account operations on Biggest Market.
                        </p>
                    </motion.div>
                </div>
                
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-8">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={faq.id}
                                id={faq.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="scroll-mt-24"
                            >
                                <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all overflow-hidden group">
                                    <CardHeader className="flex flex-row items-center gap-5 p-6 md:p-8">
                                        <div className={`w-12 h-12 rounded-2xl ${faq.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <faq.icon className={`w-6 h-6 ${faq.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight leading-tight">{faq.q}</h3>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-70">
                                                {faq.mk_q}
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-8 md:px-8 md:pb-10 pt-0">
                                        <div className="pl-0 md:pl-[68px]">
                                            <p className="text-muted-foreground leading-relaxed text-[15px]">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar / Quick Navigation (Right) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Navigation Card */}
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">In This Category</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1">
                                    {faqs.map((faq) => (
                                        <a 
                                            key={faq.id}
                                            href={`#${faq.id}`}
                                            className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                                        >
                                            <span className="truncate">{faq.q}</span>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-all font-black" />
                                        </a>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Trust Badge Callout */}
                            <div className="p-8 rounded-[2rem] bg-slate-900 shadow-xl shadow-slate-900/10 text-white relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black italic">Verified Profiles.</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Verified users receive priority support and higher listing quotas.
                                    </p>
                                    <Button variant="secondary" className="w-full font-bold rounded-xl" asChild>
                                        <Link href="/help/certification">Learn About Certification</Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Still Need Help? */}
                            <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/20 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-black mb-2">Still need help?</h4>
                                <p className="text-xs text-muted-foreground mb-6">
                                    Can't find what you're looking for? Reach out to our specialist team.
                                </p>
                                <Button size="sm" variant="default" className="rounded-full px-6 font-black" asChild>
                                    <Link href="/contact">Message Support</Link>
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
