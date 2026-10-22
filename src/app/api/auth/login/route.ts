import { NextResponse } from 'next/server';
import { fetchUserByEmailFromDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query from Supabase DB
    const dbUser = await fetchUserByEmailFromDb(trimmedEmail);

    if (dbUser) {
      // If user exists in DB, compare passwords
      const expectedPassword = dbUser.password || 'Password123!';

      if (dbUser.password && dbUser.password !== password) {
        return NextResponse.json(
          {
            success: false,
            error: 'Incorrect password. Please verify your credentials and try again.',
            field: 'password',
          },
          { status: 401 }
        );
      }

      if (!dbUser.password && password !== expectedPassword) {
        return NextResponse.json(
          {
            success: false,
            error: 'Incorrect password. Please verify your credentials and try again.',
            field: 'password',
          },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: dbUser.id,
          companyName: dbUser.companyName,
          email: dbUser.email,
        },
      });
    }

    // Account not found in Supabase
    return NextResponse.json(
      {
        success: false,
        error: 'No registered carrier found for this email address. Please register first.',
        field: 'email',
      },
      { status: 404 }
    );
  } catch (err) {
    console.error('Login authentication error:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication service temporarily unavailable.' },
      { status: 500 }
    );
  }
}
