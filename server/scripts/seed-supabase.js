// Optional one-time data import. The running API NEVER reads this JSON file.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env first.');
  process.exit(1);
}

const products = JSON.parse(
  await readFile(new URL('../seeds/products.json', import.meta.url), 'utf8')
);
const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const { error } = await client.from('products').upsert(products, { onConflict: 'slug' });
if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
console.log(`Seed complete: ${products.length} products imported into Supabase.`);
