
export const PROMOTIONS = [
    {
        id: 'HOMEPAGE',
        title: 'Homepage Spotlight',
        description: 'Elite placement on our main landing page. Secure maximum visibility with thousands of daily impressions from the moment users arrive.',
        days: '14 days', 
        price: 170,
        color: 'text-primary',
        bgColor: 'bg-primary/5',
        borderColor: 'border-primary/20',
        badgeColor: 'bg-primary',
        icon: 'Rocket',
        isMain: true
    },
    {
        id: 'TOP_POSITIONING',
        title: 'Top Tier Placement',
        description: 'Command attention by staying at the very top of search results. Your ad will rotate in the privileged top slots for all relevant category searches.',
        days: '14 days',
        price: 160,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/5',
        borderColor: 'border-amber-500/20',
        badgeColor: 'bg-amber-500',
        icon: 'Star',
        isMain: false
    },
    {
        id: 'PREMIUM_SECTOR',
        title: 'Premium Sidebar Boost',
        description: 'Gain a permanent presence in our exclusive premium sector. These dedicated slots on the search results sidebar ensure your ad is seen by every browser.',
        days: '14 days',
        price: 100,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/5',
        borderColor: 'border-blue-500/20',
        badgeColor: 'bg-blue-500',
        icon: 'Crown',
        isMain: false
    },
    {
        id: 'LISTING_HIGHLIGHT',
        title: 'Visual Highlight',
        description: 'Make your listing pop with a distinctive background and border. This visual contrast separates your ad from standard listings, driving higher click-through rates.',
        days: '14 days',
        price: 60,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/5',
        borderColor: 'border-emerald-500/20',
        badgeColor: 'bg-emerald-600',
        icon: 'Eye',
        isMain: false
    },
    {
        id: 'AUTO_DAILY_REFRESH',
        title: 'Smart Daily Bump',
        description: 'Automate your success. We will automatically refresh your ad to the top of the listings every day at 13:00, ensuring it stays fresh and relevant.',
        days: '14 days',
        price: 60,
        color: 'text-purple-600',
        bgColor: 'bg-purple-600/5',
        borderColor: 'border-purple-600/20',
        badgeColor: 'bg-purple-600',
        icon: 'Zap',
        isMain: false
    }
] as const;

export type PromotionTier = typeof PROMOTIONS[number]['id'];

export const getPromotionConfig = (tier: string | null | undefined) => {
    return PROMOTIONS.find(p => p.id === tier);
};
