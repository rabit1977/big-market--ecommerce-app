'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  parentId: z.string().optional().nullable(),
  template: z.any().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export async function getCategories() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const categories = await convex.query(api.categories.list);
    
    // Map to include parent names for the UI if needed
    const enriched = categories.map(c => ({
        ...c,
        id: c._id,
        _count: { children: 0 }, // Simplified for now
        parent: c.parentId ? { name: categories.find(p => p._id === c.parentId)?.name } : null
    }));

    return { success: true, categories: enriched };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories' };
  }
}

export async function createCategory(data: CategoryFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const existing = await convex.query(api.categories.getBySlug, { slug: result.data.slug });
    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const categoryId = await convex.mutation(api.categories.create, {
        ...result.data,
        parentId: result.data.parentId || undefined
    });

    revalidatePath('/admin/categories');
    return { success: true, category: { id: categoryId } };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    await convex.mutation(api.categories.update, {
        id: id as any,
        ...result.data,
        parentId: result.data.parentId || undefined
    });

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await convex.mutation(api.categories.remove, { id: id as any });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
