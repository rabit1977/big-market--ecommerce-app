import { PRICING } from './pricing';

export const PROMOTIONS = [
    {
        id: 'HOMEPAGE',
        title: 'Homepage Spotlight',
        description: 'Elite placement on our main landing page. Secure maximum visibility with thousands of daily impressions from the moment users arrive.',
        days: '14 days',
        price: PRICING.PROMOTIONS.HOMEPAGE,
        color: 'text-primary',
        bgColor: 'bg-primary/5',
        borderColor: 'border-primary/20',
        badgeColor: 'bg-primary',
        icon: 'Rocket',
        isMain: true
    },
    {
        id: 'PREMIUM_SECTOR',
        title: 'Premium Sidebar Boost',
        description: 'Gain a permanent presence in our exclusive premium sector. These dedicated slots on the search results sidebar ensure your ad is seen by every browser.',
        days: '14 days',
        price: PRICING.PROMOTIONS.PREMIUM_SECTOR,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/5',
        borderColor: 'border-blue-500/20',
        badgeColor: 'bg-blue-500',
        icon: 'Crown',
        isMain: false
    },
    {
        id: 'TOP_POSITION',
        title: 'Elite Priority Placement',
        description: 'Stay above the competition. Your ad will be pinned to the top of its category and search results, ensuring it’s the first thing buyers see.',
        days: '14 days',
        price: PRICING.PROMOTIONS.TOP_POSITION,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/5',
        borderColor: 'border-amber-500/20',
        badgeColor: 'bg-amber-500',
        icon: 'Zap',
        isMain: false
    },
    {
        id: 'DAILY_BUMP',
        title: 'Automated Daily Refresh',
        description: 'Keep your listing fresh. Every day, your ad is automatically "bumped" to the top of the latest results, exactly as if you just posted it again.',
        days: '14 days',
        price: PRICING.PROMOTIONS.DAILY_BUMP,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/5',
        borderColor: 'border-emerald-500/20',
        badgeColor: 'bg-emerald-500',
        icon: 'Star',
        isMain: false
    }
] as const;

export type PromotionTier = typeof PROMOTIONS[number]['id'];

export const getPromotionConfig = (tier: string | null | undefined) => {
    return PROMOTIONS.find(p => p.id === tier);
};
