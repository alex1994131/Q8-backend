import path from 'path';
import multer from 'multer';
import routerx from 'express-promise-router';
import config from '../../config';
import auth from '../middlewares/auth';
import ImageUploader from '../middlewares/Uploader';
import brandsController from '../controllers/brandsController';

const router=routerx();
var Uploader = new ImageUploader(path.join(config.BASEURL))

router.get('/',brandsController.get);
router.post('/',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),brandsController.create);
router.get('/:id',auth.verifyToken,brandsController.getOne);
router.post('/find',auth.verifyToken,brandsController.find);
router.put('/:id',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),brandsController.update);
router.post('/updateStatusForBrands',auth.verifyToken,brandsController.updateStatusForBrands);
router.delete('/:id',auth.verifyToken,brandsController.delete);
router.post('/deleteBrands',auth.verifyToken,brandsController.deleteBrands);

export default router;
