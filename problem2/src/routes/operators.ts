import { Router } from 'express';
import * as OperatorsController from '../controllers/operators.controller';

const router = Router();

router.post('/',      OperatorsController.create);
router.get('/',       OperatorsController.list);
router.get('/:id',    OperatorsController.getById);
router.put('/:id',    OperatorsController.update);
router.delete('/:id', OperatorsController.remove);

export default router;
