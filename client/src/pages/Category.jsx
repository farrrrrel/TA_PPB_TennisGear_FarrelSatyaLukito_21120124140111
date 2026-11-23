import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { categories } from '../lib/catalog';
import { ProductGrid, ProductSkeletons, ApiError } from '../components/ProductCard';
import { useProducts } from '../lib/hooks';
import NotFound from './NotFound';

export default function Category() {
  const { pathname } = useLocation();
  const category = pathname.replace(/^\//, '');
  const config = categories[category];
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('featured');
  const base = useProducts({ category });
  const { products, meta, loading, error } = useProducts({ category, search, brand, sort });
  const brands = useMemo(() => [...new Set(base.products.map(p => p.brand))].sort(), [base.products]);
  if (!config) return <NotFound/>;
  return <div className="container category-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={14}/><span>{config.label}</span></div>
    <section className={`category-hero category-hero-${category}`}><div><span className="eyebrow">THE COLLECTION / {config.number}</span><h1>{config.title.split('\n').map((line,i) => <React.Fragment key={line}>{i>0 && <br/>}{i>0 ? <i>{line}</i> : line}</React.Fragment>)}</h1><p>{config.description}</p></div><div className="category-hero-corner"><span>{config.tiny}</span><ArrowUpRight size={38} strokeWidth={1.2}/></div></section>
    <section className="listing-section" aria-labelledby="listing-title"><div className="listing-head"><div><span className="eyebrow">EXPLORE THE EDIT / {config.number}</span><h2 id="listing-title">All {config.label.toLowerCase()} <span className="count-bubble">{meta?.total ?? '—'}</span></h2></div><span className="listing-count">FIND YOUR FIT</span></div>
      <div className="filter-bar"><label className="search-field"><Search size={19}/><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${config.label.toLowerCase()}...`} aria-label={`Search ${config.label.toLowerCase()}`}/>{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><X size={16}/></button>}</label><label className="select-field"><SlidersHorizontal size={17}/><select value={brand} onChange={e => setBrand(e.target.value)} aria-label="Filter by brand"><option value="">All brands</option>{brands.map(b => <option value={b} key={b}>{b}</option>)}</select></label><label className="select-field"><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured first</option><option value="name">Name A–Z</option><option value="brand">Brand A–Z</option><option value="newest">New arrivals</option></select></label></div>
      {loading ? <ProductSkeletons count={4}/> : error ? <ApiError message={error}/> : products.length ? <ProductGrid products={products}/> : <div className="empty-state"><Search size={29}/><h3>No gear found</h3><p>Try another search or remove some filters.</p><button className="button button-dark" onClick={() => { setSearch(''); setBrand(''); setSort('featured'); }}>Reset filters</button></div>}
    </section>
    <div className="category-note"><div><span className="eyebrow">A NOTE FROM TENNIS GEAR</span><p>Technical information is for catalog demonstration. Verify final specifications, variants and fit with the manufacturer before purchasing.</p></div><Link to="/about">About this project <ArrowUpRight size={16}/></Link></div>
  </div>;
}
