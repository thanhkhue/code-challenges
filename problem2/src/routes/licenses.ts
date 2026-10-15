import { Router } from 'express';
import * as LicensesController from '../controllers/licenses.controller';

const router = Router();

router.post('/',      LicensesController.create);
router.get('/',       LicensesController.list);
router.get('/:id',    LicensesController.getById);
router.put('/:id',    LicensesController.update);
router.delete('/:id', LicensesController.remove);

export default router;
