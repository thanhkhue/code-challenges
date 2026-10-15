import { Router } from 'express';
import * as GamesController from '../controllers/games.controller';

const router = Router();

router.post('/',      GamesController.create);
router.get('/',       GamesController.list);
router.get('/:id',    GamesController.getById);
router.put('/:id',    GamesController.update);
router.delete('/:id', GamesController.remove);

export default router;
