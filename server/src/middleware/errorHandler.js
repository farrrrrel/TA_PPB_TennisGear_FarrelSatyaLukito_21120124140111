export function errorHandler(err, _req, res, _next) {
  console.error('[api]', err.message);
  if (err.message === 'Origin not allowed') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  // PostgreSQL unique constraint violation (e.g. duplicate slug).
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Slug already exists' });
  }
  res.status(500).json({ error: 'Unexpected API error' });
}
