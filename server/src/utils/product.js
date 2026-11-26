export const CATEGORIES = ['rackets', 'shoes', 'bags', 'accessories'];

export function cleanProduct(row) {
  const keys = [
    'id', 'slug', 'category', 'category_label', 'brand', 'name', 'subtitle',
    'image', 'accent', 'tone', 'description', 'highlights', 'specifications',
    'featured', 'is_new'
  ];
  return Object.fromEntries(
    keys.filter(key => Object.hasOwn(row, key)).map(key => [key, row[key]])
  );
}

export function validateProduct(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return 'Body must be an object';
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug || '')) {
    return 'slug must be lowercase kebab-case';
  }
  if (!CATEGORIES.includes(value.category)) return 'Invalid category';
  for (const key of ['name', 'brand', 'subtitle', 'description']) {
    if (typeof value[key] !== 'string' || !value[key].trim() || value[key].length > 500) {
      return `Invalid ${key}`;
    }
  }
  if (!Array.isArray(value.highlights) || value.highlights.length > 8 ||
      value.highlights.some(item => typeof item !== 'string')) {
    return 'highlights must be a list of strings';
  }
  if (!value.specifications || typeof value.specifications !== 'object' ||
      Array.isArray(value.specifications)) {
    return 'specifications must be an object';
  }
  if (value.image != null && typeof value.image !== 'string') return 'Invalid image';
  return null;
}
