import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import crypto from 'node:crypto';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'products.json');
const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL);
const hasSupabaseKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
if (hasSupabaseUrl !== hasSupabaseKey) {
  console.error('[api] Set BOTH SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or neither for demo mode.');
  process.exit(1);
}
const useSupabase = hasSupabaseUrl && hasSupabaseKey;
const supabase = useSupabase
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;
const origins = new Set((process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173').split(',').map(s => s.trim()).filter(Boolean));

app.disable('x-powered-by');
app.use(cors({ origin(origin, cb) { if (!origin || origins.has(origin)) cb(null, true); else cb(new Error('Origin not allowed')); } }));
app.use(express.json({ limit: '64kb' }));
app.use((req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); next(); });

async function readProducts() {
  if (!useSupabase) return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  const { data, error } = await supabase.from('products').select('*').limit(1000);
  if (error) throw error;
  return data;
}
async function writeProducts(rows) {
  if (useSupabase) throw new Error('Local file writer not available for Supabase');
  await writeFile(DATA_FILE, JSON.stringify(rows, null, 2) + '\n', 'utf8');
}
function adminOnly(req, res, next) {
  if (!process.env.ADMIN_KEY) return res.status(503).json({ error: 'Administrative writes disabled. Configure ADMIN_KEY on the backend.' });
  const provided = req.get('x-admin-key') || '';
  const expected = process.env.ADMIN_KEY;
  const a = Buffer.from(provided), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}
function validateProduct(value) {
  const categories = ['rackets', 'shoes', 'bags', 'accessories'];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Body must be an object';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug || '')) return 'slug must be lowercase kebab-case';
  if (!categories.includes(value.category)) return 'Invalid category';
  for (const k of ['name', 'brand', 'subtitle', 'description']) {
    if (typeof value[k] !== 'string' || !value[k].trim() || value[k].length > 500) return `Invalid ${k}`;
  }
  if (!Array.isArray(value.highlights) || value.highlights.length > 8 || value.highlights.some(x => typeof x !== 'string')) return 'highlights must be a list of strings';
  if (!value.specifications || typeof value.specifications !== 'object' || Array.isArray(value.specifications)) return 'specifications must be an object';
  return null;
}
  function cleanProduct(row) {
  const keys = [

  'id',
  'slug',
  'category',
  'category_label',
  'brand',
  'name',
  'subtitle',
  'image',
  'accent',
  'tone',
  'description',
  'highlights',
  'specifications',
  'featured',
  'is_new'
];
;
  return Object.fromEntries(keys.filter(k => Object.hasOwn(row,k)).map(k => [k,row[k]]));
}
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Tennis Gear API', storage: useSupabase ? 'supabase' : 'local-demo' }));
app.get('/api/categories', async (req, res, next) => {
  try {
    const rows = await readProducts();
    res.json({ categories: [
      { slug: 'rackets', title: 'Rackets', count: rows.filter(p => p.category === 'rackets').length },
      { slug: 'shoes', title: 'Shoes', count: rows.filter(p => p.category === 'shoes').length },
      { slug: 'bags', title: 'Bags', count: rows.filter(p => p.category === 'bags').length },
      { slug: 'accessories', title: 'Accessories', count: rows.filter(p => p.category === 'accessories').length }
    ] });
  } catch (err) { next(err); }
});
app.get('/api/products', async (req, res, next) => {
  try {
    let rows = await readProducts();
    const { category = '', brand = '', search = '', featured = '', sort = 'featured', limit = '', page = '1' } = req.query;
    if (category) rows = rows.filter(p => p.category === category);
    if (brand) rows = rows.filter(p => p.brand.toLowerCase() === String(brand).toLowerCase());
    if (search) {
      const term = String(search).toLowerCase().trim();
      rows = rows.filter(p => `${p.name} ${p.brand} ${p.category} ${p.subtitle} ${p.description}`.toLowerCase().includes(term));
    }
    if (featured === 'true') rows = rows.filter(p => p.featured);
    const sorter = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name),
      brand: (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name),
      newest: (a, b) => Number(b.is_new) - Number(a.is_new) || a.name.localeCompare(b.name)
    };
    rows.sort(sorter[sort] || sorter.featured);
    const total = rows.length;
    const size = limit === '' ? total : Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 12));
    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    rows = rows.slice((currentPage - 1) * size, currentPage * size);
    res.json({ products: rows.map(cleanProduct), meta: { total, page: currentPage, limit: size, pages: Math.max(1, Math.ceil(total / Math.max(1, size))) } });
  } catch (err) { next(err); }
});
app.get('/api/products/:slug', async (req, res, next) => {
  try {
    const rows = await readProducts();
    const product = rows.find(p => p.slug === req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: cleanProduct(product) });
  } catch (err) { next(err); }
});
app.post('/api/products', adminOnly, async (req, res, next) => {
  try {
    const errorMessage = validateProduct(req.body);
    if (errorMessage) return res.status(400).json({ error: errorMessage });
    const product = { ...cleanProduct(req.body), id: crypto.randomUUID(), featured: Boolean(req.body.featured), is_new: Boolean(req.body.is_new) };
    product.category_label = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    product.accent ||= '#b8dc78'; product.tone ||= 'mint';
    if (useSupabase) {
      const { error } = await supabase.from('products').insert(product);
      if (error) throw error;
    } else {
      const rows = await readProducts();
      if (rows.some(p => p.slug === product.slug)) return res.status(409).json({ error: 'Slug already exists' });
      rows.push(product); await writeProducts(rows);
    }
    res.status(201).json({ product });
  } catch (err) { next(err); }
});
app.put('/api/products/:slug', adminOnly, async (req, res, next) => {
  try {
    const errorMessage = validateProduct(req.body);
    if (errorMessage) return res.status(400).json({ error: errorMessage });
    const rows = await readProducts();
    const index = rows.findIndex(p => p.slug === req.params.slug);
    if (index < 0) return res.status(404).json({ error: 'Product not found' });
    if (rows.some((p, i) => i !== index && p.slug === req.body.slug)) return res.status(409).json({ error: 'Slug already exists' });
    const product = { ...rows[index], ...cleanProduct(req.body), id: rows[index].id };
    if (useSupabase) {
      const { error } = await supabase.from('products').update(product).eq('id', product.id);
      if (error) throw error;
    } else { rows[index] = product; await writeProducts(rows); }
    res.json({ product });
  } catch (err) { next(err); }
});
app.delete('/api/products/:slug', adminOnly, async (req, res, next) => {
  try {
    const rows = await readProducts();
    const product = rows.find(p => p.slug === req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (useSupabase) {
      const { error } = await supabase.from('products').delete().eq('id', product.id);
      if (error) throw error;
    } else await writeProducts(rows.filter(p => p.id !== product.id));
    res.json({ deleted: true, slug: product.slug });
  } catch (err) { next(err); }
});
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));
app.use((err, req, res, next) => {
  console.error('[api]', err.message);
  if (err.message === 'Origin not allowed') return res.status(403).json({ error: 'Origin not allowed' });
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'Invalid JSON' });
  res.status(500).json({ error: 'Unexpected API error' });
});

app.listen(PORT, () => console.log(`Tennis Gear API: http://localhost:${PORT} (${useSupabase ? 'Supabase' : 'local demo'} mode)`));
