import { ok } from '../utils/response.js';
import * as itineraryService from '../services/itineraryService.js';

export async function list(req, res) {
  return ok(res, await itineraryService.list(req.params.tripId));
}

export async function add(req, res) {
  return ok(res, await itineraryService.add(req.params.tripId, req.validated, req.user), 201);
}

export async function reorder(req, res) {
  const { day, activityId, direction } = req.validated;
  return ok(res, await itineraryService.reorder(req.params.tripId, day, activityId, direction));
}

export async function update(req, res) {
  return ok(
    res,
    await itineraryService.update(req.params.tripId, req.params.activityId, req.validated, req.user)
  );
}

export async function remove(req, res) {
  return ok(
    res,
    await itineraryService.remove(req.params.tripId, req.params.activityId, req.user)
  );
}
