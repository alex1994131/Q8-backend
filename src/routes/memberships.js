import routerx from 'express-promise-router';
import auth from '../middlewares/auth';
import membershipsController from '../controllers/membershipsController';

const router=routerx();

router.get('/',membershipsController.get);
router.post('/',auth.verifyToken,membershipsController.create);
router.get('/:id',auth.verifyToken,membershipsController.getOne);
router.post('/find',auth.verifyToken,membershipsController.find);
router.put('/:id',auth.verifyToken,membershipsController.update);
router.post('/updateStatusForMemberships',auth.verifyToken,membershipsController.updateStatusForMemberships);
router.delete('/:id',auth.verifyToken,membershipsController.delete);
router.post('/deleteMemberships',auth.verifyToken,membershipsController.deleteMemberships);

export default router;
