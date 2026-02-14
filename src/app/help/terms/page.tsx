'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    Ban,
    Globe,
    Info,
    Key,
    Lock,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    ShieldCheck,
    UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
                            Правила и <span className="text-primary">Услови</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Прочитајте ги нашите ажурирани политики за приватност, регистрација и правила за користење на платформата.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
                                Ажурирано: 05.01.2026
                            </div>
                            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold">
                                Верзија 2.4
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            </section>

            <div className="container-wide py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        <div className="bg-white dark:bg-muted/20 rounded-[2.5rem] border border-border/50 overflow-hidden shadow-xl shadow-primary/5">
                            <Accordion type="single" collapsible className="w-full">
                                
                                <AccordionItem value="privacy" id="privacy" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Политика за приватност</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Privacy & Data Protection</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p>Заштитата и сигурноста на вашите лични податоци претставуваат врвен приоритет за Биг Маркет. Ние посветуваме особено внимание на приватноста и интегритетот на информациите на нашите корисници, применувајќи највисоки стандарди за безбедност.</p>
                                            
                                            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                                                <p className="font-bold text-foreground mb-3 text-sm uppercase tracking-wide">Податоци кои ги собираме:</p>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Име и Презиме
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> E-маил адреса
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Телефон за контакт
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Локација
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Податоци на огласот
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> ИП адреса
                                                    </li>
                                                </ul>
                                            </div>

                                            <p>Вашите лични податоци се користат исклучиво за овозможување на нашите услуги и подобрување на истите. Личните податоци нема да бидат откриени без ваша согласност на трети лица. Обработка на Вашите лични податоци за друга цел, може да се врши врз основа на Ваша претходна писмена согласност.</p>
                                            
                                            <p>Плаќање со платежни картички се врши со податоци кои поради безбедност при комуникацијата преку интернет се шифрираат со користење посебен SSL (Secure Socket Layer) протокол.</p>
                                            
                                            <p>Согласно Законот за заштита на лични податоци, овие информации ќе бидат архивирани во нашата компанија во рок не подолг од една година по завршување на рокот на траење на Вашиот кориснички профил, по кое нешто истите ќе бидат избришани.</p>
                                            
                                            <p className="text-sm italic">За подетални информации посетете ја веб страницата Дирекцијата за заштита на лични податоци dzlp.mk.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="registration" id="registration" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <UserCircle className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Регистрација и Верификација</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Registration & Terms</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p>За пристап до целосниот спектар на професионални услуги на Big Market, неопходна е валидна регистрација. Нашата платформа гарантира 90% достапност на годишно ниво, поддржана од континуирано техничко одржување и системски надградби.</p>
                                            
                                            <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                                                <h4 className="font-black text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                                                    <Info className="w-5 h-5" /> Верификација на профилот
                                                </h4>
                                                <p className="mb-4">Поради безбедносни причини Верификација на профилот е задолжителна. Сите не-верифицирани профили ќе бидат избришани.</p>
                                                <ul className="space-y-3 font-bold text-emerald-800 dark:text-emerald-300">
                                                    <li className="flex gap-2">
                                                        <ArrowRight className="w-4 h-4 shrink-0 mt-1" /> Можете 1 година бесплатно да внесувате и менувате огласи.
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <ArrowRight className="w-4 h-4 shrink-0 mt-1" /> Управување до 50 огласи на годишно ниво.
                                                    </li>
                                                    <li className="flex gap-2 text-primary">
                                                        <ArrowRight className="w-4 h-4 shrink-0 mt-1" /> Цена: 98 ден + ддв (116 ден.) за 1 година.
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <p>Плаќањето се врши преку уплатница или платежна картичка. За користење на сервисот во целост, клиентот мора да ги користи најновите пребарувачки технологии (Java Script, Cookies, Pop-ups).</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="auth-tech" id="auth-tech" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Globe className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Социјални мрежи и Технологија</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Social Login & Tech Integration</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p><strong>Social Login (Google, Facebook, Apple):</strong> Служи за поедноставена и безбедна автентикација. Пренесените податоци (име, е-пошта и UID) се користат исклучиво за најава и идентификација.</p>
                                            
                                            <p><strong>Интеграција на видео:</strong> Со активирање на полето за согласност (checkbox), дозволувате вчитување на содржини од (YouTube, TikTok, Facebook и Instagram). Вашата IP-адреса се пренесува до соодветните даватели.</p>
                                            
                                            <p><strong>Мапи:</strong> Користиме OpenStreetMap (Leaflet) и Google Maps. Вашата IP-адреса може да се пренесе до нивните сервери за прикажување на податоците. Можете да ги оневозможите мапите ако не сакате пренос на податоци.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="cookies" id="cookies" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Lock className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Политика на колачиња</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Cookie Policy</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p>Користиме колачиња (Cookies) за оптимизирање на нашите услуги и правилно функционирање на платформата. Колачињата се мали текстуални датотеки кои се зачувуваат на Вашиот компјутер.</p>
                                            <p>Поделени се според функцијата: задолжителни, за перформанси, за функционалност, за рекламирање и за сесија. Информациите се анонимни. Можете да ги исклучите во подесувањата на вашиот пребарувач, но во тој случај некои функции нема да бидат достапни.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="prohibited" id="prohibited" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Ban className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Недопуштени содржини и предмети</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Prohibited Items & Content</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h4 className="font-black text-red-600 uppercase text-xs tracking-widest">Недопуштени Содржини:</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        <li>• Рекламирање на други интернет страници</li>
                                                        <li>• Несериозни понуди за работа</li>
                                                        <li>• Игри на среќа и обложување</li>
                                                        <li>• Кредити и хартии од вредност</li>
                                                        <li>• Навредливи и расистички содржини</li>
                                                        <li>• Порнографија и проституција</li>
                                                        <li>• Огласи на странски јазик без превод</li>
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="font-black text-red-600 uppercase text-xs tracking-widest">Недопуштени Предмети:</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        <li>• Украдени или фалсификувани предмети</li>
                                                        <li>• Лекови на рецепт и дроги</li>
                                                        <li>• Радиоактивни и експлозивни материи</li>
                                                        <li>• Човечки органи и телесни течности</li>
                                                        <li>• Оружје и муниција</li>
                                                        <li>• Службени униформи и пасоши</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-sm font-bold text-red-700">
                                                Огласот се дава само еднаш на една локација. Двојно прикажување и спимирање нема да се толерира.
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="marketing" id="marketing" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <MessageSquare className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Комуникација и Маркетинг</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Viber, WhatsApp & Marketing</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p><strong>Директен Маркетинг:</strong> Биг Маркет ги користи вашите податоци за маркетинг цели исклучиво со ваша претходна согласност. Секоја комуникација (Email, SMS, Viber, WhatsApp) вклучува опција за итна одјава. По повлекувањето, податоците се отстрануваат од нашата активна база во рок од **14 дена**.</p>
                                            
                                            <p><strong>Viber & WhatsApp комуникација:</strong> Нашата платформа овозможува директно поврзување со провајдерите, но нема пристап до вашата приватна содржина. За прекин на комуникацијата, доволно е да испратите порака со содржина **"STOP"**.</p>
                                            
                                            <p><strong>Политика против Спам:</strong> Строго е забрането генерирање на масовни огласи или нерелевантна содржина. При секое сомневање за злоупотреба, контактирајте го нашиот центар на support@bigmarket.mk.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="security" id="security" className="border-b border-border/50 px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Key className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Сигурност и Одговорност</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Passwords & Usage Term</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-6">
                                            <p><strong>Сигурност на сметката:</strong> Одговорноста за лозинката и пристапот лежи кај корисникот. Биг Маркет препорачува користење на комплексни лозинки и редовна промена за максимална заштита.</p>
                                            <p><strong>Старосна регулатива:</strong> Платформата е наменета исклучиво за полнолетни лица (18+ години).</p>
                                            <p><strong>Суспензија:</strong> Биг Маркет го задржува правото да го ограничи или прекине пристапот на секој корисник кој не се придржува до дефинираните етички и законски норми на платформата.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="legal" id="legal" className="border-none px-6 md:px-10">
                                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <AlertCircle className="w-6 h-6 text-slate-800" />
                                            </div>
                                            <div>
                                                <div className="font-black text-xl">Правни напомени и Контакт</div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Legal Notice & Contact</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                                        <div className="space-y-8">
                                            <p>Политиката за приватност и општите услови на Big Market подлежат на периодични измени со цел унапредување на услугите. Со користење на овие услуги, корисникот потврдува дека се согласува со актуелната верзија на документот.</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                                                <div className="space-y-4">
                                                    <h5 className="font-black text-xs uppercase tracking-widest text-primary">Компанија / Company:</h5>
                                                    <p className="font-bold">Бигмедиа Дооел</p>
                                                    <div className="flex gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span>6333 Радолишта, Струга</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h5 className="font-black text-xs uppercase tracking-widest text-primary">Контакт / Contact:</h5>
                                                    <div className="flex gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <span>support@bigmarket.mk</span>
                                                    </div>
                                                    <div className="flex gap-2 text-sm">
                                                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span>Контакт преку формулар</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Direct Contact Form */}
                        <section id="contact" className="p-8 md:p-12 rounded-[2.5rem] bg-background border border-border/50 shadow-2xl shadow-primary/5">
                            <h2 className="text-3xl font-black mb-8">Испратете ни порака / Contact Us</h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Вашето Име</label>
                                    <input type="text" className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Вашиот Е-Маил</label>
                                    <input type="email" className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Предмет</label>
                                    <select className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none">
                                        <option>Општо прашање</option>
                                        <option>Техничка поддршка</option>
                                        <option>Пријава на злоупотреба</option>
                                        <option>Маркетинг</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black px-1">Вашиот Телефон</label>
                                    <input type="tel" className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-black px-1">Текст на пораката</label>
                                    <textarea rows={6} className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-bold"></textarea>
                                </div>
                                <div className="md:col-span-2 space-y-8">
                                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10 w-fit">
                                        <span className="font-black text-base text-primary/80">Security Check: <span className="text-primary text-xl tracking-widest">15 + 7 = ?</span></span>
                                        <input type="text" className="w-24 rounded-xl border border-border bg-background px-4 py-3 text-center font-black text-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <Button className="w-full md:w-auto px-16 py-8 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-blue-600">
                                        Испрати Порака
                                    </Button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="sticky top-24">
                            <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl">
                                <h3 className="text-2xl font-black mb-6">Quick Tools</h3>
                                <div className="space-y-4">
                                    <Button className="w-full justify-start h-14 rounded-xl font-bold bg-white/10 hover:bg-white/20 border-white/10" asChild>
                                        <Link href="/help">
                                            <Info className="w-5 h-5 mr-3" />
                                            Help Center
                                        </Link>
                                    </Button>
                                    <Button className="w-full justify-start h-14 rounded-xl font-bold bg-white/10 hover:bg-white/20 border-white/10" asChild>
                                        <Link href="/help/payments">
                                            <ArrowRight className="w-5 h-5 mr-3" />
                                            Payments Info
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-14 rounded-xl font-bold border-white/20 text-white hover:bg-white/5" asChild>
                                        <Link href="#contact">
                                            <Mail className="w-5 h-5 mr-3" />
                                            Support Inquiry
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-8 rounded-[2rem] bg-muted/30 border border-border/50 text-center">
                                <h4 className="font-black text-lg mb-2">Documentation PDF</h4>
                                <p className="text-xs text-muted-foreground mb-6">Download a copy of our terms for your records.</p>
                                <Button variant="outline" className="w-full rounded-xl font-bold bg-background h-12" disabled>
                                    Coming Soon
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
