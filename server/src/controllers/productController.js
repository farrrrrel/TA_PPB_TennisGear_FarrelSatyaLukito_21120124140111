import crypto from 'node:crypto';
import * as ProductModel from '../models/productModel.js';
import { cleanProduct, validateProduct } from '../utils/product.js';

export async function listProducts(req, res, next) {
  try {
    let rows = await ProductModel.getAll();
    const {
      category = '', brand = '', search = '', featured = '',
      sort = 'featured', limit = '', page = '1'
    } = req.query;

    if (category) rows = rows.filter(p => p.category === category);
    if (brand) rows = rows.filter(p => p.brand.toLowerCase() === String(brand).toLowerCase());
    if (search) {
      const term = String(search).toLowerCase().trim();
      rows = rows.filter(p =>
        `${p.name} ${p.brand} ${p.category} ${p.subtitle} ${p.description}`
          .toLowerCase().includes(term)
      );
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

    res.json({
      products: rows.map(cleanProduct),
      meta: {
        total, page: currentPage, limit: size,
        pages: Math.max(1, Math.ceil(total / Math.max(1, size)))
      }
    });
  } catch (error) { next(error); }
}

export async function getProduct(req, res, next) {
  try {
    const product = await ProductModel.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: cleanProduct(product) });
  } catch (error) { next(error); }
}

export async function createProduct(req, res, next) {
  try {
    const validationError = validateProduct(req.body);
    if (validationError) return res.status(400).json({ error: validationError });
    if (await ProductModel.getBySlug(req.body.slug)) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const product = {
      ...cleanProduct(req.body),
      id: crypto.randomUUID(),
      featured: Boolean(req.body.featured),
      is_new: Boolean(req.body.is_new)
    };
    product.category_label = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    product.accent ||= '#b8dc78';
    product.tone ||= 'mint';

    await ProductModel.insert(product);
    res.status(201).json({ product });
  } catch (error) { next(error); }
}

export async function updateProduct(req, res, next) {
  try {
    const validationError = validateProduct(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const existing = await ProductModel.getBySlug(req.params.slug);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    if (req.body.slug !== existing.slug && await ProductModel.getBySlug(req.body.slug)) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const product = { ...existing, ...cleanProduct(req.body), id: existing.id };
    await ProductModel.updateById(existing.id, product);
    res.json({ product: cleanProduct(product) });
  } catch (error) { next(error); }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await ProductModel.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await ProductModel.removeById(product.id);
    res.json({ deleted: true, slug: product.slug });
  } catch (error) { next(error); }
}
