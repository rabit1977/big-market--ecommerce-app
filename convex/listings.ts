import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("listings").order("desc").collect();
    // Prioritize promoted
    return results.sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      return 0;
    });
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
    isTradePossible: v.optional(v.boolean()),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),
    isPromoted: v.optional(v.boolean()),
    dateRange: v.optional(v.string()),
    dynamicFilters: v.optional(v.string()), // JSON string of filters
  },
  handler: async (ctx, args) => {
    console.log("API list called with args:", args);

    // 1. Fetch EVERYTHING (simplest, most robust approach given < 10k listings)
    // We rely on in-memory filtering to avoid index complexity bugs
    let results = await ctx.db.query("listings").order("desc").collect();
    
    // 2. Filter Loops
    
    // Status
    if (args.status) {
      results = results.filter(r => r.status === args.status);
    }
    
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
        // E.g., filter="refrigerators", listing="combined-refrigerators"
        // Check if "refrigerators" is parent or grandparent of "combined-refrigerators"
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
    if (args.adType) results = results.filter(r => r.adType === args.adType);
    if (args.condition && args.condition !== 'all') results = results.filter(r => r.condition === args.condition);
    if (args.isTradePossible !== undefined) results = results.filter(r => r.isTradePossible === args.isTradePossible);
    if (args.hasShipping !== undefined) results = results.filter(r => r.hasShipping === args.hasShipping);
    if (args.isVatIncluded !== undefined) results = results.filter(r => r.isVatIncluded === args.isVatIncluded);
    if (args.isAffordable !== undefined) results = results.filter(r => r.isAffordable === args.isAffordable);
    if (args.isPromoted !== undefined) results = results.filter(r => r.isPromoted === args.isPromoted);
    
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
      // 1. Promoted always first
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      
      // 2. Apply Custom Sort
      switch (args.sort) {
          case 'price-asc': // Low to High
              return a.price - b.price;
          case 'price-desc': // High to Low
              return b.price - a.price;
          case 'oldest':
              return (a.createdAt || 0) - (b.createdAt || 0);
          case 'newest':
          default:
              // Fallback to Priority then Date
              const pA = a.priority || 0;
              const pB = b.priority || 0;
              if (pA !== pB) return pB - pA;
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
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("listings", {
      ...args,
      status: "ACTIVE",
      createdAt: Date.now(),
      viewCount: 0,
    });
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listings")
      .withSearchIndex("search_title", (q) => q.search("title", args.query))
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
    
    // System Fields
    createdAt: v.optional(v.number()),
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()),
    promotionExpiresAt: v.optional(v.number()),
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
