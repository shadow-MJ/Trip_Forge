import { Router } from 'express';
import { z } from 'zod';
import { auth, tripMember, validate } from '../middleware/index.js';
import { activitySchema } from '../services/itineraryService.js';
import * as controller from '../controllers/itineraryController.js';

const router = Router();
router.use(auth);

const reorderSchema = z.object({
  day: z.coerce.number().int().positive(),
  activityId: z.string(),
  direction: z.enum(['up', 'down']),
});

router.get('/trips/:tripId/itinerary', tripMember, controller.list);
router.post('/trips/:tripId/itinerary', tripMember, validate(activitySchema), controller.add);
router.patch('/trips/:tripId/itinerary/reorder', tripMember, validate(reorderSchema), controller.reorder);
router.patch(
  '/trips/:tripId/itinerary/:activityId',
  tripMember,
  validate(activitySchema.partial()),
  controller.update
);
router.delete('/trips/:tripId/itinerary/:activityId', tripMember, controller.remove);

export default router;
