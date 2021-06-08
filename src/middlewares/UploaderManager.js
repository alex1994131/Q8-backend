import multer from 'multer';
import path from 'path';

class UploaderManager {
  constructor(filePath) {
    this.assetsPath = filePath;
    this.storage = multer.diskStorage({
      destination: function(req, file, cb) {
        /**
         * cb(null, './public/assets/imgs');
         */
          cb(null, filePath);
      },
      // By default, multer removes file extensions so let's add them back
      filename: function(req, file, cb) {
       console.log(file);  cb(null, Date.now() +'.'+ file.mimetype.split('/')[1]);
      }
    });
  }
}
/**
 * @member {multer.diskStorage} storage
 */
module.exports  = UploaderManager;