import { api, convex } from '@/lib/convex-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email parameter required. Use: /api/make-admin?email=your@email.com' 
      }, { status: 400 });
    }

    // Get all users with this email
    const users = await convex.query(api.users.list, {});
    const matchingUsers = users.filter(u => u.email === email);
    
    if (matchingUsers.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: `No user found with email: ${email}` 
      }, { status: 404 });
    }

    // Update the first matching user to ADMIN
    const user = matchingUsers[0];
    await convex.mutation(api.users.update, {
      id: user._id,
      role: 'ADMIN'
    });

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} is now an ADMIN`,
      userId: user._id
    });
  } catch (error) {
    console.error('Make admin error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
