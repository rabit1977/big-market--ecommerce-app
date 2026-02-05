
import { Doc } from '../../../convex/_generated/dataModel';

export type CategoryNode = Doc<"categories"> & {
    children: CategoryNode[];
};

export const buildCategoryTree = (categories: Doc<"categories">[]): CategoryNode[] => {
    const categoryMap = new Map<string, CategoryNode>();
    
    // First pass: create nodes
    categories.forEach(cat => {
        categoryMap.set(cat._id, { ...cat, children: [] });
    });

    const rootCategories: CategoryNode[] = [];

    // Second pass: link children to parents
    categories.forEach(cat => {
        const node = categoryMap.get(cat._id)!;
        if (cat.parentId) {
             const parent = categoryMap.get(cat.parentId);
             if (parent) {
                 parent.children.push(node);
             } else {
                 // Fallback: if parent not found, show at root so it's accessible
                 rootCategories.push(node);
             }
        } else {
            rootCategories.push(node);
        }
    });

    return rootCategories;
};
