const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createDirectoryIfNotExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const baseUploadsDirectory = path.join(__dirname, '..', 'uploads');
createDirectoryIfNotExists(baseUploadsDirectory);

const imagesUploadsDirectory = path.join(baseUploadsDirectory, 'images');
const pdfUploadsDirectory = path.join(baseUploadsDirectory, 'pdf');

createDirectoryIfNotExists(imagesUploadsDirectory);
createDirectoryIfNotExists(pdfUploadsDirectory);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.fieldname;
    let uploadPath = '';

    switch (fileType) {
      case 'image':
        uploadPath = imagesUploadsDirectory;
        break;
      case 'pdf':
        uploadPath = pdfUploadsDirectory;
        break;
      default:
        uploadPath = baseUploadsDirectory;
        break;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + '-' + file.originalname;
    cb(null, uniqueFilename);
  },
});

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});
const uploadFilesMiddleware = fileUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

const handleFileUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: 'File upload error', message: err.message });
  } else if (err) {
    res.status(500).json({ error: 'Internal server error', message: err.message });
  } else {
    next();
  }
};

module.exports = {
  uploadFilesMiddleware,
  handleFileUploadErrors,
};
