import { v } from 'convex/values';
import { mutation, MutationCtx, query } from './_generated/server';

// Helper to manage listing numbers
async function getNextListingNumber(ctx: MutationCtx): Promise<number> {
  let counter = await ctx.db
    .query('counters')
    .withIndex('by_name', (q) => q.eq('name', 'listings'))
    .unique();

  if (!counter) {
    const id = await ctx.db.insert('counters', {
      name: 'listings',
      nextId: 2,
      reusableIds: [],
    });
    // We can just return 1 here safely as we just created it
    return 1;
  }

  // Check reusable
  if (counter.reusableIds && counter.reusableIds.length > 0) {
    // Sort to use lowest first
    const sortedIds = [...counter.reusableIds].sort((a, b) => a - b);
    const idToUse = sortedIds.shift(); // Reading file.

    await ctx.db.patch(counter._id, {
      reusableIds: sortedIds,
    });

    return idToUse!;
  }

  // Use nextId
  const idToUse = counter.nextId;
  await ctx.db.patch(counter._id, {
    nextId: counter.nextId + 1,
  });

  return idToUse;
}

async function releaseListingNumber(ctx: MutationCtx, number: number) {
  const counter = await ctx.db
    .query('counters')
    .withIndex('by_name', (q) => q.eq('name', 'listings'))
    .unique();

  if (counter) {
    const reusableIds = counter.reusableIds || [];
    if (!reusableIds.includes(number)) {
      reusableIds.push(number);
      reusableIds.sort((a, b) => a - b);
      await ctx.db.patch(counter._id, { reusableIds });
    }
  }
}

export const getByListingNumber = query({
  args: { listingNumber: v.number() },
  handler: async (ctx, args) => {
    const listing = await ctx.db
      .query('listings')
      .withIndex('by_listingNumber', (q) =>
        q.eq('listingNumber', args.listingNumber),
      )
      .unique();

    if (!listing) return null;
    return await withCategoryNames(ctx, listing);
  },
});

async function withCategoryNames(ctx: any, listing: any) {
  const category = await ctx.db
    .query('categories')
    .withIndex('by_slug', (q: any) => q.eq('slug', listing.category))
    .unique();
  const subCategory = listing.subCategory
    ? await ctx.db
        .query('categories')
        .withIndex('by_slug', (q: any) => q.eq('slug', listing.subCategory))
        .unique()
    : null;

  return {
    ...listing,
    categoryName: category?.name,
    subCategoryName: subCategory?.name,
  };
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const listings = await ctx.db
      .query('listings')
      .withIndex('by_status', (q) => q.eq('status', 'ACTIVE'))
      .collect();

    const enriched = await Promise.all(
      listings.map((l) => withCategoryNames(ctx, l)),
    );

    const now = Date.now();
    return enriched.sort((a, b) => {
      const isTopA =
        a.isPromoted &&
        a.promotionTier === 'TOP_POSITIONING' &&
        (!a.promotionExpiresAt || a.promotionExpiresAt > now);
      const isTopB =
        b.isPromoted &&
        b.promotionTier === 'TOP_POSITIONING' &&
        (!b.promotionExpiresAt || b.promotionExpiresAt > now);

      if (isTopA && !isTopB) return -1;
      if (!isTopA && isTopB) return 1;

      // General promoted (any tier) next, EXCEPT AUTO_DAILY_REFRESH and LISTING_HIGHLIGHT
      // These tiers don't benefit from sticky/featured positioning
      const featuredTiers = ['AUTO_DAILY_REFRESH', 'LISTING_HIGHLIGHT'];
      const isPromotedA =
        a.isPromoted &&
        !featuredTiers.includes(a.promotionTier || '') &&
        (!a.promotionExpiresAt || a.promotionExpiresAt > now);
      const isPromotedB =
        b.isPromoted &&
        !featuredTiers.includes(b.promotionTier || '') &&
        (!b.promotionExpiresAt || b.promotionExpiresAt > now);

      if (isPromotedA && !isPromotedB) return -1;
      if (!isPromotedA && isPromotedB) return 1;

      return (
        (b.createdAt || b._creationTime) - (a.createdAt || a._creationTime)
      );
    });
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const listings = await ctx.db
      .query('listings')
      .withIndex('by_status', (q) => q.eq('status', 'ACTIVE'))
      .order('desc')
      .collect();

    // Filter for ACTIVE promoted listings (Excluding non-featured tiers)
    const featuredTiers = ['AUTO_DAILY_REFRESH', 'LISTING_HIGHLIGHT'];
    const filtered = listings.filter(
      (l) =>
        l.isPromoted === true &&
        !featuredTiers.includes(l.promotionTier || '') &&
        (!l.promotionExpiresAt || l.promotionExpiresAt > now),
    );

    return await Promise.all(filtered.map((l) => withCategoryNames(ctx, l)));
  },
});

export const list = query({
  args: {
    category: v.optional(v.string()),
    subCategory: v.optional(v.string()),
    status: v.optional(v.string()),
    city: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    sort: v.optional(v.string()),
    // Professional Filters
    userType: v.optional(v.string()),
    adType: v.optional(v.string()),
    condition: v.optional(v.string()),
    isTradePossible: v.optional(v.union(v.string(), v.boolean())),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),
    dateRange: v.optional(v.string()),
    dynamicFilters: v.optional(v.string()), // JSON string of filters
    limit: v.optional(v.number()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('API list called with args:', args);

    // 1. Fetch data based on status (default to ACTIVE)
    const statusFilter = args.status || 'ACTIVE';
    let results;
    if (statusFilter === 'ALL') {
      results = await ctx.db
        .query('listings')
        .withIndex('by_createdAt')
        .order('desc')
        .collect();
    } else {
      results = await ctx.db
        .query('listings')
        .withIndex('by_status_createdAt', (q) => q.eq('status', statusFilter))
        .order('desc')
        .collect();
    }

    if (results.length === 0) {
      const allCount = await ctx.db.query('listings').collect();
      console.log(`Diagnostic: Total listings in DB (any status): ${allCount.length}`);
      if (allCount.length > 0) {
        const statuses = [...new Set(allCount.map(l => l.status))];
        console.log(`Existing statuses in DB: ${statuses.join(', ')}`);
        console.log('Sample listing [0]:', { 
           title: allCount[0].title, 
           city: allCount[0].city, 
           status: allCount[0].status 
        });
      }
    }

    console.log(`Fetched ${results.length} listings with status ${statusFilter}`);
    if (results.length > 0) {
      console.log('Sample listing match [0]:', { 
        title: results[0].title, 
        city: results[0].city, 
        status: results[0].status 
      });
    }

    // 2. Filter Loops
    const normalize = (s?: string) => {
      if (!s) return '';
      let result = s.toLowerCase().trim();
      
      const cyrToLat: Record<string, string> = {
        'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'ѓ':'gj', 'е':'e', 'ж':'zh', 'з':'z', 'ѕ':'dz', 
        'и':'i', 'ј':'j', 'к':'k', 'л':'l', 'љ':'lj', 'м':'m', 'н':'n', 'њ':'nj', 'о':'o', 'п':'p', 
        'р':'r', 'с':'s', 'т':'t', 'ќ':'kj', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c', 'ч':'ch', 'џ':'dzh', 'ш':'sh',
        'č':'c', 'ć':'c', 'š':'s', 'ž':'z', 'đ':'d', 'gj':'g', 'kj':'k'
      };

      return result.split('').map(char => cyrToLat[char] || char).join('')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Category & SubCategory Unified filtering
    const categoryFilter = args.subCategory && args.subCategory !== 'all' ? args.subCategory : args.category;
    
    if (categoryFilter && categoryFilter !== 'all') {
      const filterSlug = categoryFilter.toLowerCase();
      
      // Get all categories to check hierarchy
      const allCategories = await ctx.db.query('categories').collect();
      const categoryMap = new Map(allCategories.map((c) => [c.slug.toLowerCase(), c]));

      // Helper function to check if a category is an ancestor of another
      const isAncestor = (ancestorSlug: string, childSlug: string): boolean => {
        let current = categoryMap.get(childSlug);
        while (current && current.parentId) {
          const parent = allCategories.find(c => c._id === current!.parentId);
          if (!parent) break;
          if (parent.slug.toLowerCase() === ancestorSlug) return true;
          current = parent;
        }
        return false;
      };

      results = results.filter((r) => {
        const rCat = normalize(r.category);
        const rSub = normalize(r.subCategory);
        
        // Match if direct category match
        if (rCat === filterSlug || rSub === filterSlug) return true;
        
        // Match if hierarchical ancestor
        if (rSub && isAncestor(filterSlug, rSub)) return true;
        if (rCat && isAncestor(filterSlug, rCat)) return true;

        return false;
      });
    }

    // Location Mapping for "Smart" filtering (Major City/Region -> Municipalities)
    // This handles older listings that might only have 'city' set but no 'region'
    const LOCATION_MAPPING: Record<string, string[]> = {
      'скопје': ['скопје', 'аеродром', 'бутел', 'гази баба', 'ѓорче петров', 'зелениково', 'карпош', 'кисела вода', 'петровец', 'сарај', 'сопиште', 'студеничани', 'центар', 'чаир', 'шуто оризари'],
      'битола': ['битола', 'новаци', 'могила', 'демир хисар'],
      'куманово': ['куманово', 'липково', 'старо нагоричане'],
      'прилеп': ['прилеп', 'долнени', 'кривогаштани'],
      'тетово': ['тетово', 'брвеница', 'јегуновце', 'теарце', 'желино', 'боговиње'],
      'велес': ['велес', 'чашка'],
      'охрид': ['охрид', 'дебрца'],
      'гостивар': ['гостивар', 'врапчиште', 'маврово и ростуше'],
      'штип': ['штип', 'карбинци', 'лесново'],
      'струмица': ['струмица', 'василево', 'босилово', 'ново село', 'радовиш', 'конче'],
      'кавадарци': ['кавадарци', 'росоман', 'неготино'],
      'кочани': ['кочани', 'чешиново-облешево', 'зрновци', 'виница'],
      'кичево': ['кичево', 'осломеј', 'вранештица', 'зајас', 'пласница', 'другово'],
      'струга': ['струга', 'вевчани'],
      'гевгелија': ['гевгелија', 'богданци', 'дојран', 'валандово'],
      'дебар': ['дебар', 'центар жупа', 'маврово и ростуше'],
      'крива паланка': ['крива паланка', 'кратово', 'ранковце'],
      'свети николе': ['свети николе', 'лозово'],
      'берово': ['берово', 'пехчево', 'делчево', 'македонска каменица']
    };

    if (args.city && args.city !== 'all') {
      const searchCity = normalize(args.city);
      
      // Normalized version of mappings
      const normalizedMapping: Record<string, string[]> = {};
      Object.entries(LOCATION_MAPPING).forEach(([k, v]) => {
        normalizedMapping[normalize(k)] = v.map(municipal => normalize(municipal));
      });

      const relatedMunicipalities = normalizedMapping[searchCity] || [searchCity];

      results = results.filter((r) => {
        const lCity = normalize(r.city);
        const lRegion = normalize(r.region);
        
        // 1. Direct match on city or region
        if (lCity === searchCity || lRegion === searchCity) return true;
        
        // 2. If we are searching for a MAJOR city (Region), match all its municipalities
        if (lCity && relatedMunicipalities.includes(lCity)) return true;
        
        return false;
      });
    }

    // Price
    if (args.minPrice !== undefined)
      results = results.filter((r) => r.price >= args.minPrice!);
    if (args.maxPrice !== undefined)
      results = results.filter((r) => r.price <= args.maxPrice!);

    // Other filters
    if (args.userType) {
      const uType = normalize(args.userType);
      results = results.filter((r) => normalize(r.userType) === uType);
    }

    // Multi-value adType filter (comma-separated)
    if (args.adType) {
      const types = args.adType.split(',').map((t) => t.trim().toLowerCase());
      results = results.filter((r) => r.adType && types.includes(r.adType.toLowerCase()));
    }

    // Multi-value condition filter (comma-separated)
    if (args.condition && args.condition !== 'all') {
      const conditions = args.condition.split(',').map((c) => c.trim().toLowerCase());
      results = results.filter((r) => {
        if (!r.condition) return false;
        const rCond = r.condition.toLowerCase().replace(/_/g, '-');
        return conditions.some(c => rCond.includes(c) || c.includes(rCond));
      });
    }

    if (args.isTradePossible !== undefined)
      results = results.filter(
        (r) => r.isTradePossible === args.isTradePossible,
      );
    if (args.hasShipping !== undefined)
      results = results.filter((r) => r.hasShipping === args.hasShipping);
    if (args.isVatIncluded !== undefined)
      results = results.filter((r) => r.isVatIncluded === args.isVatIncluded);
    if (args.isAffordable !== undefined)
      results = results.filter((r) => r.isAffordable === args.isAffordable);

    // Date Range
    if (args.dateRange && args.dateRange !== 'all') {
      const now = Date.now();
      let threshold = 0;
      if (args.dateRange === 'today') threshold = now - 24 * 60 * 60 * 1000;
      if (args.dateRange === '3days') threshold = now - 3 * 24 * 60 * 60 * 1000;
      if (args.dateRange === '7days') threshold = now - 7 * 24 * 60 * 60 * 1000;

      if (threshold > 0) {
        results = results.filter((r) => r._creationTime >= threshold);
      }
    }

    // Dynamic Specifications Filter
    if (args.dynamicFilters) {
      try {
        const filters = JSON.parse(args.dynamicFilters);
        results = results.filter((r) => {
          if (!r.specifications) return false;

          return Object.entries(filters).every(([key, value]) => {
            const itemValue = r.specifications[key];
            if (itemValue === undefined) return false;

            // Handle different types of comparisons
            if (Array.isArray(value)) {
              // Range [min, max]
              if (
                typeof itemValue === 'number' &&
                value.length === 2 &&
                typeof value[0] === 'number'
              ) {
                const [min, max] = value as [number, number];
                return itemValue >= min && itemValue <= max;
              }
              // Multi-select (OR logic)
              return (value as any[]).includes(itemValue);
            }

            // Exact match (string, boolean, number)
            return itemValue == value; // Loose equality for string/number mix
          });
        });
      } catch (e) {
        console.error('Failed to parse dynamic filters', e);
      }
    }

    console.log(`Returning ${results.length} listings`);

    // 3. User Filter
    if (args.userId) {
      results = results.filter((r) => r.userId === args.userId);
    }

    // 4. Final sorting: Promoted (Top Positioning) first, then by user choice
    const now = Date.now();
    const sortedResults = results.sort((a, b) => {
      // Helper to check if a listing has an active TOP_POSITIONING promotion
      const isTopA =
        a.isPromoted &&
        a.promotionTier === 'TOP_POSITIONING' &&
        (!a.promotionExpiresAt || a.promotionExpiresAt > now);
      const isTopB =
        b.isPromoted &&
        b.promotionTier === 'TOP_POSITIONING' &&
        (!b.promotionExpiresAt || b.promotionExpiresAt > now);

      if (isTopA && !isTopB) return -1;
      if (!isTopA && isTopB) return 1;

      // General promoted (any tier) next, EXCEPT non-featured tiers
      const featuredTiers = ['AUTO_DAILY_REFRESH', 'LISTING_HIGHLIGHT'];
      const isPromotedA =
        a.isPromoted &&
        !featuredTiers.includes(a.promotionTier || '') &&
        (!a.promotionExpiresAt || a.promotionExpiresAt > now);
      const isPromotedB =
        b.isPromoted &&
        !featuredTiers.includes(b.promotionTier || '') &&
        (!b.promotionExpiresAt || b.promotionExpiresAt > now);

      if (isPromotedA && !isPromotedB) return -1;
      if (!isPromotedA && isPromotedB) return 1;

      // Standard sorting
      switch (args.sort) {
        case 'price-asc': // Low to High
          return a.price - b.price;
        case 'price-desc': // High to Low
          return b.price - a.price;
        case 'oldest':
          return (a.createdAt || 0) - (b.createdAt || 0);
        case 'newest':
        default:
          // Fallback to Date
          return (
            (b.createdAt || b._creationTime) - (a.createdAt || a._creationTime)
          );
      }
    });

    // 5. Apply limit
    const limited = args.limit ? sortedResults.slice(0, args.limit) : sortedResults;

    return await Promise.all(limited.map((l) => withCategoryNames(ctx, l)));
  },
});

export const getById = query({
  args: { id: v.id('listings') },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) return null;
    return await withCategoryNames(ctx, listing);
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id('listings')) },
  handler: async (ctx, args) => {
    const results = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    const valid = results.filter((r) => r !== null);
    return await Promise.all(valid.map((l) => withCategoryNames(ctx, l)));
  },
});

export const getByUser = query({
  args: { userId: v.string(), search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // 1. Get the user robustly (by externalId or internal _id)
    let user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', args.userId))
      .unique();

    if (!user) {
      try {
        const potentialUser = (await ctx.db.get(args.userId as any)) as any;
        if (potentialUser && 'externalId' in potentialUser) {
          user = potentialUser;
        }
      } catch (e) {}
    }

    if (!user) {
      // If still no user, just try querying by the provided ID anyway
      return await ctx.db
        .query('listings')
        .withIndex('by_userId', (q) => q.eq('userId', args.userId))
        .collect();
    }

    const externalId = user.externalId;
    const internalId = user._id as string;

    // 2. Fetch listings for both IDs
    const listingsByExternal = await ctx.db
      .query('listings')
      .withIndex('by_userId', (q) => q.eq('userId', externalId))
      .collect();

    const listingsByInternal = await ctx.db
      .query('listings')
      .withIndex('by_userId', (q) => q.eq('userId', internalId))
      .collect();

    // Merge and deduplicate
    const existingIds = new Set(listingsByExternal.map((l) => l._id));
    let listings = [
      ...listingsByExternal,
      ...listingsByInternal.filter((l) => !existingIds.has(l._id)),
    ];

    // Final sort by creation time (descending)
    listings.sort(
      (a, b) =>
        (b.createdAt || b._creationTime) - (a.createdAt || a._creationTime),
    );

    if (args.search) {
      const queryStr = args.search.toLowerCase();
      listings = listings.filter((l) => l.title.toLowerCase().includes(queryStr));
    }

    return await Promise.all(listings.map((l) => withCategoryNames(ctx, l)));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    subCategory: v.optional(v.string()),
    city: v.string(),
    region: v.optional(v.string()),
    images: v.array(v.string()),
    thumbnail: v.optional(v.string()),
    userId: v.string(),
    specifications: v.optional(v.any()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    // New Fields
    userType: v.optional(v.string()),
    adType: v.optional(v.string()),
    condition: v.optional(v.string()),
    isTradePossible: v.optional(v.boolean()),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),
    isPriceNegotiable: v.optional(v.boolean()),
    acceptsPriceOffers: v.optional(v.boolean()),
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()),
    currency: v.optional(v.string()),
    clientNonce: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Idempotency Check
    if (args.clientNonce) {
      const existing = await ctx.db
        .query('listings')
        .withIndex('by_clientNonce', (q) =>
          q.eq('userId', args.userId).eq('clientNonce', args.clientNonce!),
        )
        .unique();

      if (existing) {
        console.log(
          'Duplicate listing submission detected, returning existing ID:',
          existing._id,
        );
        return existing._id;
      }
    }

    // 2. Check Listing Limit
    const user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', args.userId))
      .unique();

    if (!user) throw new Error('User not found');

    // 2. Check Listing Limit based on Membership Tier
    const tier = (user.membershipTier || '').toLowerCase();
    let limit = user.listingLimit;

    if (limit === undefined) {
      if (tier === 'business' || tier === 'pro') limit = 999999;
      else if (tier === 'verified') limit = 50;
      else limit = 0; // FREE users must verify to post
    }

    const currentCount = user.listingsPostedCount ?? 0;

    if (currentCount >= limit && user.role !== 'ADMIN') {
      if (limit === 0)
        throw new Error(
          'Verification required: You must be a Verified User to post listings. Please upgrade in the Premium section.',
        );
      throw new Error(
        `Limit reached: Your tier allows up to ${limit === 999999 ? 'unlimited' : limit} active listings. Upgrade for more.`,
      );
    }

    if (user.role !== 'ADMIN') {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentListings = await ctx.db
        .query('listings')
        .withIndex('by_userId', (q) => q.eq('userId', args.userId))
        .filter((q) => q.gt(q.field('createdAt'), oneDayAgo))
        .collect();

      if (recentListings.length >= 15) {
        throw new Error(
          'Daily limit reached: Due to anti-spam measures, you can only post up to 15 new listings per day.',
        );
      }
    }

    const listingNumber = await getNextListingNumber(ctx);

    const listingId = await ctx.db.insert('listings', {
      ...args,
      status: 'PENDING_APPROVAL',
      createdAt: Date.now(),
      viewCount: 0,
      currency: args.currency || 'MKD', // Default for legacy/omitted
      listingNumber,
    });

    // Increment count
    await ctx.db.patch(user._id, {
      listingsPostedCount: currentCount + 1,
    });

    return listingId;
  },
});

export const renewListing = mutation({
  args: {
    id: v.id('listings'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error('Listing not found');
    if (listing.userId !== args.userId) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', args.userId))
      .unique();

    if (!user) throw new Error('User not found');

    const now = Date.now();
    const currentMonth = new Date(now).getMonth();

    // 1. Reset Monthly Quota if Month Changed
    let monthlyUsed = user.monthlyRenewalsUsed ?? 0;
    if (user.lastRenewalMonth !== currentMonth) {
      monthlyUsed = 0;
    }

    // 2. Enforce 24-hour cooldown (admins bypass)
    if (user.role !== 'ADMIN' && user.lastRenewalTimestamp) {
      const hoursSinceLast =
        (now - user.lastRenewalTimestamp) / (1000 * 60 * 60);
      if (hoursSinceLast < 24) {
        const hoursLeft = Math.ceil(24 - hoursSinceLast);
        throw new Error(
          `You can renew again in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}. Renewals are allowed once every 24 hours.`,
        );
      }
    }

    // 3. Block for 'Verified' tier (Only Business/Pro can renew)
    const tier = (user.membershipTier || '').toLowerCase();
    if (user.role !== 'ADMIN' && tier === 'verified') {
      throw new Error(
        'Renewal is not included in the Verified plan. Upgrade to Business Premium to refresh your listings.',
      );
    }

    // 4. Check Monthly Limit (15)
    if (monthlyUsed >= 15 && user.role !== 'ADMIN') {
      throw new Error('Monthly renewal limit (15) reached.');
    }

    // 4. Perform Renewal (Update createdAt to move to top)
    await ctx.db.patch(args.id, {
      createdAt: now,
      status:
        listing.status === 'PENDING_APPROVAL' ? 'PENDING_APPROVAL' : 'ACTIVE',
    });

    // 5. Update User Stats
    await ctx.db.patch(user._id, {
      monthlyRenewalsUsed: monthlyUsed + 1,
      lastRenewalTimestamp: now,
      lastRenewalMonth: currentMonth,
    });

    return { success: true, remainingMonthly: 15 - (monthlyUsed + 1) };
  },
});

export const getRenewalStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', args.userId))
      .unique();

    if (!user) return null;

    const now = Date.now();
    const currentMonth = new Date(now).getMonth();

    let monthlyUsed = user.monthlyRenewalsUsed ?? 0;
    if (user.lastRenewalMonth !== currentMonth) {
      monthlyUsed = 0;
    }

    // Calculate 24-hour cooldown
    let canRenewNow = true;
    let hoursUntilRenew = 0;
    let nextRenewAt: number | null = null;

    if (user.lastRenewalTimestamp) {
      const hoursSinceLast =
        (now - user.lastRenewalTimestamp) / (1000 * 60 * 60);
      if (hoursSinceLast < 24) {
        canRenewNow = false;
        hoursUntilRenew = Math.ceil(24 - hoursSinceLast);
        nextRenewAt = user.lastRenewalTimestamp + 24 * 60 * 60 * 1000;
      }
    }

    return {
      usedThisMonth: monthlyUsed,
      limitMonthly: 15,
      remainingMonthly: 15 - monthlyUsed,
      canRenewNow,
      hoursUntilRenew,
      nextRenewAt,
      totalLimit: user.listingLimit ?? 50,
      totalPosted: user.listingsPostedCount ?? 0,
    };
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('listings')
      .withSearchIndex('search_title', (q) =>
        q.search('title', args.query).eq('status', 'ACTIVE'),
      )
      .collect();
  },
});

// Admin: Approve Listing
export const approveListing = mutation({
  args: { id: v.id('listings') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: 'ACTIVE' });

    const listing = await ctx.db.get(args.id);
    if (listing) {
      await ctx.db.insert('activityLogs', {
        userId: listing.userId,
        action: 'APPROVE_LISTING',
        targetId: args.id,
        targetType: 'listing',
        createdAt: Date.now(),
      });
    }
  },
});

// Admin: Reject Listing
export const rejectListing = mutation({
  args: { id: v.id('listings') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: 'REJECTED' });

    const listing = await ctx.db.get(args.id);
    if (listing) {
      await ctx.db.insert('activityLogs', {
        userId: listing.userId,
        action: 'REJECT_LISTING',
        targetId: args.id,
        targetType: 'listing',
        createdAt: Date.now(),
      });
    }
  },
});

// Admin: Get Pending Listings
export const getPendingListings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('listings')
      .withIndex('by_status', (q) => q.eq('status', 'PENDING_APPROVAL'))
      .order('desc')
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id('listings'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    subCategory: v.optional(v.string()),
    city: v.optional(v.string()),
    region: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),
    status: v.optional(v.string()),
    specifications: v.optional(v.any()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    // New Fields
    userType: v.optional(v.string()),
    adType: v.optional(v.string()),
    condition: v.optional(v.string()),
    isTradePossible: v.optional(v.boolean()),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),
    isPriceNegotiable: v.optional(v.boolean()),
    acceptsPriceOffers: v.optional(v.boolean()),
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()),
    currency: v.optional(v.string()),

    // System Fields
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;

    // Track price history if price is changing
    if (patch.price !== undefined) {
      const existingListing = await ctx.db.get(id);
      if (existingListing && existingListing.price !== patch.price) {
        (patch as any).previousPrice = existingListing.price;
      }
    }

    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id('listings') },
  handler: async (ctx, args) => {
    // 1. Find the listing to get the owner
    const listing = await ctx.db.get(args.id);
    if (!listing) return; // Already deleted or not found

    // 2. Find the user
    const user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', listing.userId))
      .unique();

    // 3. Decrement count if user exists and count > 0
    if (user && (user.listingsPostedCount || 0) > 0) {
      await ctx.db.patch(user._id, {
        listingsPostedCount: (user.listingsPostedCount || 1) - 1,
      });
    }

    // 4. Release ID
    if (listing.listingNumber !== undefined) {
      await releaseListingNumber(ctx, listing.listingNumber);
    }

    // 5. Delete the listing
    await ctx.db.delete(args.id);
  },
});

// CRON JOB: Mark listings as EXPIRED after 30 days
export const checkExpiringListings = mutation({
  args: {},
  handler: async (ctx) => {
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const expiryThreshold = now - THIRTY_DAYS_MS;

    // Find active listings older than 30 days
    const expiringListings = await ctx.db
      .query('listings')
      .withIndex('by_status', (q) => q.eq('status', 'ACTIVE'))
      .filter((q) => q.lt(q.field('createdAt'), expiryThreshold))
      .collect();

    let expiredCount = 0;

    for (const listing of expiringListings) {
      await ctx.db.patch(listing._id, { status: 'EXPIRED' });

      // Notify the user via the notifications table
      await ctx.db.insert('notifications', {
        userId: listing.userId,
        type: 'SYSTEM',
        title: 'Listing Expired',
        message: `Your listing "${listing.title}" has been active for 30 days and has automatically expired. You can renew it from your dashboard.`,
        isRead: false,
        createdAt: now,
        link: `/my-listings`,
      });

      expiredCount++;
    }

    console.log(`Cron: Expired ${expiredCount} listings older than 30 days.`);
    return { success: true, count: expiredCount };
  },
});

// CRON JOB: Warn users 3 days before their listing expires
export const notifyApproachingExpiry = mutation({
  args: {},
  handler: async (ctx) => {
    const TWENTY_SEVEN_DAYS_MS = 27 * 24 * 60 * 60 * 1000;
    const TWENTY_EIGHT_DAYS_MS = 28 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const thresholdStart = now - TWENTY_EIGHT_DAYS_MS;
    const thresholdEnd = now - TWENTY_SEVEN_DAYS_MS;

    // Find active listings that are exactly between 27 and 28 days old
    const approachingListings = await ctx.db
      .query('listings')
      .withIndex('by_status', (q) => q.eq('status', 'ACTIVE'))
      .filter((q) =>
        q.and(
          q.gt(q.field('createdAt'), thresholdStart),
          q.lte(q.field('createdAt'), thresholdEnd),
        ),
      )
      .collect();

    let notifyCount = 0;

    for (const listing of approachingListings) {
      await ctx.db.insert('notifications', {
        userId: listing.userId,
        type: 'SYSTEM',
        title: 'Listing Expiring Soon',
        message: `Your listing "${listing.title}" will expire in 3 days. Renew it now from your dashboard to keep it active.`,
        isRead: false,
        createdAt: now,
        link: `/my-listings`,
      });
      notifyCount++;
    }

    console.log(
      `Cron: Warned ${notifyCount} users about approaching listings expiry (3 days left).`,
    );
    return { success: true, count: notifyCount };
  },
});

// SEO: Fetch minimal listing data for sitemap generation
export const getSeoSitemapListings = query({
  args: {},
  handler: async (ctx) => {
    const listings = await ctx.db
      .query('listings')
      .withIndex('by_status', (q) => q.eq('status', 'ACTIVE'))
      .order('desc')
      .take(10000); // chunking to 10k max for Vercel functions memory limits

    return listings.map((l) => ({
      _id: l._id,
      createdAt: l.createdAt,
    }));
  },
});
