import db from '../config/db.js';
import ApiError from '../utils/apiError.js';

export async function tripMember(req, _res, next) {
  const tripId = req.params.tripId;
  const member = await db('trip_members').where({ trip_id: tripId, user_id: req.user.id, status: 'approved' }).first();
  if (!member) return next(new ApiError(403, 'You do not have access to this trip workspace.', 'FORBIDDEN'));
  req.membership = member;
  next();
}
