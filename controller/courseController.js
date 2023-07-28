const admin = require("../firebase/index");

class NewsSite {
   async getAllData(req, res) {
      const { limit } = req.params;
      console.log(limit);
      try {
         const courseRef = admin.firestore().collection("courses").limit(parseInt(limit));
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
   async getAllDataByIdCat(req, res) {
      try {
         const allCourses = [];
         const cateRef = admin.firestore().collection("categories_three");
         const querySnapshotCat = await cateRef.where("hot", "==", true).limit(5).get();

         for (const category of querySnapshotCat.docs) {
            const categories = {
               id: category.id,
               label: category.data().name,
               value: category.data().name,
               courses: [],
            };

            const courseRef = admin.firestore().collection("courses");
            const querySnapshotCourse = await courseRef
               .where("id_category", "==", category.id)
               .orderBy("totalStudent", "desc")
               .limit(4)
               .get();

            querySnapshotCourse.forEach((course) => {
               categories.courses.push({ id: course.id, ...course.data() });
            });

            allCourses.push(categories);
         }
         return res.status(200).json(allCourses);
      } catch (error) {
         console.error("Error getting all course:", error);
         throw new Error("Failed to get all course from Firestore");
      }
   }
   async getAllDataByNameCat(req, res) {
      const nameCat = req.params;
      try {
         const allCourses = [];
         const cateRef = admin.firestore().collection("categories_three");
         const querySnapshotCat = await cateRef.where("name", "==", true).limit(5).get();

         for (const category of querySnapshotCat.docs) {
            const categories = {
               id: category.id,
               name: category.data().name,
               courses: [],
            };

            const courseRef = admin.firestore().collection("courses");
            const querySnapshotCourse = await courseRef
               .where("id_category", "==", category.id)
               .orderBy("totalStudent", "desc")
               .limit(4)
               .get();

            querySnapshotCourse.forEach((course) => {
               categories.courses.push({ id: course.id, ...course.data() });
            });

            allCourses.push(categories);
         }
         return res.status(200).json(allCourses);
      } catch (error) {
         console.error("Error getting all course:", error);
         throw new Error("Failed to get all course from Firestore");
      }
   }
   async getCourseById(req, res) {
      const { id } = req.params;
      try {
         const courseRef = admin.firestore().collection("courses");
         const courseDoc = await courseRef.doc(id).get();
         if (!courseDoc.exists) {
            res.status(401).json({ mes: "Không tìm thấy khóa học" });
            return null;
         }
         return res.status(200).json(courseDoc.data());
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
