const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        "Допустимы только файлы формата JPG, JPEG или PNG"
      );
      cb(error, false);
    }
  },
  limits: {
    fileSize: 6 * 1024 * 1024, // 6 МБ
    files: 12, // Максимум 12 файлов
  },
});

module.exports = upload;