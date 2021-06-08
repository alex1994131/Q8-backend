import path from 'path';
import multer from 'multer';
import routerx from 'express-promise-router';
import config from '../../config';
import auth from '../middlewares/auth';
import ImageUploader from '../middlewares/Uploader';
import categoriesController from '../controllers/categoriesController';

const router=routerx();
var Uploader = new ImageUploader(path.join(config.BASEURL))

router.get('/',categoriesController.get);
router.post('/',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),categoriesController.create);
router.get('/:id',categoriesController.getOne);
router.post('/find',categoriesController.find);
router.put('/:id',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),categoriesController.update);
router.post('/updateStatusForCategories',auth.verifyToken,categoriesController.updateStatusForCategories);
router.delete('/:id',auth.verifyToken,categoriesController.delete);
router.post('/deleteCategories',auth.verifyToken,categoriesController.deleteCategories);

export default router;
