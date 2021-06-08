import path from 'path';
import multer from 'multer';
import routerx from 'express-promise-router';
import config from '../../config';
import auth from '../middlewares/auth';
import ImageUploader from '../middlewares/Uploader';
import shopsController from '../controllers/shopsController';

const router=routerx();
var Uploader = new ImageUploader(path.join(config.BASEURL))

router.get('/',shopsController.get);
router.post('/',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),shopsController.create);
router.get('/:id',auth.verifyToken,shopsController.getOne);
router.post('/find',auth.verifyToken,shopsController.find);
router.put('/:id',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),shopsController.update);
router.post('/updateStatusForShops',auth.verifyToken,shopsController.updateStatusForShops);
router.delete('/:id',auth.verifyToken,shopsController.delete);
router.post('/deleteShops',auth.verifyToken,shopsController.deleteShops);

export default router;
