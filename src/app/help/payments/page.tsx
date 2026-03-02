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
import { PRICING } from '@/lib/constants/pricing';
import { useMutation } from 'convex/react';
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
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function PaymentsBillingPage() {
    const locale = useLocale();
    const isMk = locale === 'mk';
    const submitContact = useMutation(api.contact.submit);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Other',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitContact({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                subject: formData.subject,
                message: formData.message,
            });
            toast.success(isMk ? "Успешно испратена порака!" : "Email sent successfully!");
            setFormData({ name: '', email: '', phone: '', subject: 'Other', message: '' });
        } catch (err) {
            toast.error(isMk ? "Неуспешно испратена порака. Обидете се повторно." : "Failed to send email. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                            {isMk ? 'Плаќања и ' : 'Payments & '} <span className="text-primary">{isMk ? 'Деловни Решенија' : 'Business Solutions'}</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {isMk 
                                ? 'Професионални алатки дизајнирани за скалирање на вашиот бизнис. Дознајте повеќе за Премиум членствата и безбедното плаќање.'
                                : 'Professional tools designed to scale your business. Learn about Premium memberships, professional branding, and secure billing.'}
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
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3 flex-wrap">
                                <Briefcase className="w-8 h-8 text-primary shrink-0" />
                                <span className="flex-1">
                                    {isMk ? 'Премиум Деловно Членство' : 'Premium Business Membership'}
                                </span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                {isMk 
                                    ? 'Трансформирајте го вашето присуство на Biggest Market. Преминете надвор од стандардните огласи и позиционирајте го вашиот бренд како лидер на пазарот. Нашето Премиум Членство обезбедува пакет професионални алатки дизајнирани да ги конвертираат посетителите во долгорочни лојални клиенти.' 
                                    : 'Transform your presence on Biggest Market. Move beyond standard listings and establish your brand as a market leader. Our Premium Membership provides a suite of professional tools designed to convert browsers into long-term loyal customers.'}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FeatureCard 
                                    icon={Store} 
                                    title={isMk ? 'Сопствен линк' : 'Custom Shop URL'} 
                                    desc={isMk ? 'Креирајте вашиот дом на Biggest Market со персонализиран линк: bigmarket.com/vasha_kompanija.' : 'Establish your home on Biggest Market with a personalized URL: bigmarket.com/your_company.'}
                                />
                                <FeatureCard 
                                    icon={BadgeCheck} 
                                    title={isMk ? 'Верификуван Бренд' : 'Verified Branding'} 
                                    desc={isMk ? 'Вашето лого и име ќе бидат видливо истакнати на секој ваш оглас.' : 'Your company logo and brand name will be prominently displayed on every listing you post.'}
                                />
                                <FeatureCard 
                                    icon={LayoutDashboard} 
                                    title={isMk ? 'Елитни Алатки' : 'Elite Inventory Tools'} 
                                    desc={isMk ? 'Управувајте со голем обем до 500 активни огласи од една контролна табла.' : 'Manage a massive volume of up to 500 active listings simultaneously from a streamlined dashboard.'}
                                />
                                <FeatureCard 
                                    icon={PieChart} 
                                    title={isMk ? 'Ексклузивна Аналитика' : 'Exclusive Analytics'} 
                                    desc={isMk ? 'Пристапете до детални извештаи за да ги оптимизирате продажбите и стратегијата.' : 'Access detailed performance reports to understand customer interest and optimize your sales strategy.'}
                                />
                            </div>
                        </section>

                        {/* Integration Guide */}
                        <section id="activation" className="p-8 md:p-10 rounded-[2.5rem] bg-muted/30 border border-border/50">
                            <h2 className="text-2xl font-black mb-8">{isMk ? 'Како да станете Премиум Партнер' : 'Becoming a Premium Partner'}</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                                    <div>
                                        <h4 className="font-bold mb-1">{isMk ? 'Стандардна Регистрација' : 'Standard Registration'}</h4>
                                        <p className="text-sm text-muted-foreground">{isMk ? 'Прво проверете дали имате верификувана стандардна сметка. Ако сеуште немате, направете ' : 'First, ensure you have a verified standard account. If you haven\'t registered yet, please complete the '}<Link href="/auth" className="text-primary font-semibold hover:underline">{isMk ? 'иницијална регистрација' : 'initial enrollment'}</Link>.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                                    <div>
                                        <h4 className="font-bold mb-1">{isMk ? 'Надградба во Премиум' : 'Upgrade to Premium'}</h4>
                                        <p className="text-sm text-muted-foreground">{isMk ? 'Одете во вашата контролна табла и изберете "Надградба во Премиум". Прегледајте го пакетот за раст и продолжете кон сигурно плаќање.' : 'Navigate to your account dashboard and select "Upgrade to Premium". Review the annual growth package and proceed to our secure checkout.'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                                    <div>
                                        <h4 className="font-bold mb-1">{isMk ? 'Прилагодување на Брендот' : 'Brand Customization'}</h4>
                                        <p className="text-sm text-muted-foreground">{isMk ? 'По активацијата, внесете ги деталите за бизнисот. Поставете лого, опишете ја вашата компанија и зачувајте сопствен линк.' : 'Once activated, enter your Business Field settings. Upload your logo, define your company biography, and secure your custom business URL.'}</p>
                                    </div>
                                </div>
                            </div>
                            <Button asChild className="mt-10 rounded-2xl px-10 py-7 h-auto font-black text-lg bg-gradient-to-r from-primary to-blue-600 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                                <Link href="/premium">{isMk ? 'Започнете сега' : 'Get Started Now'}</Link>
                            </Button>
                        </section>

                        {/* Terms of Service Section */}
                        <section id="terms">
                            <h2 className="text-2xl font-black mb-6">{isMk ? 'Правила и Услови' : 'Rules & Terms'}</h2>
                            <div className="bg-muted/30 rounded-[2rem] border border-border/50 overflow-hidden">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="privacy" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Заштита на лични податоци' : 'Privacy Policy & Data Protection'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `Заштитата на личните податоци и нивната системска сигурност претставуваат фундаментален столб во работењето на Биг Маркет. Нашата платформа применува строги протоколи за заштита на приватноста, обезбедувајќи интегритет на секоја информација споделена од нашите корисници.

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

Вашите лични податоци се користат исклучиво за овозможување на нашите услуги и подобрување на истите. Личните податоци нема да бидат откриени без ваша согласност на трети лица.` : `Data protection and systemic security are fundamental pillars in the operation of Biggest Market. Our platform applies strict privacy protection protocols, ensuring the integrity of every piece of information shared by our users.

By creating a professional profile on Biggest Market, you authorize the secure collection and processing of data necessary for the functioning of your services.

The data includes:
- First and Last Name
- Email address
- Contact phone
- Location
- Listing data
- IP address

The data we collect is stored in accordance with personal data protection regulations. Your personal data is used exclusively to provide our services and improve them. Personal data will not be disclosed to third parties without your consent.`}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="registration" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Регистрација и Верификација' : 'Registration & Verification'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `Biggest Market овозможува пристап до напредна онлајн инфраструктура за тргување. Интеракцијата со платформата подразбира прифаќање на утврдените технички норми и ценовници.

Верификацијата на профилот е задолжителен безбедносен чекор за сите корисници. Верификуваните партнери добиваат право на управување до 50 активни огласи годишно. Надоместокот за верификација изнесува 98 ден + ДДВ (116 ден.) во времетраење од 12 месеци.` : `Biggest Market grants access to advanced online trading infrastructure. Interaction with the platform implies acceptance of established technical norms and price lists.

Profile verification is a mandatory security step for all users. Verified partners receive the right to manage up to 50 active listings per year. The verification fee is 98 MKD + VAT (116 MKD) for a duration of 12 months.`}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="auth-tech" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Најава и Технологија' : 'Social Login & Tech'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `Функцијата Social Login служи за поедноставена и безбедна автентикација на корисниците преку Google, Facebook или Apple. Трансферот на податоци зависи од вашите поставки кај третиот провајдер.` : `The Social Login feature provides simplified and secure user authentication via Google, Facebook, or Apple. Data transfer depends on your settings with the third-party provider.`}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="cookies" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Политика на колачиња (Cookies)' : 'Cookie Policy'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `За оптимизација на корисничкиот интерфејс и непречена функционалност на Биг Маркет, користиме технологија на „колачиња“ (Cookies).` : `To optimize the user interface and secure seamless functionality of Biggest Market, we use "cookies" technology.`}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="marketing" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Маркетинг и Комуникација' : 'Marketing & Communication'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `Биг Маркет спроведува директни маркетинг активности исклучиво врз основа на ваша прецизна согласност. Корисниците имаат постојана контрола и опција за итна деактивација на известувањата во секое време.` : `Biggest Market conducts direct marketing activities solely based on your explicit consent. Users have continuous control and the option to immediately disable notifications at any time.`}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="prohibited" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Недопуштени содржини' : 'Prohibited Content'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `Oсобено е недопуштиво да се даваат огласи со следнава содржина:
- Рекламирање на други интернет страници и фирми.
- Несериозни понуди за работа.
- Игри на среќа, кредити и заеми без целосен податок.
- Инвестиции, хартии од вредност, акции.
- Навредливи, расистички или порнографски содржини.
- Понуди за проституција.

Недопуштени предмети: украдени предмети, дроги, радиоактивни супстанци, оружје, лекови на рецепт, човечки органи.` : `The following ad contents are strictly prohibited:
- Advertising other websites and companies.
- Unserious job offers.
- Games of chance, loans, and credits without full disclosure.
- Investments, securities, stocks.
- Offensive, racist, or pornographic content.
- Prostitution offers.

Prohibited items: stolen items, drugs, radioactive substances, weapons, prescription drugs, human organs.`}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="responsibility-security" className="border-b border-border/50 px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Одговорност и Безбедност' : 'Responsibility & Security'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `Корисниците преземаат правна и етичка одговорност за вистинитоста на внесените податоци. Сигурноста на лозинката е обврска на корисникот.

Минималната старосна граница за користење на Biggest Market е 18 години. Платформата го задржува правото на суспензија на секој профил кој ги дерогира утврдените професионални стандарди.` : `Users assume legal and ethical responsibility for the veracity of entered data. Password security is the user's responsibility.

The minimum age limit to use Biggest Market is 18 years. The platform reserves the right to suspend any profile that derogates from established professional standards.`}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="legal" className="border-none px-6">
                                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                                            <span className="font-bold">{isMk ? 'Правни напомени и Контакт' : 'Legal Notice & Contact'}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {isMk ? `Имајте предвид дека политиката за приватност и условите на употреба можат во секое време да бидат променети.

Бигмедиа Дооел
6333 Радолишта, Струга` : `Please note that the privacy policy and terms of use may be changed at any time.

Bigmedia Dooel
6333 Radolishta, Struga`}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </section>

                        {/* Contact Form Section */}
                        <section id="contact-form" className="p-8 md:p-10 rounded-[2.5rem] bg-background border border-border/50 shadow-sm">
                            <h2 className="text-2xl font-black mb-8">{isMk ? 'Директен Контакт' : 'Direct Contact'}</h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">{isMk ? 'Вашето Име' : 'Your Name'}</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">{isMk ? 'Вашиот Е-Маил' : 'Your Email'}</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">{isMk ? 'Предмет' : 'Subject'}</label>
                                    <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                        {isMk ? (
                                            <>
                                                <option value="General">Општо прашање</option>
                                                <option value="Support">Техничка поддршка</option>
                                                <option value="Billing">Плаќање и фактури</option>
                                                <option value="Abuse">Пријава на злоупотреба</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="General">General Inquiry</option>
                                                <option value="Support">Technical Support</option>
                                                <option value="Billing">Billing & Invoices</option>
                                                <option value="Abuse">Report Abuse</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">{isMk ? 'Вашиот Телефон' : 'Your Phone'}</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold px-1">{isMk ? 'Текст на пораката' : 'Message'}</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"></textarea>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 w-fit">
                                        <span className="font-bold text-sm">{isMk ? 'Внесете го точниот резултат: ' : 'Security Check: '}<span className="text-primary">15 + 7 = ?</span></span>
                                        <input type="text" className="w-16 rounded-xl border border-border bg-background px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-6 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                        {loading ? (isMk ? 'Се испраќа...' : 'Sending...') : (isMk ? 'Испрати Порака' : 'Send Email')}
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
                                    {isMk ? 'Бизнис Раст' : 'Business Growth'}
                                </div>
                                <CardTitle className="text-2xl font-black">{isMk ? 'Професионален План' : 'Professional Plan'}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-5xl font-black">{PRICING.MEMBERSHIP.PRO}</span>
                                    <span className="text-lg font-bold text-muted-foreground">{isMk ? 'МКД/год' : 'MKD/year'}</span>
                                    <span className="text-xs text-muted-foreground ml-1 font-semibold underline underline-offset-4 decoration-primary/30">{isMk ? '+ ДДВ' : '+ VAT'}</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>{isMk ? 'Вклучува: 500 активни огласи' : 'Inventory: 500 active listings'}</span>
                                    </li>
                                    <li className="flex gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>{isMk ? 'Присуство во пребарувањето 100%' : 'Search presence: 100% indexed'}</span>
                                    </li>
                                    <li className="flex gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>{isMk ? 'Сопствена Деловна Страница' : 'Custom Business Page/URL'}</span>
                                    </li>
                                </ul>
                                <Button className="w-full rounded-xl font-bold h-12" asChild>
                                    <Link href="/premium">{isMk ? 'Надгради' : 'Upgrade Now'}</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="rounded-[2rem] border-border/50">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">{isMk ? 'Безбедно Плаќање' : 'Secure Billing'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{isMk ? 'Кредитна/Дебитна Картичка' : 'Credit/Debit Card'}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-black">{isMk ? 'Инстант Активација' : 'Instant Activation'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{isMk ? 'Банкарски Трансфер' : 'Bank Transfer'}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-black">{isMk ? 'Про-Фактура' : 'Pro-Forma Invoice'}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Need Help? */}
                        <div className="p-8 rounded-[2rem] bg-muted/20 border border-border/50 text-center">
                            <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                                <HelpCircle className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-bold mb-2">{isMk ? 'Поддршка' : 'Billing Support'}</h4>
                            <p className="text-xs text-muted-foreground mb-6">{isMk ? 'Имате прашања околу деловните планови или ви треба помош со фактурирање?' : 'Need a custom invoice or have questions about business plans?'}</p>
                            <Button variant="outline" className="w-full rounded-xl font-bold bg-background" asChild>
                                <Link href="/contact">{isMk ? 'Контакт' : 'Contact Support'}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
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
