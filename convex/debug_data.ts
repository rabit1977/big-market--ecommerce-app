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
