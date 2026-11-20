import ApiError from '../utils/apiError.js';
import { verifyToken } from '../utils/jwt.js';
import db from '../config/db.js';

export async function auth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) throw new ApiError(401, 'Authentication required.', 'UNAUTHORIZED');
    const payload = verifyToken(token);
    const user = await db('users').where({ id: payload.sub }).first();
    if (!user) throw new ApiError(401, 'Invalid or expired token.', 'UNAUTHORIZED');
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token.', 'UNAUTHORIZED'));
    }
    next(err);
  }
}
