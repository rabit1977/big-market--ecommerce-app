import { v } from "convex/values";
import { query } from "./_generated/server";

export const findByAny = query({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const matches = users.filter(u => 
        (u.name?.toLowerCase().includes(args.text.toLowerCase())) ||
        (u.email?.toLowerCase().includes(args.text.toLowerCase())) ||
        (u.externalId?.toLowerCase().includes(args.text.toLowerCase())) ||
        (u._id === args.text)
    );
    
    return matches.map(u => ({
        _id: u._id,
        externalId: u.externalId,
        name: u.name,
        email: u.email,
        posted: u.listingsPostedCount || 0
    }));
  }
});

export const searchAllListings = query({
    args: { contactEmail: v.string() },
    handler: async (ctx, args) => {
        const listings = await ctx.db.query("listings").collect();
        return listings.filter(l => 
            l.contactEmail?.toLowerCase() === args.contactEmail.toLowerCase()
        ).map(l => ({ _id: l._id, title: l.title, userId: l.userId }));
    }
});

export const quickStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const listings = await ctx.db.query("listings").collect();
    const inquiries = await ctx.db.query("listingInquiries").collect();
    const categories = await ctx.db.query("categories").collect();
    
    return {
        users: users.length,
        listings: listings.length,
        inquiries: inquiries.length,
        categories: categories.length,
    };
  }
});

export const investigateOrphans = query({
    args: {},
    handler: async (ctx) => {
        const listings = await ctx.db.query("listings").collect();
        const users = await ctx.db.query("users").collect();
        const userIds = new Set(users.map(u => u.externalId));
        const internalIds = new Set(users.map(u => u._id as string));
        
        return listings.filter(l => !userIds.has(l.userId) && !internalIds.has(l.userId)).map(l => ({
            _id: l._id,
            title: l.title,
            userId: l.userId,
            contactEmail: l.contactEmail
        }));
    }
});
