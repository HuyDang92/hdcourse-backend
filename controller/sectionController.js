const admin = require("../firebase/index");

class NewsSite {
   async getSectionByIdCourse(req, res) {
      const { idCourse } = req.params;
      try {
         const sectionRef = admin.firestore().collection("sections");
         const querySnapshot = await sectionRef.where("idCourse", "==", idCourse).get();
         const allSection = [];
         querySnapshot.forEach((doc) => {
            allSection.push({ id: doc.id, ...doc.data() });
         });
         return res.status(200).json(allSection);
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
   async addSection(req, res) {
      try {
         const section = {
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         const sectionRef = admin.firestore().collection("sections");
         await sectionRef.doc().set(section);

         res.status(200).json({ mess: "Thêm thành công" });
      } catch (error) {
         console.error("Error creating new section:", error);
         res.status(500).json({ message: "Thêm thất bại", error });
      }
   }
}
module.exports = new NewsSite();
