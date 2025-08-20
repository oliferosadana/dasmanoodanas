import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export function signJwt(payload, options = { expiresIn: '24h' }) {
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function getAuthFromHeader(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  return token;
}


