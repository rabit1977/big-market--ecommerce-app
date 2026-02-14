'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BadgeCheck,
    Briefcase,
    CheckCircle2,
    Clock,
    CreditCard,
    Globe,
    HelpCircle,
    LayoutDashboard,
    PieChart,
    ShieldCheck,
    Store
} from 'lucide-react';
import Link from 'next/link';

export default function PaymentsBillingPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="bg-muted/30 border-b border-border/50 py-12 md:py-16">
                <div className="container-wide">
                    <AppBreadcrumbs className="mb-6" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                            Payments & <span className="text-primary">Business Solutions</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Professional tools designed to scale your business. Learn about Premium memberships, professional branding, and secure billing.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        
                        {/* Elite Business Solutions */}
                        <section id="premium-benefits">
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <Briefcase className="w-8 h-8 text-primary" />
                                Premium Business Membership
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Transform your presence on Big Market. Move beyond standard listings and establish your brand as a market leader. Our Premium Membership provides a suite of professional tools designed to convert browsers into long-term loyal customers.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FeatureCard 
                                    icon={Store} 
                                    title="Custom Shop URL" 
                                    desc="Establish your home on Big Market with a personalized URL: bigmarket.com/your_company."
                                />
                                <FeatureCard 
                                    icon={BadgeCheck} 
                                    title="Verified Branding" 
                                    desc="Your company logo and brand name will be prominently displayed on every listing you post."
                                />
                                <FeatureCard 
                                    icon={LayoutDashboard} 
                                    title="Elite Inventory Tools" 
                                    desc="Manage a massive volume of up to 500 active listings simultaneously from a streamlined dashboard."
                                />
                                <FeatureCard 
                                    icon={PieChart} 
                                    title="Exclusive Analytics" 
                                    desc="Access detailed performance reports to understand customer interest and optimize your sales strategy."
                                />
                            </div>
                        </section>

                        {/* Integration Guide */}
                        <section id="activation" className="p-8 md:p-10 rounded-[2.5rem] bg-muted/30 border border-border/50">
                            <h2 className="text-2xl font-black mb-8">Becoming a Premium Partner</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Standard Registration</h4>
                                        <p className="text-sm text-muted-foreground">First, ensure you have a verified standard account. If you haven't registered yet, please complete the <Link href="/auth" className="text-primary font-semibold hover:underline">initial enrollment</Link>.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Upgrade to Premium</h4>
                                        <p className="text-sm text-muted-foreground">Navigate to your account dashboard and select <strong>"Upgrade to Premium"</strong>. Review the annual growth package and proceed to our secure checkout.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Brand Customization</h4>
                                        <p className="text-sm text-muted-foreground">Once activated, enter your <strong>Business Field</strong> settings. Upload your logo, define your company biography, and secure your custom business URL.</p>
                                    </div>
                                </div>
                            </div>
                            <Button asChild className="mt-10 rounded-2xl px-10 py-7 h-auto font-black text-lg bg-gradient-to-r from-primary to-blue-600 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                                <Link href="/premium">Get Started Now</Link>
                            </Button>
                        </section>

                        {/* Terms of Service Snippet */}
                        <section id="terms">
                            <h2 className="text-2xl font-black mb-6">Subscription Policies & Terms</h2>
                            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
                                <p>By enrolling in our Premium Membership, you acknowledge and agree to the following professional terms of service:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Eligibility:</strong> Services are strictly reserved for individuals and entities aged 18 and over.</li>
                                    <li><strong>Service Availability:</strong> We guarantee a 95% annual uptime for professional business tools, excluding scheduled maintenance and infrastructure upgrades.</li>
                                    <li><strong>Technology Requirements:</strong> For optimal performance, professional users must utilize modern browser technologies including enabled Cookies and JavaScript.</li>
                                    <li><strong>Billing & Refunds:</strong> Subscriptions are non-refundable upon activation. You may cancel your renewal at any time through your dashboard settings.</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Pricing Overview */}
                        <Card className="rounded-[2rem] border-primary/20 shadow-xl shadow-primary/5 bg-background relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <Briefcase className="w-12 h-12 text-primary/5" />
                            </div>
                            <CardHeader className="pb-0">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                                    Business Growth
                                </div>
                                <CardTitle className="text-2xl font-black">Professional Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-5xl font-black">490</span>
                                    <span className="text-lg font-bold text-muted-foreground">MKD/year</span>
                                    <span className="text-xs text-muted-foreground ml-1 font-semibold underline underline-offset-4 decoration-primary/30">+ VAT</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Inventory: 500 active listings</span>
                                    </li>
                                    <li className="flex gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Search presence: 100% indexed</span>
                                    </li>
                                    <li className="flex gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>Custom Business Page/URL</span>
                                    </li>
                                </ul>
                                <Button className="w-full rounded-xl font-bold h-12" asChild>
                                    <Link href="/premium">Upgrade Now</Link>
                                </Button>
                            </div>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="rounded-[2rem] border-border/50">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Secure Billing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Credit/Debit Card</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-black">Instant Activation</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Bank Transfer</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-black">Pro-Forma Invoice</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Need Help? */}
                        <div className="p-8 rounded-[2rem] bg-muted/20 border border-border/50 text-center">
                            <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                                <HelpCircle className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-bold mb-2">Billing Support</h4>
                            <p className="text-xs text-muted-foreground mb-6">Need a custom invoice or have questions about business plans?</p>
                            <Button variant="outline" className="w-full rounded-xl font-bold bg-background" asChild>
                                <Link href="/contact">Contact Support</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-3xl border border-border/50 bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );
}
