import { api, convex } from '@/lib/convex-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to list all users
    const users = await convex.query(api.users.list, {});
    
    return NextResponse.json({ 
        success: true, 
        userCount: users.length,
        users: users.map(u => ({ id: u._id, email: u.email, name: u.name }))
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
