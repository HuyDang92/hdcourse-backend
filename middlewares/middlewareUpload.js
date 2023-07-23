const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Cấu hình Cloudinary với API credentials
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
   cloudinary,
   allowedFormats: ["jpg", "png"],
   filename: function (req, res) {
      cb(null, file.originalname);
   },
   params: {
      folder: "users_avatar", // Thư mục đích để lưu trữ ảnh
   },
});

const uploadImage = multer({ storage });

module.exports = uploadImage;
