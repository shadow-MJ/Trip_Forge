import * as service from '../services/tripService.js';

export async function list(req,res) { res.json({ success:true, data: await service.listTrips(req.user.id) }); }
export async function get(req,res) { res.json({ success:true, data: await service.enrichTrip(req.params.tripId, req.user.id) }); }
export async function create(req,res) { res.status(201).json({ success:true, data: await service.createTrip(req.validated, req.user) }); }
export async function update(req,res) { res.json({ success:true, data: await service.updateTrip(req.params.tripId, req.validated) }); }
export async function remove(req,res) { await (await import('../config/db.js')).default('trips').where({ id:req.params.tripId }).delete(); res.json({ success:true, data:{ deleted:true, id:req.params.tripId } }); }
