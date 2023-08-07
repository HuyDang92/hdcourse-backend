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

            querySnapshotLectures.forEach((lecture) => {
               sections.lectures.push({ id: lecture.id, ...lecture.data() });
            });
            const lectureCount = querySnapshotLectures.size;
            sections.lectureCount = lectureCount;

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
         const { idUser, idCourse, idLecture } = req.body;
         const lectureRef = admin.firestore().collection("userCourses");
         const querySnapshot = await lectureRef
            .where("idUser", "==", idUser)
            .where("idCourse", "==", idCourse)
            .get();

         if (querySnapshot.empty) {
            res.status(404).json({ message: "Document not found" });
            return;
         }

         const data = querySnapshot.docs[0].data().lectureLearned;
         if (!data.includes(idLecture)) {
            // Check if idLecture is already in the array to avoid duplicates.
            data.push(idLecture);

            // Update the document with the modified lectureLearned array.
            await querySnapshot.docs[0].ref.update({ lectureLearned: data });
         }

         res.status(200).json({ status: 200, message: "Thành công" });
      } catch (error) {
         console.error("Error update new lecture:", error);
         res.status(500).json({ message: "Thất bại", error });
      }
   }
   async addCommentLecture(req, res) {
      try {
         const course = {
            ...req.body,
            reply: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         const courseRef = admin.firestore().collection("comments");
         await courseRef.doc().set(course);

         res.status(200).json({ mess: "Thêm thành công" });
      } catch (error) {
         console.error("Error creating new course:", error);
         res.status(500).json({ message: "Thêm thất bại", error });
      }
   }
   async addReplyCommentLecture(req, res) {
      try {
         const course = {
            avatar: req.body.avatar,
            comment: req.body.comment,
            idUser: req.body.idUser,
            name: req.body.name,
            // createdAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         console.log(req.body);
         const lectureRef = admin.firestore().collection("comments");
         const querySnapshot = await lectureRef
            .where("idUser", "==", req.body.idUserOld)
            .where("idLecture", "==", req.body.idLecture)
            .get();

         if (querySnapshot.empty) {
            res.status(404).json({ message: "Document not found" });
            return;
         }

         const data = querySnapshot.docs[0].data().reply;
         data.push(course);
         await querySnapshot.docs[0].ref.update({ reply: data });

         res.status(200).json({ mess: "Thêm thành công" });
      } catch (error) {
         console.error("Error creating new course:", error);
         res.status(500).json({ message: "Thêm thất bại", error });
      }
   }
   async getCommentLecture(req, res) {
      const { idLecture, limit } = req.params;
      try {
         const allComments = [];
         const ref = admin.firestore().collection("comments");
         const querySnapshot = await ref
            .where("idLecture", "==", idLecture)
            .orderBy("createdAt", "desc")
            .limit(parseInt(limit))
            .get();
         querySnapshot.forEach((comment) => {
            allComments.push({ id: comment.id, ...comment.data() });
         });

         return res.status(200).json(allComments);
      } catch (error) {
         console.error("Error getting all comment:", error);
         throw new Error("Failed to get all comment from Firestore");
      }
   }
}
module.exports = new NewsSite();
