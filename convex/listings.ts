import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .order("desc")
      .collect();
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
  },
  handler: async (ctx, args) => {
    console.log("API list called with args:", args);

    // 1. Fetch data based on status (default to ACTIVE)
    const statusFilter = args.status || "ACTIVE";
    let results;
    if (statusFilter === "ALL") {
      results = await ctx.db
        .query("listings")
        .withIndex("by_createdAt")
        .order("desc")
        .collect();
    } else {
      results = await ctx.db
        .query("listings")
        .withIndex("by_status_createdAt", (q) => q.eq("status", statusFilter))
        .order("desc")
        .collect();
    }
    
    // 2. Filter Loops
    
    // Category - exact match or hierarchical match (case-insensitive)
    if (args.category && args.category !== 'all') {
      const filterCategory = args.category.toLowerCase();
      results = results.filter(r => {
        if (!r.category) return false;
        const listingCat = r.category.toLowerCase();
        
        // Exact match on category (case-insensitive)
        if (listingCat === filterCategory) return true;
        
        // If subCategory contains the category slug, it's a child category
        if (r.subCategory && r.subCategory.toLowerCase().includes(filterCategory)) return true;
        
        return false;
      });
    }
    
    // SubCategory - exact match or hierarchical match (case-insensitive)
    if (args.subCategory && args.subCategory !== '' && args.subCategory !== 'all') {
      const filterSub = args.subCategory.toLowerCase();
      console.log('Filtering by subCategory:', filterSub);
      
      // Get all categories to check hierarchy
      const allCategories = await ctx.db.query("categories").collect();
      const categoryMap = new Map(allCategories.map(c => [c.slug.toLowerCase(), c]));
      
      // Helper function to check if a category is an ancestor of another
      const isAncestor = (potentialAncestorSlug: string, childSlug: string): boolean => {
        const child = categoryMap.get(childSlug);
        if (!child || !child.parentId) return false;
        
        const parent = allCategories.find(c => c._id === child.parentId);
        if (!parent) return false;
        
        // Check if parent matches
        if (parent.slug.toLowerCase() === potentialAncestorSlug) return true;
        
        // Recursively check grandparents
        return isAncestor(potentialAncestorSlug, parent.slug.toLowerCase());
      };
      
      results = results.filter(r => {
        if (!r.subCategory) return false;
        const listingSub = r.subCategory.toLowerCase();
        console.log(`  Comparing filter "${filterSub}" with listing "${listingSub}"`);
        
        // Exact match (case-insensitive)
        if (listingSub === filterSub) {
          console.log('    ✓ Exact match!');
          return true;
        }
        
        // Check if filter is an ancestor of the listing's subcategory
        if (isAncestor(filterSub, listingSub)) {
          console.log('    ✓ Ancestor match!');
          return true;
        }
        
        // Check path-based matching for deeper hierarchies (fallback)
        if (listingSub.startsWith(filterSub + '/')) {
          console.log('    ✓ Path match!');
          return true;
        }
        
        // Check if filter is more specific and listing matches the parent
        if (filterSub.startsWith(listingSub + '/')) {
          console.log('    ✓ Parent match!');
          return true;
        }
        
        console.log('    ✗ No match');
        return false;
      });
    }
    
    // Location
    if (args.city && args.city !== 'all') {
        const searchCity = args.city.toLowerCase();
        results = results.filter(r => r.city?.toLowerCase() === searchCity);
    }

    // Price
    if (args.minPrice !== undefined) results = results.filter(r => r.price >= args.minPrice!);
    if (args.maxPrice !== undefined) results = results.filter(r => r.price <= args.maxPrice!);

    // Other filters
    if (args.userType) results = results.filter(r => r.userType === args.userType);
    
    // Multi-value adType filter (comma-separated)
    if (args.adType) {
      const types = args.adType.split(',').map(t => t.trim());
      results = results.filter(r => r.adType && types.includes(r.adType));
    }
    
    // Multi-value condition filter (comma-separated)
    if (args.condition && args.condition !== 'all') {
      const conditions = args.condition.split(',').map(c => c.trim());
      results = results.filter(r => r.condition && conditions.includes(r.condition));
    }
    
    if (args.isTradePossible !== undefined) results = results.filter(r => r.isTradePossible === args.isTradePossible);
    if (args.hasShipping !== undefined) results = results.filter(r => r.hasShipping === args.hasShipping);
    if (args.isVatIncluded !== undefined) results = results.filter(r => r.isVatIncluded === args.isVatIncluded);
    if (args.isAffordable !== undefined) results = results.filter(r => r.isAffordable === args.isAffordable);
    
    // Date Range
    if (args.dateRange && args.dateRange !== 'all') {
      const now = Date.now();
      let threshold = 0;
      if (args.dateRange === 'today') threshold = now - 24 * 60 * 60 * 1000;
      if (args.dateRange === '3days') threshold = now - 3 * 24 * 60 * 60 * 1000;
      if (args.dateRange === '7days') threshold = now - 7 * 24 * 60 * 60 * 1000;
      
      if (threshold > 0) {
        results = results.filter(r => r._creationTime >= threshold);
      }
    }

    // Dynamic Specifications Filter
    if (args.dynamicFilters) {
      try {
        const filters = JSON.parse(args.dynamicFilters);
        results = results.filter(r => {
          if (!r.specifications) return false;
          
          return Object.entries(filters).every(([key, value]) => {
            const itemValue = r.specifications[key];
            if (itemValue === undefined) return false;
            
            // Handle different types of comparisons
            if (Array.isArray(value)) {
               // Range [min, max]
               if (typeof itemValue === 'number' && value.length === 2 && typeof value[0] === 'number') {
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
        console.error("Failed to parse dynamic filters", e);
      }
    }

    console.log(`Returning ${results.length} listings`);

    // Sort logic
    return results.sort((a, b) => {
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
              return (b.createdAt || b._creationTime) - (a.createdAt || a._creationTime);
      }
    });
  },
});

export const getById = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("listings")) },
  handler: async (ctx, args) => {
    const results = await Promise.all(args.ids.map(id => ctx.db.get(id)));
    return results.filter(r => r !== null);
  },
});

export const getByUser = query({
  args: { userId: v.string(), search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", args.userId))
      .order("desc") 
      .collect();

    if (args.search) {
        const query = args.search.toLowerCase();
        return listings.filter(l => l.title.toLowerCase().includes(query));
    }

    return listings;
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
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check Listing Limit (50 per year/total for verified)
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");

    const limit = user.listingLimit ?? 50;
    const currentCount = user.listingsPostedCount ?? 0;

    if (currentCount >= limit && user.role !== 'ADMIN') {
        throw new Error(`Limit reached: You can only post up to ${limit} listings.`);
    }

    const listingId = await ctx.db.insert("listings", {
      ...args,
      status: "PENDING_APPROVAL", 
      createdAt: Date.now(),
      viewCount: 0,
    });

    // Increment count
    await ctx.db.patch(user._id, {
        listingsPostedCount: currentCount + 1
    });

    return listingId;
  },
});

export const renewListing = mutation({
  args: { 
    id: v.id("listings"),
    userId: v.string() 
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error("Listing not found");
    if (listing.userId !== args.userId) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const currentYear = now.getFullYear();

    // 1. Reset Monthly Quota if Month Changed
    let monthlyUsed = user.monthlyRenewalsUsed ?? 0;
    if (user.lastRenewalMonth !== currentMonth) {
        monthlyUsed = 0;
    }

    // 2. Check Monthly Limit (15)
    if (monthlyUsed >= 15 && user.role !== 'ADMIN') {
        throw new Error("Monthly renewal limit (15) reached.");
    }

    // 3. Check Daily Limit (Once per day per user)
    if (user.lastRenewalTimestamp) {
        const lastDate = new Date(user.lastRenewalTimestamp);
        if (lastDate.getDate() === currentDay && 
            lastDate.getMonth() === currentMonth && 
            lastDate.getFullYear() === currentYear &&
            user.role !== 'ADMIN') {
            throw new Error("You have already renewed a listing today. Only one renewal per day is allowed.");
        }
    }

    // 4. Perform Renewal (Update createdAt to move to top)
    await ctx.db.patch(args.id, {
        createdAt: Date.now(),
        // Keep active status if it was already active
        status: listing.status === 'PENDING_APPROVAL' ? 'PENDING_APPROVAL' : 'ACTIVE'
    });

    // 5. Update User Stats
    await ctx.db.patch(user._id, {
        monthlyRenewalsUsed: monthlyUsed + 1,
        lastRenewalTimestamp: Date.now(),
        lastRenewalMonth: currentMonth
    });

    return { success: true, remainingMonthly: 14 - monthlyUsed };
  }
});

export const getRenewalStats = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
            .unique();
        
        if (!user) return null;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        
        let monthlyUsed = user.monthlyRenewalsUsed ?? 0;
        if (user.lastRenewalMonth !== currentMonth) {
            monthlyUsed = 0;
        }

        let hasUsedToday = false;
        if (user.lastRenewalTimestamp) {
            const lastDate = new Date(user.lastRenewalTimestamp);
            if (lastDate.getDate() === currentDay && 
                lastDate.getMonth() === currentMonth && 
                lastDate.getFullYear() === now.getFullYear()) {
                hasUsedToday = true;
            }
        }

        return {
            usedThisMonth: monthlyUsed,
            limitMonthly: 15,
            remainingMonthly: 15 - monthlyUsed,
            hasUsedToday,
            totalLimit: user.listingLimit ?? 50,
            totalPosted: user.listingsPostedCount ?? 0
        };
    }
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listings")
      .withSearchIndex("search_title", (q) => 
        q.search("title", args.query).eq("status", "ACTIVE")
      )
      .collect();
  },
});

// Admin: Approve Listing
export const approveListing = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "ACTIVE" });
  },
});

// Admin: Reject Listing
export const rejectListing = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "REJECTED" });
  },
});

// Admin: Get Pending Listings
export const getPendingListings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "PENDING_APPROVAL"))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("listings"),
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
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()),
    
    // System Fields
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
