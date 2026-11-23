import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Fill SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env first.');
  process.exit(1);
}
const products = JSON.parse(await readFile(new URL('../data/products.json', import.meta.url), 'utf8'));
const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { error } = await client.from('products').upsert(products, { onConflict: 'slug' });
if (error) { console.error('Seed failed:', error.message); process.exit(1); }
console.log(`Seed complete: ${products.length} catalog products imported into Supabase.`);
