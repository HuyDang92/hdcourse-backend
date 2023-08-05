const admin = require("../firebase/index");

class NewsSite {
   async getAllLecture(req, res) {
      const { idCourse } = req.params;
      try {
         const allSection = [];
         const sectionRef = admin.firestore().collection("sections");
         const querySnapshotSec = await sectionRef
            .where("idCourse", "==", idCourse)
            .orderBy("index", "asc")
            .get();

         for (const section of querySnapshotSec.docs) {
            const sections = {
               id: section.id,
               ...section.data(),
               lectures: [],
            };

            const lectureRef = admin.firestore().collection("lectures");
            const querySnapshotLectures = await lectureRef
               .where("idSection", "==", section.id)
               .orderBy("index", "asc")
               .get();
            const learnedQuery = await lectureRef
               .where("idSection", "==", section.id)
               .where("learned", "==", true)
               .get();
            querySnapshotLectures.forEach((lecture) => {
               sections.lectures.push({ id: lecture.id, ...lecture.data() });
            });
            const lectureCount = querySnapshotLectures.size;
            const learnedCount = learnedQuery.size;
            sections.lectureCount = lectureCount;
            sections.learnedCount = learnedCount;
            console.log(learnedCount);

            allSection.push(sections);
         }
         return res.status(200).json(allSection);
      } catch (error) {
         console.error("Error getting all lecture:", error);
         throw new Error("Failed to get all lecture from Firestore");
      }
   }
   async getLectureById(req, res) {
      const { idLecture } = req.params;
      try {
         const lectureRef = admin.firestore().collection("lectures");
         const lectureDoc = await lectureRef.doc(idLecture).get();
         if (!lectureDoc.exists) {
            res.status(401).json({ mes: "Không tìm thấy khóa học" });
            return null;
         }
         return res.status(200).json(lectureDoc.data());
      } catch (error) {
         console.error("Error getting lecture:", error);
         throw new Error("Failed to get lecture from Firestore");
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
   async addLecture(req, res) {
      try {
         const courseRef = admin.firestore().collection("courses");
         const lectureRef = admin.firestore().collection("lectures");

         // Tạo đối tượng lecture với createdAt và updatedAt
         const lecture = {
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         };

         // Thêm bài giảng mới vào Firestore
         await lectureRef.doc().set(lecture);

         // Truy vấn số lượng bài giảng có trong khóa học
         const querySnapshotLectures = await lectureRef
            .where("idCourse", "==", req.body.idCourse)
            .get();
         const totalLecture = querySnapshotLectures.size; // Đây là giá trị đã đúng của totalLecture
         // Tạo đối tượng course với totalLecture đã được gán đúng giá trị
         const course = {
            totalLecture: totalLecture,
         };
         console.log(course);
         // Cập nhật thông tin số lượng bài giảng của khóa học
         await courseRef.doc(req.body.idCourse).set(course, { merge: true });

         // Phản hồi thành công
         res.status(200).json({ mess: "Thêm thành công" });
      } catch (error) {
         console.error("Error creating new lecture:", error);
         res.status(500).json({ message: "Thêm thất bại", error });
      }
   }

   async learnedLecture(req, res) {
      try {
         const { learned, idLecture } = req.body;
         console.log(learned);
         const lecture = {
            learned: true,
         };
         const lectureRef = admin.firestore().collection("lectures");
         await lectureRef.doc(idLecture).set(lecture, { merge: true });

         res.status(200).json({ status: 200, message: "Thành công" });
      } catch (error) {
         console.error("Error update new lecture:", error);
         res.status(500).json({ message: "Thất bại", error });
      }
   }
}
module.exports = new NewsSite();
