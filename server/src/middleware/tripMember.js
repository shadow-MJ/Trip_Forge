import db from '../config/db.js';
import ApiError from '../utils/apiError.js';

export async function tripMember(req, _res, next) {
  try {
    const tripId = req.params.tripId;
    if (!tripId) {
      return next(new ApiError(400, 'Trip ID is required.', 'VALIDATION_ERROR'));
    }

    const member = await db('trip_members')
      .where({ trip_id: tripId, user_id: req.user.id, status: 'approved' })
      .first();

    if (!member) {
      return next(new ApiError(403, 'You do not have access to this trip workspace.', 'FORBIDDEN'));
    }

    req.membership = member;
    next();
  } catch (err) {
    next(err);
  }
}
