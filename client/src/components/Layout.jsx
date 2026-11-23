import React, { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [location.pathname]);
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
    <main id="main-content">{children}</main>
    <footer className="site-footer container"><div className="footer-top"><div><span className="footer-word">tennisgear<span>.</span></span><p>Better gear knowledge.<br/>Better days on court.</p></div><div className="footer-links"><Link to="/rackets">Rackets</Link><Link to="/shoes">Shoes</Link><Link to="/bags">Bags</Link><Link to="/accessories">Accessories</Link><Link to="/about">About</Link></div></div><div className="footer-bottom"><span>© 2026 Tennis Gear · PPB Final Project</span><span>Made for the love of the game. 🎾</span></div></footer>
    <nav className="bottom-nav" aria-label="Bottom navigation">{tabs.map(tab => { const Icon = tab.icon; return <NavLink key={tab.to} to={tab.to} end={tab.to === '/'} className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}><Icon size={21} strokeWidth={1.8}/><span>{tab.label}</span></NavLink>; })}</nav>
  </>;
}
