import { getAll } from '../models/productModel.js';
import { CATEGORIES } from '../utils/product.js';

export async function listCategories(_req, res, next) {
  try {
    const products = await getAll();
    res.json({ categories: CATEGORIES.map(slug => ({
      slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      count: products.filter(product => product.category === slug).length
    })) });
  } catch (error) {
    next(error);
  }
}
