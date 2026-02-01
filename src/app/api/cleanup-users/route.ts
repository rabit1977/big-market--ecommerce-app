import { api, convex } from '@/lib/convex-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await convex.mutation(api.cleanup.clearAllUsers, {});
    return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.deleted} users` 
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
