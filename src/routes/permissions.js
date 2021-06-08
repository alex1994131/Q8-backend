import routerx from 'express-promise-router';
import auth from '../middlewares/auth';
import permissionsController from '../controllers/permissionsController';

const router=routerx();

router.get('/',permissionsController.get);
router.post('/' ,auth.verifyToken, permissionsController.create);
router.get('/:id' ,auth.verifyToken, permissionsController.getOne);
router.post('/find' ,auth.verifyToken, permissionsController.find);
router.post('/check' ,auth.verifyToken, permissionsController.check);
router.put('/:id' ,auth.verifyToken, permissionsController.update);
router.post('/updateStatusForPermissions' ,auth.verifyToken, permissionsController.updateStatusForPermissions);
router.delete('/:id' ,auth.verifyToken, permissionsController.delete);
router.post('/deletePermissions' ,auth.verifyToken, permissionsController.deletePermissions);

export default router;
