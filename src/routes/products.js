import path from 'path';
import multer from 'multer';
import routerx from 'express-promise-router';
import config from '../../config';
import auth from '../middlewares/auth';
import ImageUploader from '../middlewares/Uploader';
import productsController from '../controllers/productsController';

var Uploader = new ImageUploader(path.join(config.BASEURL))
const router=routerx();

router.get('/',productsController.get);
router.post('/',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),productsController.create);
router.get('/:id',auth.verifyToken,productsController.getOne);
router.post('/find',auth.verifyToken,productsController.find);
router.put('/:id',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),auth.verifyToken,productsController.update);
router.post('/updateStatusForProducts',auth.verifyToken,productsController.updateStatusForProducts);
router.delete('/:id',auth.verifyToken,productsController.delete);
router.post('/deleteProducts',auth.verifyToken,productsController.deleteProducts);

export default router;