'use client';

import { createStripeCheckoutSession } from '@/actions/stripe-actions';

import { PromotionIcon } from '@/components/shared/listing/promotion-icon';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PROMOTIONS } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Activity,
  BadgeCheck,
  Briefcase,
  Check,
  CreditCard,
  HelpCircle,
  Rocket,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PremiumPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('Premium');
  const locale = useLocale();
  const isMk = locale === 'mk';
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // FAQs are translated inline
  const faqs = isMk
    ? [
        {
          q: 'Како да ја активирам мојата промоција?',
          a: 'Активирањето на промоција е беспрекорно. Ако веќе сте го поднеле вашиот оглас, едноставно отворете го и кликнете на линкот "Промовирај" до иконата ѕвезда за да го изберете вашето засилување. Регистрираните корисници можат да управуваат со активациите директно од нивната контролна табла за максимална ефикасност.',
        },
        {
          q: 'Колку долго остануваат огласите промовирани?',
          a: 'Сите професионални промоции остануваат активни за цел 14-дневен циклус. Откако овој период ќе истече, вашиот оглас автоматски се враќа во стандарден бесплатен оглас, осигурувајќи дека ќе остане објавен без прекин.',
        },
        {
          q: 'Зошто мојот премиум оглас не се појавува на самиот врв?',
          a: 'За да се обезбеди максимална правичност и разновидност, сите промовирани огласи се прикажуваат на страницата за пребарување во динамична ротација. Огласите се појавуваат врз основа на релевантни критериуми за гледачите: регионот, категоријата и специфичните клучни зборови содржани во вашиот наслов.',
        },
        {
          q: 'Кои начини на плаќање се поддржани?',
          a: 'Препорачуваме плаќање со дебитна или кредитна картичка за инстант активација и безбедно процесирање. Алтернативно, поддржуваме и банкарски трансфери преку про-фактура за ваша погодност.',
        },
      ]
    : [
        {
          q: 'How can I activate my ad promotion?',
          a: 'Activating a promotion is seamless. If you have already submitted your ad, simply open it and click the "Promote" link next to the star icon to choose your boost. Registered users can also manage activations directly from their account dashboard for maximum efficiency.',
        },
        {
          q: 'How long do ads remain promoted?',
          a: 'All professional boosts remain active for a full 14-day cycle. Once this period expires, your listing transitions back to a standard free ad automatically, ensuring your ad stays published without interruption.',
        },
        {
          q: "Why doesn't my premium ad appear at the very top?",
          a: 'To ensure maximum fairness and variety, all promoted ads are displayed on the search page in a dynamic rotation. Listings are surfaced based on relevant viewer criteria: the region, the category, and specific keywords contained in your title.',
        },
        {
          q: 'What payment methods are supported?',
          a: 'We recommend paying with a debit or credit card for instant activation and secure processing. Alternatively, we also support bank transfers via pro-forma invoicing for your convenience.',
        },
      ];

  const handleSubscribe = async (planId: string, price: number) => {
    if (!session?.user?.id || !session?.user?.email) {
      toast.error(
        isMk
          ? 'Ве молиме најавете се за претплата'
          : 'Please sign in to subscribe',
      );
      router.push('/auth');
      return;
    }

    setIsProcessing(planId);
    const toastId = toast.loading(
      isMk
        ? 'Подготовка на безбедно плаќање...'
        : 'Setting up secure checkout...',
    );

    try {
      const { url } = await createStripeCheckoutSession(
        session.user.id,
        session.user.email,
        planId.toUpperCase(),
        price,
        'yearly',
      );

      toast.dismiss(toastId);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to start checkout');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        isMk
          ? 'Нешто тргна наопаку. Ве молиме обидете се повторно.'
          : 'Something went wrong. Please try again.',
      );
      console.error(error);
      setIsProcessing(null);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <section className='relative overflow-hidden bg-muted/30 border-b border-border/50'>
        <div className='container-wide py-10 md:py-12 text-center'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-2xl md:text-4xl font-black tracking-tight text-foreground mb-3'
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-sm md:text-base text-muted-foreground max-w-2xl mx-auto'
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Main Options */}
      <section className='container-wide py-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
          {/* Individual Verification */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className='h-full border-primary/20 shadow-lg shadow-primary/5 hover:border-primary/40 transition-all relative overflow-hidden rounded-2xl'>
              <div className='absolute top-0 right-0 p-3'>
                <User className='w-10 h-10 text-primary/10' />
              </div>
              <CardHeader className='p-5 pb-3'>
                <div className='inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold w-fit mb-2'>
                  {t('for_individuals')}
                </div>
                <CardTitle className='text-xl'>{t('verified_user')}</CardTitle>
                <CardDescription className='text-xs'>{t('verified_desc')}</CardDescription>
              </CardHeader>
              <CardContent className='p-5 py-0 space-y-3'>
                <div className='flex items-baseline gap-1 mb-3'>
                  <span className='text-3xl font-black text-foreground'>
                    98
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    MKD/{isMk ? 'год' : 'year'}
                  </span>
                  <span className='text-[10px] text-muted-foreground ml-1'>
                    + {isMk ? 'ДДВ' : 'VAT'}
                  </span>
                </div>
                <ul className='space-y-2 text-xs'>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-green-500 mt-0.5' />
                    <span>
                      <strong className='text-foreground'>
                        {t('required_badge')}
                      </strong>{' '}
                      {t('required_to_post')}
                    </span>
                  </li>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-green-500 mt-0.5' />
                    <span>
                      {t('verified_badge')}{' '}
                      <BadgeCheck className='w-3 h-3 inline text-primary' />
                    </span>
                  </li>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-green-500 mt-0.5' />
                    <span>{t('listing_limit')}</span>
                  </li>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-green-500 mt-0.5' />
                    <span>{t('promotion_access')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className='p-5 pt-4'>
                <Button
                  className='w-full font-bold h-10 text-[11px] uppercase tracking-wider rounded-xl'
                  size='default'
                  onClick={() => handleSubscribe('verified', 98)}
                  disabled={!!isProcessing}
                >
                  {isProcessing === 'verified'
                    ? t('processing')
                    : t('get_verified_btn')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Business Subscription */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className='h-full border-amber-500/20 shadow-lg shadow-amber-500/5 hover:border-amber-500/40 transition-all relative overflow-hidden rounded-2xl'>
              <div className='absolute top-0 right-0 p-3'>
                <Briefcase className='w-10 h-10 text-amber-500/10' />
              </div>
              <CardHeader className='p-5 pb-3'>
                <div className='inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold w-fit mb-2'>
                  {t('for_businesses')}
                </div>
                <CardTitle className='text-xl'>
                  {t('business_premium')}
                </CardTitle>
                <CardDescription className='text-xs'>{t('business_desc')}</CardDescription>
              </CardHeader>
              <CardContent className='p-5 py-0 space-y-3'>
                <div className='flex items-baseline gap-1 mb-3'>
                  <span className='text-3xl font-black text-foreground'>
                    450
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    MKD/{isMk ? 'год' : 'year'}
                  </span>
                  <span className='text-[10px] text-muted-foreground ml-1'>
                    + {isMk ? 'ДДВ' : 'VAT'}
                  </span>
                </div>
                <ul className='space-y-2 text-xs'>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-amber-500 mt-0.5' />
                    <span>
                      <strong className='text-foreground'>
                        {t('unlimited')}
                      </strong>{' '}
                      {t('unlimited_listings')}
                    </span>
                  </li>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-amber-500 mt-0.5' />
                    <span>{t('custom_shop')}</span>
                  </li>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-amber-500 mt-0.5' />
                    <span>{t('advanced_analytics')}</span>
                  </li>
                  <li className='flex gap-2 items-start'>
                    <Check className='w-4 h-4 text-amber-500 mt-0.5' />
                    <span>{t('multi_user')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className='p-5 pt-4'>
                <Button
                  className='w-full font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 h-10 text-[11px] uppercase tracking-wider rounded-xl'
                  size='default'
                  onClick={() => handleSubscribe('business', 450)}
                  disabled={!!isProcessing}
                >
                  {isProcessing === 'business'
                    ? t('processing')
                    : t('go_business_btn')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Promotion Options */}
      <section className='bg-muted/30 py-12 border-y border-border/50'>
        <div className='container-wide'>
          <div className='text-center max-w-2xl mx-auto mb-10'>
            <div className='inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold mb-3'>
              <Rocket className='w-3 h-3' />
              {t('boost_sales')}
            </div>
            <h2 className='text-2xl font-black tracking-tight mb-3'>
              {t('promotion_options')}
            </h2>
            <p className='text-sm text-muted-foreground'>{t('promotion_subtitle')}</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
            {PROMOTIONS.map((promo, i) => {
              const title =
                isMk && promo.id === 'HOMEPAGE'
                  ? 'Истакнато на Почетна'
                  : isMk && promo.id === 'PREMIUM_SECTOR'
                    ? 'Премиум Странична Лента'
                    : isMk && promo.id === 'TOP_POSITION'
                      ? 'Елитна Топ Позиција'
                      : isMk && promo.id === 'DAILY_BUMP'
                        ? 'Автоматско Дневно Освежување'
                        : promo.title;

              const description =
                isMk && promo.id === 'HOMEPAGE'
                  ? 'Елитно поставување на нашата главна почетна страница. Обезбедете максимална видливост со илјадници дневни импресии од моментот кога корисниците ќе пристигнат.'
                  : isMk && promo.id === 'PREMIUM_SECTOR'
                    ? 'Добијте постојано присуство во нашиот ексклузивен премиум сектор. Овие посветени слотови на страничната лента за резултати од пребарување гарантираат дека вашиот оглас ќе биде виден од сите.'
                    : isMk && promo.id === 'TOP_POSITION'
                      ? 'Останете над конкуренцијата. Вашиот оглас ќе биде закочен на врвот од неговата категорија и резултатите од пребарувањето, осигурувајќи дека ќе биде првото нешто што купувачите ќе го видат.'
                      : isMk && promo.id === 'DAILY_BUMP'
                        ? 'Одржувајте го вашиот оглас свеж. Секој ден, вашиот оглас автоматски се поставува на врвот на најновите резултати, токму како штотуку повторно да сте го објавиле.'
                        : promo.description;

              const days = isMk ? '14 Дена' : '14 days';

              return (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={cn(
                      'h-full border-2 hover:shadow-lg transition-all group relative overflow-hidden',
                      promo.borderColor,
                    )}
                  >
                    {promo.isMain && (
                      <div className='absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl'>
                        {t('popular')}
                      </div>
                    )}
                    <CardHeader className='p-4 pb-2'>
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center mb-2.5',
                          promo.bgColor,
                        )}
                      >
                        <PromotionIcon
                          iconName={promo.icon}
                          className={cn('w-5 h-5', promo.color)}
                        />
                      </div>
                      <CardTitle className='text-base font-bold'>
                        {title}
                      </CardTitle>
                      <CardDescription className='font-bold text-[10px] uppercase tracking-wider text-primary'>
                        {days}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='p-4 pt-0'>
                      <p className='text-xs text-muted-foreground leading-relaxed min-h-[60px]'>
                        {description}
                      </p>
                    </CardContent>
                    <CardFooter className='p-4 pt-3 border-t border-border/10'>
                      <div className='flex items-baseline justify-between w-full'>
                        <span className='font-black text-lg'>
                          {promo.price}{' '}
                          <span className='text-[10px] font-medium text-muted-foreground uppercase'>
                            MKD
                          </span>
                        </span>
                        <span className='text-[9px] uppercase font-bold text-muted-foreground'>
                          + {isMk ? 'ДДВ' : 'VAT'}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className='text-center mt-8'>
            <p className='text-sm text-muted-foreground mb-4'>
              {t('promote_hint')}
            </p>
            <Button variant='outline' asChild className='rounded-full'>
              <Link href='/my-listings'>{t('go_to_listings')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='container-wide py-12'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-xl md:text-2xl font-black mb-6 flex items-center gap-2'>
            <HelpCircle className='w-5 h-5 text-primary' />
            {t('faq_title')}
          </h2>
          <div className='grid gap-4'>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className='bg-card border border-border/50 rounded-xl p-5'
              >
                <h3 className='font-bold text-base mb-2'>{faq.q}</h3>
                <p className='text-muted-foreground leading-relaxed text-xs'>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className='border-t border-border/50 bg-muted/10 py-10'>
        <div className='container-wide text-center'>
          <h3 className='font-bold mb-4 text-sm'>{t('secure_payments')}</h3>
          <div className='flex flex-wrap justify-center gap-4 sm:gap-6 items-center opacity-70 grayscale hover:grayscale-0 transition-all'>
            <div className='flex items-center gap-2 bg-background border border-border/50 px-3 py-1.5 rounded-lg'>
              <CreditCard className='w-4 h-4' />
              <span className='font-bold text-xs'>
                {isMk ? 'Кредитна/Дебитна Картичка' : 'Credit/Debit Card'}
              </span>
            </div>
            <div className='flex items-center gap-2 bg-background border border-border/50 px-3 py-1.5 rounded-lg'>
              <Activity className='w-4 h-4' />
              <span className='font-bold text-xs'>
                {isMk ? 'Банкарски Трансфер' : 'Bank Transfer'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
