const admin = require("../firebase/index");

class NewsSite {
   async getAllData(req, res) {
      try {
         const courseRef = admin.firestore().collection("courses");
         const querySnapshot = await courseRef.get();
         const allCourses = [];
         querySnapshot.forEach((doc) => {
            allCourses.push({ id: doc.id, ...doc.data() });
         });
         return res.status(200).json(allCourses);
      } catch (error) {
         console.error("Error getting all users:", error);
         throw new Error("Failed to get all users from Firestore");
      }
   }
   async getCourseById(req, res) {
      const { uid } = req.body;
      try {
         const usersRef = admin.firestore().collection("courses");
         const userDoc = await usersRef.doc(uid).get();
         if (!userDoc.exists) {
            res.status(401).json({ mes: "Không tìm thấy người dùng" });
            return null;
         }
         return res.status(200).json(userDoc.data());
      } catch (error) {
         console.error("Error getting user:", error);
         throw new Error("Failed to get user from Firestore");
      }
   }
   async delete(req, res) {
      const { uid } = req.params;

      try {
         const usersRef = admin.firestore().collection("courses");
         const userQuery = await usersRef.where("uid", "==", uid).get();
         const userDoc = userQuery.docs[0];
         await userDoc.ref.delete();
         res.status(200).json({ message: "Xóa người dùng thành công" });
      } catch (error) {
         console.error("Error deleting user:", error);
         res.status(500).json({ message: "Xóa người dùng thất bại", error });
      }
   }
   async addCourse(req, res) {
      try {
         const usersRef = admin.firestore().collection("users");
         const userData = {
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
            phoneNumber: phoneNumber,
            active: active,
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         await usersRef.doc(uid).set(userData);

         res.status(200).json({ mess: "Thêm thành công" });
      } catch (error) {
         console.error("Error creating new user:", error);
         res.status(500).json({ message: "Tạo người dùng thất bại", error });
      }
   }
}
module.exports = new NewsSite();
