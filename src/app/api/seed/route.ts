import { api, convex } from '@/lib/convex-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call the Convex seed mutation
    await convex.mutation(api.seed.seedCategories, {});

    return NextResponse.json({ 
        success: true, 
        message: 'Convex database seeded with Big Market categories and templates.' 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
