import { Router } from 'express';
import { z } from 'zod';
import { auth, tripCreator, tripMember, validate } from '../middleware/index.js';
import * as controller from '../controllers/memberController.js';

const router = Router();
router.use(auth);

const inviteCodeSchema = z.object({
  inviteCode: z.string().trim().min(1),
});

router.post('/trips/join-request', validate(inviteCodeSchema), controller.requestJoinByCode);
router.get('/users/me/join-requests', controller.listMyJoinRequests);
router.delete('/users/me/join-requests/:requestId', controller.cancelMyJoinRequest);

router.get('/trips/:tripId/members', tripMember, controller.listMembers);
router.get('/trips/:tripId/join-requests', tripMember, tripCreator, controller.listPendingJoinRequests);
router.post('/trips/:tripId/join-requests/:requestId/approve', tripMember, tripCreator, controller.approveJoinRequest);
router.post('/trips/:tripId/join-requests/:requestId/reject', tripMember, tripCreator, controller.rejectJoinRequest);
router.post('/trips/:tripId/invite-code', tripMember, tripCreator, controller.regenerateInviteCode);
router.delete('/trips/:tripId/members/:memberId', tripMember, tripCreator, controller.removeMember);
router.post('/trips/:tripId/leave', tripMember, controller.leaveTrip);

export default router;
