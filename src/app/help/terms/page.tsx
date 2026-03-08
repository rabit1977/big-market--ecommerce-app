'use client';


import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    Ban,
    Globe,
    Info,
    Key,
    LayoutList,
    Lock,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    ShieldCheck,
    UserCircle,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function TermsPage() {
  const locale = useLocale();
  const isMk = locale === 'mk';

  return (
    <div className='min-h-screen bg-background pb-20'>
      {/* Header */}
      <section className='bg-muted/30 border-b border-border/50 py-12 md:py-20 relative overflow-hidden'>
        <div className='container-wide relative z-10'>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-4xl'
          >
            <h1 className='text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6'>
              {isMk ? 'Услови и ' : 'Terms & '}
              <span className='text-primary'>
                {isMk ? 'Правила' : 'Conditions'}
              </span>
            </h1>
            <p className='text-xl text-muted-foreground leading-relaxed max-w-2xl'>
              {isMk
                ? 'Прочитајте ги нашите ажурирани политики за приватност, регистрација и правила за користење на платформата.'
                : 'Read our updated policies on privacy, registration, and platform usage rules.'}
            </p>
            <div className='flex gap-4 mt-8'>
              <div className='px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold'>
                {isMk ? 'Ажурирано: 05.01.2026' : 'Updated: 05.01.2026'}
              </div>
              <div className='px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold'>
                {isMk ? 'Верзија 2.4' : 'Version 2.4'}
              </div>
            </div>
          </motion.div>
        </div>
        {/* Decoration */}
        <div className='absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none' />
      </section>

      <div className='container-wide py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-12'>
            <div className='bg-white dark:bg-muted/20 rounded-[2.5rem] border border-border/50 overflow-hidden shadow-xl shadow-primary/5'>
              <Accordion type='single' collapsible className='w-full'>
                {/* ── Marketplace Disclaimer ── */}
                <AccordionItem
                  value='disclaimer'
                  id='disclaimer'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <AlertCircle className='w-6 h-6 text-orange-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Одрекување од одговорност'
                            : 'Marketplace Disclaimer'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Улога на платформата и одговорност на продавачот'
                            : 'Platform Role & Seller Responsibility'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <div className='p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20'>
                        <p className='font-bold text-orange-700 dark:text-orange-400 mb-3'>
                          {isMk
                            ? 'PazarPlus е платформа за хостирање огласи — не е страна во ниту една трансакција.'
                            : 'PazarPlus classifieds hosting platform — not a party to any transaction.'}
                        </p>
                        <p className='text-sm'>
                          {isMk
                            ? 'Обезбедуваме технологија и инфраструктура за поединци и бизниси за објавување, управување и промовирање на нивните огласи. Не поседуваме, продаваме, проверуваме или испорачуваме ниту еден од предметите или услугите огласени на оваа платформа.'
                            : 'We provide the technology and infrastructure for individuals and businesses to publish, manage, and promote their listings. We do not own, sell, inspect, or ship any of the items or services advertised on this platform.'}
                        </p>
                      </div>

                      <p>
                        <strong>
                          {isMk
                            ? 'Одговорност на продавачот:'
                            : 'Seller Responsibility:'}
                        </strong>{' '}
                        {isMk
                          ? 'Секој продавач е единствено и целосно одговорен за точноста, легалноста, состојбата и безбедноста на предметите или услугите што ги огласува. Продавачите мора да обезбедат нивните огласи да се вистинити, да не наведуваат во заблуда и да се во согласност со сите применливи закони и овие Услови за користење.'
                          : 'Each seller is solely and fully responsible for the accuracy, legality, condition, and safety of the items or services they list. Sellers must ensure their listings are truthful, not misleading, and comply with all applicable laws and these Terms of Service.'}
                      </p>

                      <p>
                        <strong>
                          {isMk
                            ? 'Должно внимание на купувачот:'
                            : 'Buyer Due Diligence:'}
                        </strong>{' '}
                        {isMk
                          ? 'Купувачите мора да донесуваат независна проценка пред да завршат која било трансакција. Силно препорачуваме проверка на предметите лично, потврда на идентитетот на продавачот и статусот на верификувана значка, и состанување на јавно место за размени. PazarPlusоже да гарантира за квалитетот, безбедноста или автентичноста на ниту еден предмет огласен на оваа платформа.'
                          : "Buyers must exercise independent judgment before completing any transaction. We strongly recommend inspecting items in person, verifying the seller's identity and verified badge status, and meeting in a public place for exchanges. PazarPlusot guarantee the quality, safety, or authenticity of any item listed on this platform."}
                      </p>

                      <p>
                        <strong>
                          {isMk
                            ? 'Нема одговорност за трансакции:'
                            : 'No Liability for Transactions:'}
                        </strong>{' '}
                        {isMk
                          ? 'PazarPlus одговорен за каква било загуба, штета, измама или спор што произлегува од трансакции помеѓу купувачи и продавачи. Сите комуникации преку порака, контакт форма или е-пошта се исклучиво помеѓу соодветните страни.'
                          : 'PazarPlusot liable for any loss, damage, fraud, or dispute arising from transactions between buyers and sellers. All communications via message, contact form, or email are solely between the respective parties.'}
                      </p>

                      <p>
                        <strong>
                          {isMk ? 'Решавање спорови:' : 'Dispute Resolution:'}
                        </strong>{' '}
                        {isMk
                          ? 'Ако настане спор помеѓу купувач и продавач, PazarPlus да помогне со информации каде што е можно, но не може да дејствува како посредник или да наметне каков било исход. Корисниците се охрабруваат да ги решаваат споровите директно или преку соодветни правни канали.'
                          : 'If a dispute arises between a buyer and seller, PazarPlusassist with information where possible, but cannot act as a mediator or enforce any outcome. Users are encouraged to resolve disputes directly or through appropriate legal channels.'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='privacy'
                  id='privacy'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <ShieldCheck className='w-6 h-6 text-blue-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk ? 'Политика за приватност' : 'Privacy Policy'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Приватност и заштита на податоци'
                            : 'Privacy & Data Protection'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <p>
                        {isMk
                          ? 'Заштитата и безбедноста на вашите лични податоци е врвен приоритет во PazarPlusветуваме посебно внимание на приватноста и интегритетот на информациите на нашите корисници, применувајќи ги највисоките безбедносни стандарди.'
                          : "The protection and security of your personal data is a top priority at PazarPlusdedicate special attention to the privacy and integrity of our users' information, applying the highest security standards."}
                      </p>

                      <div className='p-6 rounded-2xl bg-muted/30 border border-border/50'>
                        <p className='font-bold text-foreground mb-3 text-sm uppercase tracking-wide'>
                          {isMk
                            ? 'Податоци што ги собираме:'
                            : 'Data we collect:'}
                        </p>
                        <ul className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
                          <li className='flex items-center gap-2'>
                            <div className='w-1.5 h-1.5 rounded-full bg-primary' />{' '}
                            {isMk ? 'Полно име' : 'Full Name'}
                          </li>
                          <li className='flex items-center gap-2'>
                            <div className='w-1.5 h-1.5 rounded-full bg-primary' />{' '}
                            {isMk ? 'Е-пошта' : 'Email Address'}
                          </li>
                          <li className='flex items-center gap-2'>
                            <div className='w-1.5 h-1.5 rounded-full bg-primary' />{' '}
                            {isMk
                              ? 'Телефон за контакт'
                              : 'Contact Phone Number'}
                          </li>
                          <li className='flex items-center gap-2'>
                            <div className='w-1.5 h-1.5 rounded-full bg-primary' />{' '}
                            {isMk ? 'Локација' : 'Location'}
                          </li>
                          <li className='flex items-center gap-2'>
                            <div className='w-1.5 h-1.5 rounded-full bg-primary' />{' '}
                            {isMk ? 'Податоци за огласите' : 'Listing Data'}
                          </li>
                          <li className='flex items-center gap-2'>
                            <div className='w-1.5 h-1.5 rounded-full bg-primary' />{' '}
                            {isMk ? 'IP адреса' : 'IP Address'}
                          </li>
                        </ul>
                      </div>

                      <p>
                        {isMk
                          ? 'Вашите лични податоци се користат исклучиво за да ги обезбедиме и подобриме нашите услуги. Личните податоци нема да бидат откриени на трети страни без ваша согласност.'
                          : 'Your personal data is used exclusively to provide and improve our services. Personal data will not be disclosed to third parties without your consent. Processing your data for any other purpose may only occur based on your prior written consent.'}
                      </p>

                      <p>
                        {isMk
                          ? 'Плаќањата извршени со картичка се пренесуваат преку интернет со користење на SSL (Secure Socket Layer) криптирање за да се обезбеди сигурност.'
                          : 'Payments made by card are transmitted over the internet using SSL (Secure Socket Layer) encryption to ensure security.'}
                      </p>

                      <p>
                        {isMk
                          ? 'Во согласност со Законот за заштита на личните податоци, овие информации ќе се чуваат во нашата компанија не подолго од една година по затворањето на вашата сметка, по што тие трајно ќе се избришат.'
                          : 'In accordance with the Law on Personal Data Protection, this information will be archived in our company for no longer than one year after your account is closed, after which it will be permanently deleted.'}
                      </p>

                      <p className='text-sm italic'>
                        {isMk
                          ? 'За повеќе информации, посетете ја веб-страницата на Дирекцијата за заштита на лични податоци на'
                          : 'For more information, visit the website of the Directorate for Personal Data Protection at'}{' '}
                        <a
                          href='https://dzlp.mk'
                          target='_blank'
                          className='text-primary hover:underline'
                        >
                          dzlp.mk
                        </a>
                        .
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='registration'
                  id='registration'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <UserCircle className='w-6 h-6 text-emerald-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Регистрација и верификација'
                            : 'Registration & Verification'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Регистрација и услови'
                            : 'Registration & Terms'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <p>
                        {isMk
                          ? 'За пристап до целосните професионални услуги на PazarPlusребна е валидна регистрација. Нашата платформа гарантира време на работа од 90% годишно, поддржано од континуирано техничко одржување.'
                          : 'To access the full professional services of PazarPlusalid registration is required. Our platform guarantees 90% annual uptime, supported by continuous technical maintenance and system upgrades.'}
                      </p>

                      <div className='p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10'>
                        <h4 className='font-black text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2'>
                          <Info className='w-5 h-5' />{' '}
                          {isMk
                            ? 'Преглед на профилот'
                            : 'Profile Verification'}
                        </h4>
                        <p className='mb-4'>
                          {isMk
                            ? 'Заради безбедност, верификацијата на профилот е задолжителна. Сите неверификувани профили ќе бидат избришани.'
                            : 'For security reasons, profile verification is mandatory. All unverified profiles will be deleted.'}
                        </p>
                        <ul className='space-y-3 font-bold text-emerald-800 dark:text-emerald-300'>
                          <li className='flex gap-2'>
                            <ArrowRight className='w-4 h-4 shrink-0 mt-1' />{' '}
                            {isMk
                              ? 'Можете бесплатно да објавувате и уредувате огласи 1 година.'
                              : 'You can post and edit listings for free for 1 year.'}
                          </li>
                          <li className='flex gap-2'>
                            <ArrowRight className='w-4 h-4 shrink-0 mt-1' />{' '}
                            {isMk
                              ? 'Управувајте со најмногу 50 огласи годишно.'
                              : 'Manage up to 50 listings per year.'}
                          </li>
                          <li className='flex gap-2 text-primary'>
                            <ArrowRight className='w-4 h-4 shrink-0 mt-1' />{' '}
                            {isMk
                              ? 'Цена: 98 MKD + ДДВ (116 MKD) за 1 година.'
                              : 'Price: 98 MKD + VAT (116 MKD) for 1 year.'}
                          </li>
                        </ul>
                      </div>

                      <p>
                        {isMk
                          ? 'Плаќањето може да се изврши преку банкарски трансфер или платежна картичка.'
                          : 'Payment can be made via bank transfer or debit/credit card. To use the service in full, clients must have a modern browser with JavaScript, Cookies, and Pop-ups enabled.'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='auth-tech'
                  id='auth-tech'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <Globe className='w-6 h-6 text-purple-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Социјални мрежи и технологија'
                            : 'Social Networks & Technology'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Логирање преку социјални мрежи'
                            : 'Social Login & Tech Integration'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <p>
                        <strong>
                          {isMk
                            ? 'Најава преку социјални мрежи (Google, Facebook, Apple):'
                            : 'Social Login (Google, Facebook, Apple):'}
                        </strong>{' '}
                        {isMk
                          ? 'Се користи за поедноставена и сигурна автентикација. Пренесените податоци (име, е-пошта и UID) се користат исклучиво за најава и идентификација.'
                          : 'Used for simplified and secure authentication. The transferred data (name, email, and UID) is used exclusively for login and identification purposes.'}
                      </p>

                      <p>
                        <strong>
                          {isMk ? 'Видео интеграција:' : 'Video Integration:'}
                        </strong>{' '}
                        {isMk
                          ? 'Со активирање на полето за согласност, дозволувате да се вчита содржина од YouTube, TikTok, Facebook и Instagram. Вашата IP адреса се пренесува до соодветните даватели.'
                          : 'By activating the consent checkbox, you allow content to be loaded from YouTube, TikTok, Facebook, and Instagram. Your IP address is transmitted to the respective providers.'}
                      </p>

                      <p>
                        <strong>{isMk ? 'Мапи:' : 'Maps:'}</strong>{' '}
                        {isMk
                          ? 'Ние користиме OpenStreetMap (Leaflet) и Google Maps. Вашата IP адреса може да се пренесе на нивните сервери за прикажување податоци за мапата.'
                          : 'We use OpenStreetMap (Leaflet) and Google Maps. Your IP address may be transmitted to their servers for displaying map data. You can disable maps if you do not wish to transfer this data.'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='cookies'
                  id='cookies'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <Lock className='w-6 h-6 text-amber-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk ? 'Политика за колачиња' : 'Cookie Policy'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Следење и складирање на прелистувачот'
                            : 'Tracking & Browser Storage'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <p>
                        {isMk
                          ? 'Ние користиме колачиња за оптимизирање на нашите услуги и за осигурување на правилното функционирање на платформата.'
                          : 'We use cookies to optimize our services and ensure the platform functions correctly. Cookies are small text files stored on your computer.'}
                      </p>
                      <p>
                        {isMk
                          ? 'Тие се категоризирани по функција: неопходни, за перформанси, функционални, за рекламирање и колачиња за сесија. Собраните информации се анонимни.'
                          : 'They are categorized by function: essential, performance, functional, advertising, and session cookies. The collected information is anonymous. You can disable them in your browser settings, but some features may become unavailable as a result.'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='ads'
                  id='ads'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <LayoutList className='w-6 h-6 text-blue-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Објавување и управување со огласи'
                            : 'Posting & Managing Listings'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Објавување на огласи'
                            : 'Posting & Managing Ads'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <p>
                        <strong>
                          {isMk ? 'Објавување огласи:' : 'Posting Listings:'}
                        </strong>{' '}
                        {isMk
                          ? 'PazarPlus професионална средина за комерцијални и приватни огласи. Со објавувањето, корисникот гарантира дека сите информации се точни.'
                          : 'PazarPlusrs a professional environment for commercial and private listings. By posting, the user guarantees that all information (title, description, price) is accurate, truthful, and not misleading.'}
                      </p>

                      <p>
                        <strong>
                          {isMk
                            ? 'Квалитет на содржината:'
                            : 'Content Quality:'}
                        </strong>{' '}
                        {isMk
                          ? 'За да се одржат нашите високи стандарди, сите огласи мора да содржат вистински, висококвалитетни фотографии.'
                          : 'To maintain our high standards, all listings must contain real, high-quality photographs. The platform reserves the right to remove content taken from third parties without permission or that is of poor quality.'}
                      </p>

                      <p>
                        <strong>
                          {isMk
                            ? 'Времетраење и обновување:'
                            : 'Duration & Renewal:'}
                        </strong>{' '}
                        {isMk
                          ? 'Огласите имаат однапред дефиниран датум на истекување. Промовираните огласи добиваат приоритетен статус за период од 14 дена.'
                          : 'Listings have a predefined expiry date. Users are responsible for timely updates to the availability of the item or service. Promoted listings receive priority status for a period of 14 days.'}
                      </p>

                      <p>
                        <strong>
                          {isMk ? 'Фер-плеј политика:' : 'Fair-Play Policy:'}
                        </strong>{' '}
                        {isMk
                          ? 'Дуплирањето на огласите за ист предмет во различни категории е строго забрането.'
                          : 'Duplicate listings for the same item in different categories or locations are strictly prohibited. Systematic violation of this rule leads to automatic account suspension.'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='prohibited'
                  id='prohibited'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <Ban className='w-6 h-6 text-red-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Забранета содржина и акции'
                            : 'Prohibited Content & Actions'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Ограничувања на платформата'
                            : 'Platform Restrictions'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-8'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='space-y-4'>
                          <h4 className='font-black text-red-600 uppercase text-xs tracking-widest'>
                            {isMk
                              ? 'Забранета содржина:'
                              : 'Prohibited Content:'}
                          </h4>
                          <ul className='space-y-2 text-sm'>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Рекламирање на други веб-страници'
                                : 'Advertising other websites'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Залажувачки понуди за работа'
                                : 'Misleading job offers'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Коцкање и обложување'
                                : 'Gambling and betting'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Заеми и хартии од вредност'
                                : 'Loans and securities'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Навредлива и расистичка содржина'
                                : 'Offensive and racist content'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Порнографија и проституција'
                                : 'Pornography and prostitution'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Огласи на странски јазик без превод'
                                : 'Listings in a foreign language without a translation'}
                            </li>
                          </ul>
                        </div>
                        <div className='space-y-4'>
                          <h4 className='font-black text-red-600 uppercase text-xs tracking-widest'>
                            {isMk ? 'Забранети предмети:' : 'Prohibited Items:'}
                          </h4>
                          <ul className='space-y-2 text-sm'>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Украдени или кривотворени предмети'
                                : 'Stolen or counterfeit items'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Лекови на рецепт и наркотици'
                                : 'Prescription drugs and narcotics'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Радиоактивни и експлозивни материјали'
                                : 'Radioactive and explosive materials'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Човечки органи и телесни течности'
                                : 'Human organs and bodily fluids'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Оружје и муниција'
                                : 'Weapons and ammunition'}
                            </li>
                            <li>
                              •{' '}
                              {isMk
                                ? 'Официјални униформи и пасоши'
                                : 'Official uniforms and passports'}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className='p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-sm font-bold text-red-700'>
                        {isMk
                          ? 'Секој оглас може да биде објавен само еднаш на една локација. Дупликатните огласи нема да се толерираат.'
                          : 'Each listing may only be posted once in a single location. Duplicate listings and spamming will not be tolerated.'}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='marketing'
                  id='marketing'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <MessageSquare className='w-6 h-6 text-indigo-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Комуникација и Маркетинг'
                            : 'Communication & Marketing'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Viber, WhatsApp & Маркетинг'
                            : 'Viber, WhatsApp & Marketing'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <p>
                        <strong>
                          {isMk ? 'Директен маркетинг:' : 'Direct Marketing:'}
                        </strong>{' '}
                        {isMk
                          ? 'PazarPlusористи вашите податоци за маркетинг цели само со ваша претходна согласност.'
                          : 'PazarPlus your data for marketing purposes only with your prior consent. Every communication (Email, SMS, Viber, WhatsApp) includes an opt-out option. After withdrawal, your data will be removed from our active database within 14 days.'}
                      </p>

                      <p>
                        <strong>
                          {isMk ? 'Viber & WhatsApp:' : 'Viber & WhatsApp:'}
                        </strong>{' '}
                        {isMk
                          ? 'Нашата платформа овозможува директно поврзување со продавачите, но немаме пристап до вашата приватна содржина.'
                          : 'Our platform enables direct connection with providers, but we have no access to your private content. To stop communications, simply send a message with the text "STOP".'}
                      </p>

                      <p>
                        <strong>
                          {isMk ? 'Анти-Спам Политика:' : 'Anti-Spam Policy:'}
                        </strong>{' '}
                        {isMk
                          ? 'Генерирањето масовни огласи или ирелевантна содржина е строго забрането.'
                          : 'Generating mass listings or irrelevant content is strictly forbidden. If you suspect any abuse, contact our center at support@PazarPlus.mk.'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='security'
                  id='security'
                  className='border-b border-border/50 px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-popover/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <Key className='w-6 h-6 text-slate-600' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Безбедност и одговорност'
                            : 'Security & Responsibility'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Лозинки и услови за користење'
                            : 'Passwords & Usage Terms'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-6'>
                      <p>
                        <strong>
                          {isMk
                            ? 'Безбедност на сметката:'
                            : 'Account Security:'}
                        </strong>{' '}
                        {isMk
                          ? 'Одговорноста за вашата лозинка лежи кај вас. PazarPlusорачува користење сложени лозинки.'
                          : 'Responsibility for your password and access lies with you. PazarPlusmmends using complex passwords and changing them regularly for maximum protection.'}
                      </p>
                      <p>
                        <strong>
                          {isMk ? 'Регулација на возраста:' : 'Age Regulation:'}
                        </strong>{' '}
                        {isMk
                          ? 'Платформата е наменета исклучиво за возрасни (18+ години).'
                          : 'The platform is intended exclusively for adults (18+ years old).'}
                      </p>
                      <p>
                        <strong>{isMk ? 'Суспензија:' : 'Suspension:'}</strong>{' '}
                        {isMk
                          ? 'PazarPlusадржува правото да го ограничи или прекине пристапот за секој корисник кој не ги почитува нормите.'
                          : 'PazarPlusrves the right to restrict or terminate access for any user who does not comply with the defined ethical and legal norms of the platform.'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value='legal'
                  id='legal'
                  className='border-none px-6 md:px-10'
                >
                  <AccordionTrigger className='hover:no-underline py-8 text-left group'>
                    <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl bg-slate-800/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <AlertCircle className='w-6 h-6 text-slate-800 dark:text-slate-300' />
                      </div>
                      <div>
                        <div className='font-black text-xl'>
                          {isMk
                            ? 'Правна напомена и контакт'
                            : 'Legal Notice & Contact'}
                        </div>
                        <div className='text-xs text-muted-foreground uppercase tracking-wider font-bold'>
                          {isMk
                            ? 'Податоци за компанијата и надлежност'
                            : 'Company Details & Jurisdiction'}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-10 text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]'>
                    <div className='space-y-8'>
                      <p>
                        {isMk
                          ? 'Политиката за приватност и општите услови подлежат на периодични промени. Со користење ги потврдувате.'
                          : 'The privacy policy and general terms and conditions of PazarPlussubject to periodic changes in order to improve our services. By using these services, the user confirms their agreement with the current version of this document.'}
                      </p>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50'>
                        <div className='space-y-4'>
                          <h5 className='font-black text-xs uppercase tracking-widest text-primary'>
                            {isMk ? 'Компанија:' : 'Company:'}
                          </h5>
                          <p className='font-bold'>PazarPlus
                          <div className='flex gap-2 text-sm'>
                            <MapPin className='w-4 h-4 text-muted-foreground shrink-0' />
                            <span>6333 Radolishta, Struga, Macedonia</span>
                          </div>
                        </div>
                        <div className='space-y-4'>
                          <h5 className='font-black text-xs uppercase tracking-widest text-primary'>
                            {isMk ? 'Контакт:' : 'Contact:'}
                          </h5>
                          <div className='flex gap-2 text-sm'>
                            <Mail className='w-4 h-4 text-muted-foreground shrink-0' />
                            <span>support@PazarPlus.mk</span>
                          </div>
                          <div className='flex gap-2 text-sm'>
                            <Phone className='w-4 h-4 text-muted-foreground shrink-0' />
                            <span>
                              {isMk
                                ? 'Контакт преку форма'
                                : 'Contact via form'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Direct Contact Form */}
            <section
              id='contact'
              className='p-8 md:p-12 rounded-[2.5rem] bg-background border border-border/50 shadow-2xl shadow-primary/5'
            >
              <h2 className='text-3xl font-black mb-8'>
                {isMk ? 'Контактирајте нè' : 'Contact Us'}
              </h2>
              <form className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-black px-1'>
                    {isMk ? 'Вашето Име' : 'Your Name'}
                  </label>
                  <input
                    type='text'
                    className='w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-black px-1'>
                    {isMk ? 'Вашата Е-пошта' : 'Your Email'}
                  </label>
                  <input
                    type='email'
                    className='w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-black px-1'>
                    {isMk ? 'Тема' : 'Subject'}
                  </label>
                  <select className='w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none'>
                    <option>
                      {isMk ? 'Општо Прашање' : 'General Enquiry'}
                    </option>
                    <option>
                      {isMk ? 'Техничка Поддршка' : 'Technical Support'}
                    </option>
                    <option>
                      {isMk ? 'Пријави Злоупотреба' : 'Report Abuse'}
                    </option>
                    <option>{isMk ? 'Маркетинг' : 'Marketing'}</option>
                  </select>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-black px-1'>
                    {isMk ? 'Вашиот Телефон' : 'Your Phone'}
                  </label>
                  <input
                    type='tel'
                    className='w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold'
                  />
                </div>
                <div className='md:col-span-2 space-y-2'>
                  <label className='text-sm font-black px-1'>
                    {isMk ? 'Порака' : 'Message'}
                  </label>
                  <textarea
                    rows={6}
                    className='w-full rounded-2xl border border-border bg-muted/20 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-bold'
                  ></textarea>
                </div>
                <div className='md:col-span-2 space-y-8'>
                  <div className='flex items-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10 w-fit'>
                    <span className='font-black text-base text-primary/80'>
                      {isMk ? 'Безбедносна Проверка:' : 'Security Check:'}{' '}
                      <span className='text-primary text-xl tracking-widest'>
                        15 + 7 = ?
                      </span>
                    </span>
                    <input
                      type='text'
                      className='w-24 rounded-xl border border-border bg-background px-4 py-3 text-center font-black text-xl focus:outline-none focus:ring-2 focus:ring-primary/20'
                    />
                  </div>
                  <Button className='w-full md:w-auto px-16 py-8 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-blue-600'>
                    {isMk ? 'Испрати Порака' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            <div className='sticky top-24'>
              <div className='p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl'>
                <h3 className='text-2xl font-black mb-6'>
                  {isMk ? 'Брзи алатки' : 'Quick Tools'}
                </h3>
                <div className='space-y-4'>
                  <Button
                    className='w-full justify-start h-14 rounded-xl font-bold bg-white/10 hover:bg-white/20 border-white/10'
                    asChild
                  >
                    <Link href='/help'>
                      <Info className='w-5 h-5 mr-3' />
                      {isMk ? 'Центар за помош' : 'Help Center'}
                    </Link>
                  </Button>
                  <Button
                    className='w-full justify-start h-14 rounded-xl font-bold bg-white/10 hover:bg-white/20 border-white/10'
                    asChild
                  >
                    <Link href='/help/payments'>
                      <ArrowRight className='w-5 h-5 mr-3' />
                      {isMk ? 'Информации за плаќање' : 'Payments Info'}
                    </Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start h-14 rounded-xl font-bold border-white/20 text-white hover:bg-white/5'
                    asChild
                  >
                    <Link href='#contact'>
                      <Mail className='w-5 h-5 mr-3' />
                      {isMk ? 'Барање за поддршка' : 'Support Inquiry'}
                    </Link>
                  </Button>
                </div>
              </div>

              <div className='mt-8 p-8 rounded-[2rem] bg-muted/30 border border-border/50 text-center'>
                <h4 className='font-black text-lg mb-2'>
                  {isMk ? 'ПДФ Документација' : 'Documentation PDF'}
                </h4>
                <p className='text-xs text-muted-foreground mb-6'>
                  {isMk
                    ? 'Преземете копија од нашите услови за ваша евиденција.'
                    : 'Download a copy of our terms for your records.'}
                </p>
                <Button
                  variant='outline'
                  className='w-full rounded-xl font-bold bg-background h-12'
                  disabled
                >
                  {isMk ? 'Наскоро' : 'Coming Soon'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
