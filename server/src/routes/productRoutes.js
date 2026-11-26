import { Router } from 'express';
import { adminOnly } from '../middleware/adminOnly.js';
import {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';

const router = Router();
router.get('/', listProducts);
router.get('/:slug', getProduct);
router.post('/', adminOnly, createProduct);
router.put('/:slug', adminOnly, updateProduct);
router.delete('/:slug', adminOnly, deleteProduct);
export default router;
