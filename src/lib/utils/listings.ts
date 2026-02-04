/**
 * Utility for mapping Convex listing documents to the ListingWithRelations type used in the frontend.
 */
export const mapConvexListing = (l: any) => ({
    id: l._id,
    _id: l._id,
    title: l.title,
    description: l.description,
    price: l.price,
    category: l.category,
    subCategory: l.subCategory || null,
    thumbnail: l.thumbnail || null,
    city: l.city,
    status: l.status,
    userId: l.userId,
    createdAt: new Date(l._creationTime),
    updatedAt: new Date(l._creationTime),
    expiresAt: new Date(l._creationTime + 30*24*60*60*1000), // Default 30 days
    contactPhone: l.contactPhone || "",
    contactEmail: l.contactEmail || null,
    showPhonePublic: l.showPhonePublic || false,
    specifications: l.specifications || null,
    region: l.region || null,
    latitude: null,
    longitude: null,
    isFeatured: false,
    renewedAt: null,
    soldAt: null,
    viewCount: l.viewCount || 0,
    features: [],
    tags: [],
    images: (l.images || []).map((url: string, i: number) => ({
        id: `img-${i}`,
        url,
        position: i,
        listingId: l._id
    })),
    user: {
        id: l.userId,
        name: "User", 
        image: null,
        city: l.city
    },
    // New Fields
    userType: l.userType || null,
    adType: l.adType || null,
    condition: l.condition || null,
    isTradePossible: l.isTradePossible || false,
    hasShipping: l.hasShipping || false,
    isVatIncluded: l.isVatIncluded || false,
    isAffordable: l.isAffordable || false,
});
