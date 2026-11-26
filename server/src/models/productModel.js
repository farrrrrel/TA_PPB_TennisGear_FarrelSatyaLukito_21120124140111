import { supabase } from '../config/supabaseClient.js';

// Database access belongs in Models, not in Express route handlers.
export async function getAll() {
  const { data, error } = await supabase.from('products').select('*').limit(1000);
  if (error) throw error;
  return data ?? [];
}

export async function getBySlug(slug) {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function insert(product) {
  const { error } = await supabase.from('products').insert(product);
  if (error) throw error;
}

export async function updateById(id, product) {
  const { error } = await supabase.from('products').update(product).eq('id', id);
  if (error) throw error;
}

export async function removeById(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
