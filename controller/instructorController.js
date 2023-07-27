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

   async getInstructorById(req, res) {
      const { id } = req.params;
      try {
         const courseRef = admin.firestore().collection("instructors");
         const courseDoc = await courseRef.doc(id).get();
         if (!courseDoc.exists) {
            res.status(401).json({ mes: "Không tìm thấy giảng viên" });
            return null;
         }
         return res.status(200).json(courseDoc.data());
      } catch (error) {
         console.error("Error getting instructor:", error);
         throw new Error("Failed to get instructor from Firestore");
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
   async addInstructor(req, res) {
      const thumb = req.file;
      try {
         const course = {
            ...req.body,
            thumb: thumb.path,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         const courseRef = admin.firestore().collection("courses");
         await courseRef.doc().set(course);

         res.status(200).json({ mess: "Thêm thành công" });
      } catch (error) {
         console.error("Error creating new course:", error);
         res.status(500).json({ message: "Thêm thất bại", error });
      }
   }
}
module.exports = new NewsSite();
