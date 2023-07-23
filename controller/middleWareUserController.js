const admin = require("../firebase/index");

const verifyToken = async (req, res, next) => {
   const authHeader = req.headers.authorization;
   // Kiểm tra xem header Authorization có tồn tại không
   if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized - Token not found" });
   }
   // Lấy token từ header Authorization
   const token = authHeader.replace("Bearer ", "");
   try {
      // Xác thực token bằng Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Lưu thông tin người dùng vào đối tượng req để sử dụng trong các route tiếp theo (nếu cần)
      next(); // Cho phép request tiếp tục đến route tiếp theo
   } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ error: "Unauthorized - Invalid token" }); // Trả về lỗi 401 (Unauthorized) nếu xác thực không thành công
   }
};


module.exports = {
   verifyToken: verifyToken,
};
