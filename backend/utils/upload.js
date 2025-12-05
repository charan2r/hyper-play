const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3Service");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = `products/${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

module.exports = upload;
