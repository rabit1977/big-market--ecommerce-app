'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    BadgeCheck,
    Briefcase,
    CheckCircle2,
    CreditCard,
    Globe,
    HelpCircle,
    LayoutDashboard,
    PieChart,
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
                                Transform your presence on Biggest Market. Move beyond standard listings and establish your brand as a market leader. Our Premium Membership provides a suite of professional tools designed to convert browsers into long-term loyal customers.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FeatureCard 
                                    icon={Store} 
                                    title="Custom Shop URL" 
                                    desc="Establish your home on Biggest Market with a personalized URL: bigmarket.com/your_company."
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

                        {/* Terms of Service Section */}
                        <section id="terms">
                            <h2 className="text-2xl font-black mb-6">Rules & Terms / Правила и Услови</h2>
                            <div className="bg-muted/30 rounded-[2rem] border border-border/50 overflow-hidden">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="privacy" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Privacy Policy & Data Protection / Заштита на лични податоци</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            Заштитата на личните податоци и нивната системска сигурност претставуваат фундаментален столб во работењето на Биг Маркет. Нашата платформа применува строги протоколи за заштита на приватноста, обезбедувајќи интегритет на секоја информација споделена од нашите корисници.

                                            Со креирање на професионален профил на Biggest Market, вие овластувате безбедно собирање и обработка на податоци неопходни за функционирање на вашите услуги. Процесот на верификација на профилот претставува потврда за вашата согласност со овие политики.

                                            Тие податоци се:
                                            - Име и Презиме
                                            - E-маил адреса
                                            - Телефон за контакт
                                            - Локација
                                            - Податоци на огласот
                                            - ИП адреса

                                            Податоците кои ги собираме, се чуваат кај нас во согласност со прописите за заштита на личните податоци.
                                            За подетални информации посетете ја веб страницата Дирекцијата за заштита на лични податоци на Р.С.Македонија dzlp.mk.

                                            Вашите лични податоци се користат исклучиво за овозможување на нашите услуги и подобрување на истите. Личните податоци нема да бидат откриени без ваша согласност на трети лица. Обработка на Вашите лични податоци за друга цел, може да се врши врз основа на Ваша претходна писмена согласност. Од наша страна се користат соодветни технички безбедносни мерки за да ги заштитиме Вашите податоци доставени до нас. Нашите безбедносни мерки постојано се унапредуваат во согласност со технолошкиот развој, но сепак не може во целост да се гарантира дека безбедносните мерки ќе спречат трети лица од нелегална употреба на истите. Од тие причини доколку имате сознанија за такво нешто, Ве молиме веднаш да не известите како би можеле соодветно да реагираме.

                                            Во секој момент Вие може да извршите промена, ажурирање, корекција или целосно отстранување на Вашите лични податоци и информации, со соодветно барање доставено до нашата компанија.

                                            Плаќање со платежни картички се врши со податоци кои поради безбедност при комуникацијата преку интернет се шифрираат со користење посебен SSL (Secure Socket Layer) протокол.

                                            Од безбедносни причини, вашата IP адреса се евидентира во нашиот мониторинг систем. Во случај на индиции за измама или злоупотреба, овие податоци ќе бидат доставени до релевантните државни органи. Биг Маркет одржува активна и транспарентна соработка со сите истражни институции.

                                            Согласно законските регулативи во Р.С. Македонија, информациите се архивираат во период до една година по деактивација на профилот, по што се подложени на автоматско трајно бришење.

                                            Пред истекот на овој рок, податоците можат да бидат избришани, врз основа на ваше писмено барање, со тоа што сите евентуално одговорности поради тоа ќе паднат на Ваш товар, односно нашата компанија нема да ги сони последиците кои евентуално можат да произлезат од Вашето барање.

                                            Со поднесување на вашите податоци за употреба, вие се согласувате за ваквото складирање на податоци и трансфер на истите према трети лица, по ваше барање. При тоа се превземаат сите соодветни мерки со цел обезбедување и заштита на вашите лични податоци во согласност со законските прописи. Податоците ќе бидат складирани на посебни безбедносни сервери и истите ќе бидат соодветно криптирани за поголема безбедност.

                                            При тоа напоменуваме дека електронските преноси на информации не се целосно безбедни и не можеме да гарантираме целосна заштита и безбедност на истите. Нашата компанија гарантира дека ќе ги превземе сите неопходни мерки за заштита на податоците кои ги добиваме по електронски пат.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="registration" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Registration & Verification / Регистрација и Верификација</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            Biggest Market овозможува пристап до напредна онлајн инфраструктура за тргување. Интеракцијата со платформата подразбира прифаќање на утврдените технички норми и ценовници. Нашата услуга гарантира висок степен на достапност од 90% на годишно ниво, со исклучок на планирани периоди за оптимизација и надворешни технички фактори.

                                            За оптимално искуство, препорачуваме користење на современи пребарувачки технологии (JavaScript, Cookies, Pop-up овозможување).

                                            Верификацијата на профилот е задолжителен безбедносен чекор за сите корисници. Верификуваните партнери добиваат право на управување до 50 активни огласи годишно. Надоместокот за верификација изнесува 98 ден + ДДВ (116 ден.) во времетраење од 12 месеци.

                                            Од страна на нашата компанија во согласност со законот за заштита на лични податоци, ќе бидат применети сите технички и организациски мерки за заштита од случајно или незаконско уништување на личните податоци.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="auth-tech" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Social Login & Tech / Најава и Технологија</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            Функцијата Social Login служи за поедноставена и безбедна автентикација на корисниците преку Google, Facebook или Apple. Трансферот на податоци зависи од вашите поставки кај третиот провајдер.

                                            Согласно Законот за заштита на личните податоци, со активирање на полето за согласност (checkbox), дозволувате вчитување на содржини од надворешни платформи (YouTube, TikTok, Facebook и Instagram). Со овој чин, вашата IP-адреса и технички податоци се пренесуваат до соодветните даватели.

                                            Ние користиме мапи од OpenStreetMap (Leaflet) и Google Maps. Вашата IP-адреса може да се пренесе до серверите на OpenStreetMap и Google за прикажување на мапските податоци.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="cookies" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Cookie Policy / Политика на колачиња (Cookies)</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            За оптимизација на корисничкиот интерфејс и непречена функционалност на Биг Маркет, користиме технологија на „колачиња“ (Cookies). Овие анонимни текстуални податоци не ги компромитираат вашите лични информации и можат лесно да се конфигурираат преку вашиот веб-пребарувач.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="marketing" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Marketing & Communication / Маркетинг и Комуникација</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            Биг Маркет спроведува директни маркетинг активности исклучиво врз основа на ваша прецизна согласност. Корисниците имаат постојана контрола и опција за итна деактивација на известувањата во секое време.

                                            Потенцираме дека Biggest Market не толерира генерирање на спам или несоодветна масовна содржина.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="prohibited" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Prohibited Content / Недопуштени содржини</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            Oсобено е недопуштиво да се даваат огласи со следнава содржина:
                                            - Рекламирање на други интернет страници и фирми.
                                            - Несериозни понуди за работа.
                                            - Игри на среќа, кредити и заеми без целосен податок.
                                            - Инвестиции, хартии од вредност, акции.
                                            - Навредливи, расистички или порнографски содржини.
                                            - Понуди за проституција.
                                            
                                            Недопуштени предмети: украдени предмети, дроги, радиоактивни супстанци, оружје, лекови на рецепт, човечки органи.
                                            
                                            Огласот се дава само еднаш и само на една локација. Повеќекратно давање оглас со идентична содржина не е дозволено.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="responsibility-security" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Responsibility & Security / Одговорност и Безбедност</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            Корисниците преземаат правна и етичка одговорност за вистинитоста на внесените податоци. Сигурноста на лозинката е обврска на корисникот.

                                            Минималната старосна граница за користење на Biggest Market е 18 години. Платформата го задржува правото на суспензија на секој профил кој ги дерогира утврдените професионални стандарди.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="legal" className="border-none px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">Legal Notice & Contact / Правни напомени и Контакт</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            Имајте предвид дека политиката за приватност и условите на употреба можат во секое време да бидат променети.

                                            Бигмедиа Дооел
                                            6333 Радолишта, Струга
                                            
                                            Ажурирано на: 05.01.2026 година.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </section>

                        {/* Contact Form Section */}
                        <section id="contact-form" className="p-8 md:p-10 rounded-[2.5rem] bg-background border border-border/50 shadow-sm">
                            <h2 className="text-2xl font-black mb-8">Direct Contact / Директен Контакт</h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">Вашето Име / Your Name</label>
                                    <input type="text" className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">Вашиот Е-Маил / Your Email</label>
                                    <input type="email" className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">Предмет / Subject</label>
                                    <select className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                        <option>Општо прашање</option>
                                        <option>Техничка поддршка</option>
                                        <option>Плаќање и фактури</option>
                                        <option>Пријава на злоупотреба</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">Вашиот Телефон / Your Phone</label>
                                    <input type="tel" className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold px-1">Текст на пораката / Message</label>
                                    <textarea rows={5} className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"></textarea>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 w-fit">
                                        <span className="font-bold text-sm">Внесете го точниот резултат / Security Check: <span className="text-primary">15 + 7 = ?</span></span>
                                        <input type="text" className="w-16 rounded-xl border border-border bg-background px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <Button className="w-full md:w-auto px-12 py-6 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                        Испрати Порака / Send Message
                                    </Button>
                                </div>
                            </form>
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
                            </CardContent>
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
