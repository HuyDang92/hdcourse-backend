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

const createCloudinaryStorage = (folder) => {
   return new CloudinaryStorage({
      cloudinary,
      allowedFormats: ["jpg", "png"],
      filename: function (req, file, cb) {
         cb(null, file.originalname);
      },
      params: {
         folder: folder, // Sử dụng tham số folder được truyền vào từ bên ngoài
      },
   });
};

const uploadImage = (folder) => {
   const storage = createCloudinaryStorage(folder);
   return multer({ storage });
};

module.exports = uploadImage;
