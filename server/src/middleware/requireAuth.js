import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Sign in to continue.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or expired. Sign in again.' });
  }
}