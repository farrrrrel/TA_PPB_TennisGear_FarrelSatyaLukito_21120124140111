import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart } from 'lucide-react';
import { useFavorites, useProducts } from '../lib/hooks';
import { ProductGrid, ProductSkeletons, ApiError } from '../components/ProductCard';
export default function Saved() {
  const { ids } = useFavorites();
  const { products, loading, error } = useProducts();
  const saved = products.filter(p => ids.includes(p.slug));
  return <div className="container saved-page"><section className="simple-heading"><span className="eyebrow">YOUR SHORTLIST / PERSONAL PICKS</span><h1>Saved for <i>later.</i></h1><p>Good gear deserves a second look. Everything you save lives here, on this device.</p></section>{loading ? <ProductSkeletons/> : error ? <ApiError message={error}/> : saved.length ? <ProductGrid products={saved}/> : <div className="empty-state"><Heart size={34}/><h3>Your shortlist is empty</h3><p>Tap the heart on any product to save it for later.</p><Link to="/rackets" className="button button-dark">Browse the collection <ArrowUpRight size={18}/></Link></div>}</div>;
}
