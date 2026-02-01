'use server';

import { api, convex } from '@/lib/convex-server';

export async function getPublicCategoriesAction() {
  try {
    const categories = await convex.query(api.categories.list);
    return { 
        success: true, 
        categories: categories.map(c => ({
            id: c._id,
            name: c.name,
            slug: c.slug,
            image: c.image || null,
            parentId: c.parentId ?? null
        }))
    };
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return { success: false, categories: [] };
  }
}
