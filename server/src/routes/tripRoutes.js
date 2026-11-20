import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { tripMember } from '../middleware/tripMember.js';
import { tripCreator } from '../middleware/tripCreator.js';
import { validate } from '../middleware/validate.js';
import { tripSchema } from '../services/tripService.js';
import * as controller from '../controllers/tripController.js';

const router = Router();
router.use(auth);
router.get('/trips', controller.list);
router.post('/trips', validate(tripSchema), controller.create);
router.get('/trips/:tripId', tripMember, controller.get);
router.patch('/trips/:tripId', tripMember, tripCreator, validate(tripSchema.partial()), controller.update);
router.delete('/trips/:tripId', tripMember, tripCreator, controller.remove);
export default router;
