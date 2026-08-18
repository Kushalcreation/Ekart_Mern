const multer = require("multer");

const storage = multer.memoryStorage();

//single upload
const singleUpload = multer({ storage }).single("file");

//Multiple uplaod upto 5 images
const multipleUpload = multer({ storage }).array("files", 5);

module.exports = {
  singleUpload,
  multipleUpload,
};
