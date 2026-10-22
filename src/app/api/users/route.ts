import { NextResponse } from 'next/server';
import { fetchUsersFromDb, insertUserToDb, isDatabaseConfigured } from '@/lib/db';
import { RegisteredUser } from '@/types';

export async function GET() {
  const dbActive = isDatabaseConfigured();
  if (dbActive) {
    const dbUsers = await fetchUsersFromDb();
    if (dbUsers) {
      return NextResponse.json({
        success: true,
        source: 'supabase_postgres',
        users: dbUsers,
      });
    }
  }

  return NextResponse.json({
    success: true,
    source: 'local_storage',
    databaseConfigured: dbActive,
    message: dbActive
      ? 'Database connected but returned no rows'
      : 'Supabase DATABASE_URL configured. Update [YOUR-PASSWORD] in .env.local to activate direct cloud queries.',
  });
}

export async function POST(request: Request) {
  try {
    const body: RegisteredUser = await request.json();

    if (!body.companyName || !body.email || !body.fileName) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory fields' },
        { status: 400 }
      );
    }

    const dbActive = isDatabaseConfigured();
    let savedToDb = false;

    if (dbActive) {
      savedToDb = await insertUserToDb(body);
    }

    return NextResponse.json({
      success: true,
      savedToDb,
      user: body,
      source: savedToDb ? 'supabase_postgres' : 'client_synced',
    });
  } catch (err) {
    console.error('API /api/users error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const { deleteUserFromDb } = await import('@/lib/db');
    await deleteUserFromDb(id);
    return NextResponse.json({ success: true, deleted: id });
  }
  return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
}
