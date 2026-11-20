import * as service from '../services/authService.js';

export async function register(req, res) { res.status(201).json({ success: true, data: await service.register(req.validated) }); }
export async function login(req, res) { res.json({ success: true, data: await service.login(req.validated) }); }
export async function me(req, res) { const { safeUser } = await import('../services/authService.js'); res.json({ success: true, data: safeUser(req.user) }); }
export async function updateProfile(req, res) { res.json({ success: true, data: await service.updateProfile(req.user.id, req.validated) }); }
