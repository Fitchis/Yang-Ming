const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Primary connection string (Pooler IPv4 Session mode)
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.isctbyjzcugdsfsbpogo:J%40m12malamLewat@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

console.log('Connecting to Supabase PostgreSQL...');

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

async function run() {
  try {
    await client.connect();
    console.log('Successfully connected to Supabase database!');

    // Check if table exists
    const checkRes = await client.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'yangming_registered_users');"
    );
    const tableExists = checkRes.rows[0].exists;
    console.log('Table "yangming_registered_users" already exists:', tableExists);

    // Read migration SQL
    const migrationFile = path.resolve(
      __dirname,
      '..',
      'supabase',
      'migrations',
      '20261021_create_registered_users.sql'
    );
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('Executing migration script on Supabase...');
    await client.query(sql);
    console.log('Schema migration executed successfully on Supabase!');

    // Verify row count
    const verifyRes = await client.query(
      'SELECT COUNT(*) as count FROM public.yangming_registered_users;'
    );
    console.log('Verified row count in Supabase yangming_registered_users:', verifyRes.rows[0].count);

    const sample = await client.query(
      'SELECT id, company_name, email, file_name, status FROM public.yangming_registered_users;'
    );
    console.log('Active records currently in Supabase:');
    console.table(sample.rows);
  } catch (err) {
    console.error('Database migration error:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Hint:', err.hint);
  } finally {
    await client.end();
  }
}

run();
