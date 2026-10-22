import { Pool } from 'pg';
import { RegisteredUser } from '@/types';

const rawConnectionString = process.env.DATABASE_URL || '';
const hasValidCredentials =
  rawConnectionString.length > 0 &&
  !rawConnectionString.includes('[YOUR-PASSWORD]') &&
  !rawConnectionString.includes('YOUR-PASSWORD');

let pool: Pool | null = null;

if (hasValidCredentials) {
  try {
    pool = new Pool({
      connectionString: rawConnectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000,
    });
  } catch (err) {
    console.warn('Supabase DB connection pool initialization error:', err);
    pool = null;
  }
}

export function isDatabaseConfigured(): boolean {
  return pool !== null;
}

export async function fetchUsersFromDb(): Promise<RegisteredUser[] | null> {
  if (!pool) return null;

  try {
    const res = await pool.query(
      `SELECT id, company_name as "companyName", email, password, file_name as "fileName",
              file_type as "fileType", file_size as "fileSize", file_data_url as "fileDataUrl",
              created_at as "createdAt", status
       FROM public.yangming_registered_users
       ORDER BY created_at DESC;`
    );
    return res.rows;
  } catch (error) {
    console.error('Database query error:', error);
    return null;
  }
}

export async function fetchUserByEmailFromDb(email: string): Promise<RegisteredUser | null> {
  if (!pool) return null;

  try {
    const res = await pool.query(
      `SELECT id, company_name as "companyName", email, password, file_name as "fileName",
              file_type as "fileType", file_size as "fileSize", file_data_url as "fileDataUrl",
              created_at as "createdAt", status
       FROM public.yangming_registered_users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1;`,
      [email.trim()]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.error('Database query error by email:', error);
    return null;
  }
}

export async function insertUserToDb(user: RegisteredUser): Promise<boolean> {
  if (!pool) return false;

  try {
    await pool.query(
      `INSERT INTO public.yangming_registered_users
       (id, company_name, email, password, file_name, file_type, file_size, file_data_url, created_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (email) DO UPDATE SET
         company_name = EXCLUDED.company_name,
         file_name = EXCLUDED.file_name,
         file_type = EXCLUDED.file_type,
         file_size = EXCLUDED.file_size,
         file_data_url = EXCLUDED.file_data_url,
         status = EXCLUDED.status;`,
      [
        user.id,
        user.companyName,
        user.email,
        user.password || null,
        user.fileName,
        user.fileType || null,
        user.fileSize || null,
        user.fileDataUrl || null,
        user.createdAt,
        user.status,
      ]
    );
    return true;
  } catch (error) {
    console.error('Database insert error:', error);
    return false;
  }
}

export async function deleteUserFromDb(id: string): Promise<boolean> {
  if (!pool) return false;

  try {
    await pool.query('DELETE FROM public.yangming_registered_users WHERE id = $1;', [id]);
    return true;
  } catch (error) {
    console.error('Database delete error:', error);
    return false;
  }
}
