import React, { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Heart, House, CircleUserRound, BriefcaseBusiness, Footprints, CircleDotDashed, Menu } from 'lucide-react';
import { useFavorites } from '../lib/hooks';

const tabs = [
  { to: '/', label: 'Home', icon: House },
  { to: '/rackets', label: 'Rackets', icon: CircleDotDashed },
  { to: '/shoes', label: 'Shoes', icon: Footprints },
  { to: '/bags', label: 'Bags', icon: BriefcaseBusiness },
  { to: '/about', label: 'About', icon: CircleUserRound }
];

export default function Layout({ children }) {
  const location = useLocation();
  const { ids } = useFavorites();
  const navigate = useNavigate();
  const touchStart = useRef(null);
  const swipeDirection = useRef(0);
  const mainRef = useRef(null);
  const activeTab = tabs.findIndex(tab => tab.to === location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const direction = swipeDirection.current;
    swipeDirection.current = 0;
    if (direction && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mainRef.current?.animate?.([
        { transform: `translateX(${direction * 32}px)`, opacity: 0.5 },
        { transform: 'translateX(0)', opacity: 1 }
      ], { duration: 220, easing: 'ease-out' });
    }
  }, [location.pathname]);

  // Catat titik awal gesture. Jangan ganggu input, tombol, atau gesture tepi iOS.
  function handleTouchStart(event) {
    touchStart.current = null;
    if (activeTab < 0 || event.touches.length !== 1) return;
    if (event.target.closest?.('input, textarea, select, button, [contenteditable], .breadcrumbs')) return;
    const touch = event.touches[0];
    if (touch.clientX < 20 || touch.clientX > window.innerWidth - 20) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }

  // Pindah tab hanya jika gesture dominan horizontal dan cukup jauh.
  function handleTouchEnd(event) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || activeTab < 0 || event.touches.length !== 0 || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - start.time > 1000) return;

    const direction = dx < 0 ? 1 : -1;
    const nextTab = activeTab + direction;
    if (nextTab < 0 || nextTab >= tabs.length) return;

    swipeDirection.current = direction;
    navigate(tabs[nextTab].to);
  }

  function handleTouchCancel() {
    touchStart.current = null;
  }
  return <>
    <header className="site-header">
      <div className="header-inner container">
        <Link to="/" className="brand-mark" aria-label="Tennis Gear home"><span className="brand-symbol"><span className="brand-ball"/></span><span className="brand-word">tennis<span>gear</span><span className="brand-dot">.</span></span></Link>
        <nav className="top-links" aria-label="Primary navigation"><NavLink to="/" end>Discover</NavLink><NavLink to="/rackets">Rackets</NavLink><NavLink to="/shoes">Shoes</NavLink><NavLink to="/accessories">Accessories</NavLink><NavLink to="/about">Our story</NavLink></nav>
        <div className="header-actions">
          <Link to="/saved" className="saved-link" aria-label={`Saved products: ${ids.length}`}><Heart size={19} strokeWidth={1.8} /><span className="saved-count">{ids.length}</span></Link>
          <Link to="/rackets" className="header-cta">Explore gear <ArrowUpRight size={16}/></Link>
        </div>
      </div>
    </header>
    <main
      id="main-content"
      ref={mainRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      style={activeTab >= 0 ? { touchAction: 'pan-y pinch-zoom' } : undefined}
    >{children}</main>
    <footer className="site-footer container"><div className="footer-top"><div><span className="footer-word">tennisgear<span>.</span></span><p>Better gear knowledge.<br/>Better days on court.</p></div><div className="footer-links"><Link to="/rackets">Rackets</Link><Link to="/shoes">Shoes</Link><Link to="/bags">Bags</Link><Link to="/accessories">Accessories</Link><Link to="/about">About</Link></div></div><div className="footer-bottom"><span>© 2026 Tennis Gear · PPB Final Project</span><span>Made for the love of the game. 🎾</span></div></footer>
    <nav className="bottom-nav" aria-label="Bottom navigation">{tabs.map(tab => { const Icon = tab.icon; return <NavLink key={tab.to} to={tab.to} end={tab.to === '/'} className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}><Icon size={21} strokeWidth={1.8}/><span>{tab.label}</span></NavLink>; })}</nav>
  </>;
}
