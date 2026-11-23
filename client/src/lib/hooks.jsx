import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, productQuery } from './api';

export function useProducts(params = {}) {
  const key = JSON.stringify(params);
  const [state, setState] = useState({ products: [], meta: null, loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    setState(prev => ({ ...prev, loading: true, error: '' }));
    apiGet(productQuery(JSON.parse(key)), controller.signal)
      .then(data => setState({ products: data.products || [], meta: data.meta, loading: false, error: '' }))
      .catch(error => { if (error.name !== 'AbortError') setState(prev => ({ ...prev, loading: false, error: error.message })); });
    return () => controller.abort();
  }, [key]);
  return state;
}

export function useProduct(slug) {
  const [state, setState] = useState({ product: null, loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    setState({ product: null, loading: true, error: '' });
    apiGet(`/products/${encodeURIComponent(slug)}`, controller.signal)
      .then(data => setState({ product: data.product, loading: false, error: '' }))
      .catch(error => { if (error.name !== 'AbortError') setState({ product: null, loading: false, error: error.message }); });
    return () => controller.abort();
  }, [slug]);
  return state;
}

const Favorites = createContext(null);
export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try { const data = JSON.parse(localStorage.getItem('tg_favorites') || '[]'); return Array.isArray(data) ? data : []; }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem('tg_favorites', JSON.stringify(ids)); }, [ids]);
  const value = useMemo(() => ({
    ids, isSaved: id => ids.includes(id),
    toggle: id => setIds(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])
  }), [ids]);
  return <Favorites.Provider value={value}>{children}</Favorites.Provider>;
}
export function useFavorites() { return useContext(Favorites); }
