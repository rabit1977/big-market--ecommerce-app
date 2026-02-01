import { api, convex } from '@/lib/convex-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await convex.query(api.categories.list, {});
    
    // Find categories with templates
    const withTemplates = categories.filter(c => c.template && c.template.fields && c.template.fields.length > 0);
    
    return NextResponse.json({ 
        success: true, 
        totalCategories: categories.length,
        categoriesWithTemplates: withTemplates.length,
        examples: withTemplates.slice(0, 3).map(c => ({
          id: c._id,
          name: c.name,
          templateFields: c.template?.fields?.length || 0
        }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
