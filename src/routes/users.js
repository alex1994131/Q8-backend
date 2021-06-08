import path from 'path';
import multer from 'multer';
import routerx from 'express-promise-router';
import config from "../../config";
import auth from '../middlewares/auth';
import ImageUploader from '../middlewares/Uploader';
import usersController from '../controllers/usersController';

var Uploader = new ImageUploader(path.join(config.BASEURL))
const router=routerx();

router.post('/login',usersController.login);
router.post('/register',usersController.register);
router.get('/',usersController.get);
router.post('/',auth.verifyToken,multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),usersController.create);
router.get('/:id',auth.verifyToken,usersController.getOne);
router.post('/find',auth.verifyToken,usersController.find);
router.put('/:id',auth.verifyToken, multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),usersController.update);
router.post('/updateStatusForUsers',auth.verifyToken,usersController.updateStatusForUsers);
router.delete('/:id',auth.verifyToken,usersController.delete);
router.post('/deleteUsers',auth.verifyToken,usersController.deleteUsers);
router.post('/sendmail',usersController.sendmail);
router.post('/resetpassword',usersController.resetpassword);
router.post('/forgetpassword',usersController.forgetpassword);

export default router;