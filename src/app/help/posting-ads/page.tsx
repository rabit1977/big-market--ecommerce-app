'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    ImagePlus,
    LayoutList,
    MessageCircle,
    PencilLine,
    Rocket,
    ShieldCheck,
    Timer,
    Zap
} from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function PostingAdsHelpPage() {
    const locale = useLocale();
    const isMk = locale === 'mk';

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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
                            <Zap className="w-4 h-4" />
                            {isMk ? 'Водич за продавачи' : 'Seller Guide'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                            {isMk ? 'Објавување и ' : 'Posting & '} <span className="text-primary">{isMk ? 'Управување ' : 'Managing '}</span> {isMk ? 'со огласи' : 'Ads'}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            {isMk 
                                ? 'Сè што треба да знаете за креирање професионални огласи, досегнување повеќе купувачи и управување со вашата продавница.'
                                : 'Everything you need to know about creating professional listings, reaching more buyers, and managing your shop on Biggest Market.'}
                        </p>
                    </motion.div>
                </div>
                
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* 1. Creating a Listing */}
                        <section id="creating" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <ImagePlus className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight flex flex-col gap-1">
                                    {isMk ? 'Креирање на вашиот оглас' : 'Creating Your Listing'}
                                </h2>
                            </div>
                            
                            <div className="grid gap-6">
                                <Card className="border-border/50 shadow-sm overflow-hidden hover:border-primary/30 transition-colors">
                                    <CardHeader className="bg-muted/30 border-b border-border/50">
                                        <CardTitle className="text-xl">{isMk ? 'Стратегија за содржина' : 'Content Strategy'}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex gap-6 items-start">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                <Timer className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-bold">{isMk ? 'Ефективни наслови' : 'Effective Titles'}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {isMk ? 'Користете јасни, концизни наслови кои прецизно го опишуваат предметот. Вклучете го брендот, моделот и клучната состојба.' : 'Use clear, concise titles that accurately describe the item. Include the brand, model, and key condition (e.g., "iPhone 15 Pro - 256GB - Perfect Condition"). Avoid excessive capitalization or "spammy" keywords.'}
                                                </p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex gap-6 items-start">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                <PencilLine className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-bold">{isMk ? 'Детални описи' : 'Detailed Descriptions'}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {isMk ? 'Транспарентноста гради доверба. Наведете технички спецификации, историја на користење и какви било постоечки дефекти.' : 'Transparency builds trust. Outline technical specifications, usage history, and any existing defects. Well-formatted, bulleted descriptions lead to 40% higher conversion rates.'}
                                                </p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex gap-6 items-start">
                                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                                <ImagePlus className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-bold">{isMk ? 'Визуелна извонредност' : 'Visual Excellence'}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {isMk ? 'Фотографијата со висока резолуција е задолжителна. Примарната слика мора да биде од вистинскиот предмет.' : 'High-resolution photography is mandatory. Use natural lighting and multiple angles. Stock photos are permitted only as secondary references; the primary image must be of the actual item.'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* 2. Management & Renewals */}
                        <section id="management" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <LayoutList className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight flex flex-col gap-1">
                                    {isMk ? 'Активно управување' : 'Active Management'}
                                </h2>
                            </div>
                            
                            <div className="bg-card border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-sm">
                                <div className="max-w-xl space-y-6">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {isMk ? 'Управувањето со вашиот инвентар на Biggest Market е рационализирано преку вашата професионална контролна табла. Одржувањето на вашите огласи ажурирани обезбедува подобро искуство за купувачите и повисоко рангирање за вас.' : 'Managing your inventory on Biggest Market is streamlined through your professional dashboard. Keeping your listings current ensures a better experience for buyers and higher rankings for you.'}
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 group hover:border-primary/30 transition-all flex-col sm:flex-row sm:items-center items-start text-left">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                            <span className="font-bold text-sm">
                                                {isMk ? 'Ажурирања на статусот во реално време (Продадено, Резервирано, Активно)' : 'Real-time status updates (Sold, Reserved, Active)'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 group hover:border-primary/30 transition-all flex-col sm:flex-row sm:items-center items-start text-left">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                            <span className="font-bold text-sm">
                                                {isMk ? 'Инстантно уредување на цените и спецификациите' : 'Instant editing of pricing and specifications'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 group hover:border-primary/30 transition-all flex-col sm:flex-row sm:items-center items-start text-left">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                            <span className="font-bold text-sm">
                                                {isMk ? 'Автоматски предупредувања за истекување преку е-пошта' : 'Automatic expiration alerts via email'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <Button className="rounded-full px-8 font-bold" asChild>
                                            <Link href="/my-listings">{isMk ? 'Одете во Мои огласи' : 'Go to My Listings'}</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Boosting Visibility */}
                        <section id="promotions" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                    <Rocket className="w-6 h-6 text-amber-600" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight flex flex-col gap-1">
                                    {isMk ? 'Зголемување на видливоста' : 'Maximizing Visibility'}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-primary" />
                                            {isMk ? 'Промоции' : 'Promotions'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                        {isMk ? 'Промовираните огласи добиваат до 10 пати повеќе прегледи. Изберете од поставување на почетната страница, врвно позиционирање или истакнување во категорија.' : 'Promoted ads receive up to **10x more views**. Choose from Homepage placement, Top Positioning, or Category highlighting. All boosts are active for 14 days.'}
                                    </CardContent>
                                </Card>
                                <Card className="border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                            <ShieldCheck className="w-5 h-5" />
                                            {isMk ? 'Статус на профил' : 'Account Status'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                        {isMk ? 'Верификуваните корисници и деловните сметки добиваат приоритет во резултатите од пребарувањето.' : 'Verified users and Business accounts receive priority in search results. The **Verified Badge** significantly increases user confidence and response rates.'}
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Suggestions (Right) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Prohibited Items Quick Link */}
                            <Card className="border-red-500/20 shadow-lg shadow-red-500/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex flex-col gap-1 text-red-600">
                                        <div className="flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {isMk ? 'Правила за фер игра' : 'Fair Play Rules'}</div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {isMk ? 'За одржување на професионална средина, многу предмети и практики се ограничени.' : 'To maintain a professional environment, many items and practices are restricted.'}
                                    </p>
                                    <ul className="text-xs space-y-2 font-bold text-muted-foreground">
                                        <li className="flex gap-2">
                                            <ArrowRight className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                                            <span>{isMk ? 'Без дупликат огласи' : 'No duplicate listings'}</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <ArrowRight className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                                            <span>{isMk ? 'Без забранети предмети' : 'No prohibited items'}</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <ArrowRight className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                                            <span>{isMk ? 'Без надворешни линкови' : 'No external website links'}</span>
                                        </li>
                                    </ul>
                                    <Button variant="outline" className="w-full text-xs font-bold border-red-200 hover:bg-red-50 rounded-xl" asChild>
                                        <Link href="/help/terms#prohibited">{isMk ? 'Види ги сите правила' : 'View All Rules'}</Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Verification Call to Action */}
                            <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <h3 className="text-xl font-black italic">{isMk ? 'Сертифицирајте се.' : 'Get Certified.'}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {isMk ? 'Потребна е верификација за да управувате со вашите огласи. Изградете доверба во заедницата денес.' : 'Verification is required for listing management. Establish trust within the Biggest Market community today.'}
                                    </p>
                                    <Button variant="secondary" className="w-full font-bold rounded-xl" asChild>
                                        <Link href="/account/verification">{isMk ? 'Аплицирајте сега' : 'Apply Now'}</Link>
                                    </Button>
                                </div>
                                <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                            </div>

                            {/* Need Help? Box */}
                            <div className="bg-muted/50 rounded-[2rem] p-8 border border-border/50 text-center">
                                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-4 border border-border/50">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="font-black mb-2">{isMk ? 'Ви треба помош?' : 'Still need help?'}</h4>
                                <p className="text-xs text-muted-foreground mb-6">
                                    {isMk ? 'Нашите специјалисти можат да ви помогнат.' : 'Our shop specialists can assist with your listing strategy.'}
                                </p>
                                <Link href="/contact" className="text-xs font-bold text-primary hover:underline">
                                    {isMk ? 'Контактирајте нè' : 'Contact Specialist'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
