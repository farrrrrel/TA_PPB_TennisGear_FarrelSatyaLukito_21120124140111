import crypto from 'node:crypto';

export function adminOnly(req, res, next) {
  if (!process.env.ADMIN_KEY) {
    return res.status(503).json({
      error: 'Administrative writes disabled. Configure ADMIN_KEY on the backend.'
    });
  }

  const provided = req.get('x-admin-key') || '';
  const expected = process.env.ADMIN_KEY;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
