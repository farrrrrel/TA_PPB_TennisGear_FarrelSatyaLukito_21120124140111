import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronRight, MoveUpRight, Sparkles, Target, Layers2, CircleDot } from 'lucide-react';
import ProductArt from '../components/ProductArt';
import { ProductGrid, ProductSkeletons, ApiError } from '../components/ProductCard';
import { useProducts } from '../lib/hooks';

const tiles = [
  { category: 'rackets', num: '01', name: 'Rackets', count: 'Find your swing', accent: '#cfef9f', bg: 'mint' },
  { category: 'shoes', num: '02', name: 'Shoes', count: 'Own every step', accent: '#f0c0ae', bg: 'coral' },
  { category: 'bags', num: '03', name: 'Bags', count: 'Carry the game', accent: '#b9c9ee', bg: 'blue' },
  { category: 'accessories', num: '04', name: 'Accessories', count: 'Finish your setup', accent: '#eadf9a', bg: 'yellow' },
];

export default function Home() {
  const { products, loading, error } = useProducts({ featured: 'true', limit: 8 });
  return <>
    <div className="container home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="live-dot"/> YOUR GAME, YOUR GEAR</div>
          <h1 id="hero-title">GOOD GEAR.<br/><em>BETTER</em> GAME<span className="hero-period">.</span></h1>
          <p>Discover the equipment behind your best tennis. Explore standout rackets, shoes, bags and the details that matter.</p>
          <div className="hero-buttons"><Link to="/rackets" className="button button-lime">Explore the collection <ArrowUpRight size={18}/></Link><Link to="/about" className="hero-text-link">Why Tennis Gear? <ArrowRight size={16}/></Link></div>
          <div className="hero-footer"><span>THE COURT IS YOURS</span><span>EST. 2026 — TENNIS GEAR</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-court"><div className="court-line court-line-a"/><div className="court-line court-line-b"/><div className="court-line court-line-c"/></div>
          <div className="hero-ring hero-ring-one"/><div className="hero-ring hero-ring-two"/>
          <div className="hero-racket"><ProductArt category="rackets" accent="#deff83" variant="hero-blade" hero /></div>
          <div className="hero-sticker"><span>PLAY</span><span>YOUR</span><span>WAY ↗</span></div>
          <span className="hero-vertical">FIND YOUR COURT CONFIDENCE / 001</span>
        </div>
      </section>
      <div className="intro-bar"><span><span className="intro-pulse"/> EVERY GREAT POINT STARTS WITH THE RIGHT GEAR</span><span>01 / 04 <ArrowDownRight size={17}/></span></div>
      <section className="section categories-section" aria-labelledby="categories-title">
        <div className="section-header"><div><span className="eyebrow">THE COLLECTION / 01</span><h2 id="categories-title">Made for every<br/><i>kind of player.</i></h2></div><p>Whether you're chasing your first clean winner or fine-tuning your setup, start here.</p></div>
        <div className="category-grid">{tiles.map(t => <Link key={t.category} to={`/${t.category}`} className={`category-tile category-${t.bg}`}><div className="category-top"><span>{t.num} / CATEGORY</span><span className="category-arrow"><ArrowUpRight size={20}/></span></div><div className="category-art"><ProductArt category={t.category} accent={t.accent} variant={`cat-${t.category}`}/></div><div className="category-bottom"><div><h3>{t.name}</h3><span>{t.count}</span></div><ChevronRight size={24}/></div></Link>)}</div>
      </section>
      <section className="section featured-section" aria-labelledby="featured-title">
        <div className="section-header align-bottom"><div><span className="eyebrow">ON OUR RADAR / 02</span><h2 id="featured-title">The current<br/><i>lineup.</i></h2></div><Link to="/rackets" className="text-arrow-link">Explore all equipment <ArrowUpRight size={18}/></Link></div>
        {loading ? <ProductSkeletons count={4}/> : error ? <ApiError message={error}/> : <ProductGrid products={products.slice(0, 8)}/>}
      </section>
      <section className="story-banner"><div className="story-banner-symbol"><Target size={38} strokeWidth={1.25}/></div><div><span className="eyebrow">DETAILS MAKE THE DIFFERENCE</span><h2>Less guessing.<br/><i>More playing.</i></h2><p>Head size. String pattern. Stability. Fit. Understand the specs, and find equipment that suits the way you play.</p><Link to="/about" className="button button-outline-light">How the catalog works <ArrowUpRight size={18}/></Link></div><div className="story-banner-deco"><span>98</span><span>100</span><span>16×19</span></div></section>
      <section className="section closing-section"><div><span className="eyebrow">MATCH POINT / 03</span><h2>Find your next<br/><i>favorite thing.</i></h2></div><div className="closing-actions"><p>Choose your category and get closer to the gear that fits your game.</p><Link to="/rackets" className="round-arrow" aria-label="Browse rackets"><ArrowUpRight size={27}/></Link></div></section>
    </div>
  </>;
}
