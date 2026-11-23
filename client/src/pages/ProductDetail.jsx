import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Heart, Layers3, ShieldCheck } from 'lucide-react';
import ProductArt from '../components/ProductArt';
import { ProductGrid, ProductSkeletons, ApiError } from '../components/ProductCard';
import { useFavorites, useProduct, useProducts } from '../lib/hooks';

function Related({ category, slug }) {
  const { products, loading, error } = useProducts({ category, limit: 8 });
  return <section className="section related-section"><div className="section-header align-bottom"><div><span className="eyebrow">KEEP EXPLORING</span><h2>More to <i>discover.</i></h2></div><Link to={`/${category}`} className="text-arrow-link">Explore {category} <ArrowUpRight size={18}/></Link></div>{loading ? <ProductSkeletons count={4}/> : error ? null : <ProductGrid products={products.filter(p => p.slug !== slug).slice(0, 4)}/>}</section>;
}
export default function ProductDetail() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { isSaved, toggle } = useFavorites();
  if (loading) return <div className="container detail-loading"><div className="skeleton-media shimmer"/><div className="skeleton-info"><div className="skeleton-line shimmer"/><div className="skeleton-line shimmer"/></div></div>;
  if (error || !product) return <div className="container"><ApiError message={error || 'Product not found'}/><Link to="/rackets" className="back-link"><ArrowLeft size={16}/> Back to collection</Link></div>;
  const saved = isSaved(product.slug);
  return <div className="container detail-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14}/><Link to={`/${product.category}`}>{product.category_label || product.category}</Link><ChevronRight size={14}/><span>{product.name}</span></div>
    <section className="detail-layout">
      <div className={`detail-visual tone-${product.tone || 'mint'}`}><span className="detail-image-no">TG / {product.id.slice(-3)}</span>
{product.image ? (
  <img
    src={product.image}
    alt={`${product.brand} ${product.name}`}
    className="product-art"
    style={{ objectFit: 'contain' }}
  />
) : (
  <ProductArt
    category={product.category}
    accent={product.accent}
    variant={product.slug}
  />
)}
<span className="detail-image-type">{product.category.toUpperCase()} — PRODUCT STUDY</span></div>
      <div className="detail-content"><span className="eyebrow">{product.brand.toUpperCase()} / {product.category.toUpperCase()}</span><h1>{product.name}</h1><p className="detail-subtitle">{product.subtitle}</p><div className="detail-rule"/><p className="detail-description">{product.description}</p><div className="detail-points"><span>THE HIGHLIGHTS</span>{product.highlights?.map(x => <div key={x}><Check size={18}/>{x}</div>)}</div><button className={`button button-save-large ${saved ? 'saved' : ''}`} onClick={() => toggle(product.slug)}><Heart size={18} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Saved to your list' : 'Save to your list'}</button><p className="detail-caption">An educational specifications catalog — not a checkout store.</p></div>
    </section>
    <section className="specs-section"><div className="specs-intro"><span className="eyebrow">UNDER THE SURFACE / 01</span><h2>The details<br/><i>behind the gear.</i></h2><p>Look beyond the colorway. Explore the technical information that can shape your on-court experience.</p><div className="specs-icon"><Layers3 size={29}/></div></div><div className="specs-table-wrap"><div className="specs-table-header"><span>PRODUCT SPECIFICATIONS</span><span>{product.brand.toUpperCase()}</span></div><div className="specs-table">{Object.entries(product.specifications || {}).map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><strong>{String(value)}</strong></div>)}</div><p className="specs-disclaimer"><ShieldCheck size={17}/> Specs are illustrative catalog data. Confirm exact model/variant specifications with the manufacturer.</p></div></section>
    <div className="detail-back"><Link to={`/${product.category}`} className="text-arrow-link"><ArrowLeft size={18}/> Back to {product.category}</Link></div>
    <Related category={product.category} slug={product.slug}/>
  </div>;
}
