
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart } from 'lucide-react';
import ProductArt from './ProductArt';
import { useFavorites } from '../lib/hooks';

export default function ProductCard({ product, index = 0 }) {
  const { isSaved, toggle } = useFavorites();

  return (
    <article
      className="product-card"
      style={{ animationDelay: `${Math.min(index, 9) * 45}ms` }}
    >
      <div className={`product-media tone-${product.tone || 'mint'}`}>

        <Link
          className="product-media-link"
          to={`/product/${product.slug}`}
          aria-label={`View ${product.brand} ${product.name} specifications`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="product-art"
              loading="lazy"
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <ProductArt
              category={product.category}
              accent={product.accent}
              variant={product.slug}
            />
          )}
        </Link>

        <div className="product-badges">
          {product.is_new && (
            <span className="chip chip-light">NEW</span>
          )}
          {product.featured && !product.is_new && (
            <span className="chip chip-light">EDITOR'S PICK</span>
          )}
        </div>

        <button
          className={`save-button ${isSaved(product.slug) ? 'is-saved' : ''}`}
          onClick={() => toggle(product.slug)}
          aria-label={
            isSaved(product.slug)
              ? `Remove ${product.name} from saved`
              : `Save ${product.name}`
          }
          title={isSaved(product.slug) ? 'Remove from saved' : 'Save for later'}
        >
          <Heart
            size={19}
            fill={isSaved(product.slug) ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <Link to={`/product/${product.slug}`} className="product-content">
        <div className="product-meta">
          <span>{product.brand}</span>
          <span className="meta-dot" />
          <span>{product.category_label || product.category}</span>
        </div>

        <div className="product-name-line">
          <h3>{product.name}</h3>
          <ArrowUpRight size={19} strokeWidth={1.6} />
        </div>

        <p>{product.subtitle}</p>
      </Link>
    </article>
  );
}

export function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} index={i} />
      ))}
    </div>
  );
}

export function ProductSkeletons({ count = 4 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-media shimmer" />
          <div className="skeleton-line shimmer" />
          <div className="skeleton-line short shimmer" />
        </div>
      ))}
    </div>
  );
}

export function ApiError({ message }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">↻</span>
      <h3>Unable to load gear</h3>
      <p>
        {message}. Check that the Tennis Gear API is running,
        then refresh the page.
      </p>
      <button
        className="button button-dark"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </div>
  );
}
