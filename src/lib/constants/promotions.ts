
export const PROMOTIONS = [
    {
        id: 'HOMEPAGE',
        title: 'Na Pocetna Strana',
        description: 'Showcase your listing on the main homepage for maximum visibility.',
        days: '14 days', 
        price: 170,
        color: 'text-primary', // Default/Black
        bgColor: 'bg-primary/5',
        borderColor: 'border-primary/20',
        badgeColor: 'bg-primary',
        icon: 'Megaphone',
        isMain: true
    },
    {
        id: 'TOP_POSITIONING',
        title: 'Top Positioning',
        description: 'Always at the top before others. Your ad will be displayed at the top of search results related to criteria for 14 days, rotating with other top-positioned ads.',
        days: '14 days',
        price: 160,
        color: 'text-amber-500', // Synced with ListingCard (Amber/Star)
        bgColor: 'bg-amber-500/5',
        borderColor: 'border-amber-500/20',
        badgeColor: 'bg-amber-500',
        icon: 'Star'
    },
    {
        id: 'PREMIUM_SECTOR',
        title: 'Premium Sector',
        description: 'Maximum visibility and improved reach. Your ad will be especially recognizable, getting more visitors and responses. Exclusive ads are shown on the right side of search results.',
        days: '14 days',
        price: 100,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/5',
        borderColor: 'border-blue-500/20',
        badgeColor: 'bg-blue-500',
        icon: 'Crown'
    },
    {
        id: 'LISTING_HIGHLIGHT',
        title: 'Listing Highlight',
        description: 'Your ad will be marked with a different background color in search results, separating it from other classifieds and catching the eye directly.',
        days: '14 days',
        price: 60,
        color: 'text-emerald-500', // Synced with ListingCard (Emerald/Eye)
        bgColor: 'bg-emerald-500/5',
        borderColor: 'border-emerald-500/20',
        badgeColor: 'bg-emerald-600',
        icon: 'Eye'
    },
    {
        id: 'AUTO_DAILY_REFRESH',
        title: 'Auto Daily Refresh',
        description: 'For 14 days, your ad is automatically refreshed daily as if it were just published, starting at 13:00.',
        days: '14 days',
        price: 60,
        color: 'text-purple-600', // Synced with ListingCard (Purple/Zap)
        bgColor: 'bg-purple-600/5',
        borderColor: 'border-purple-600/20',
        badgeColor: 'bg-purple-600',
        icon: 'Zap'
    }
] as const;

export type PromotionTier = typeof PROMOTIONS[number]['id'];

export const getPromotionConfig = (tier: string | null | undefined) => {
    return PROMOTIONS.find(p => p.id === tier);
};
