const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function apiGet(path, signal) {
  const response = await fetch(`${BASE}/api${path}`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `API request failed (${response.status})`);
  }
  return response.json();
}

export function productQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== undefined && value !== null && value !== false) search.set(key, value);
  }
  const qs = search.toString();
  return `/products${qs ? `?${qs}` : ''}`;
}
