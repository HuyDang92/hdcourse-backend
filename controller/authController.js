const admin = require("../firebase/index");
const PhoneNumber = require("libphonenumber-js");

class NewsSite {
   async getAllUser(req, res) {
      try {
         const usersRef = admin.firestore().collection("users");
         const querySnapshot = await usersRef.get();
         const allUsers = [];
         querySnapshot.forEach((doc) => {
            allUsers.push(doc.data());
         });
         return res.status(200).json(allUsers);
      } catch (error) {
         console.error("Error getting all users:", error);
         throw new Error("Failed to get all users from Firestore");
      }
   }
   async getDataLimit(req, res) {
      const { pageSize, currentPage } = req.params;
      try {
         const allUsers = [];
         const usersRef = admin.firestore().collection("users");
         let query = usersRef.orderBy("createdAt", "desc");

         // Lấy tất cả khóa học mà không giới hạn số lượng bằng limit
         const allQuerySnapshot = await query.get();
         allQuerySnapshot.forEach((course) => {
            allUsers.push({ id: course.id, ...course.data() });
         });

         // Tính tổng số trang (totalPage) dựa vào số lượng khóa học đã giới hạn bằng pageSize
         const totalUsersCount = allUsers.length;
         const totalPage = Math.ceil(totalUsersCount / parseInt(pageSize));

         // Kiểm tra nếu currentPage không hợp lệ (nhỏ hơn 1) hoặc lớn hơn tổng số trang, trả về một mảng rỗng
         if (parseInt(currentPage) < 1 || parseInt(currentPage) > totalPage) {
            return res.status(200).json({ totalPage, totalUsersCount, data: [] });
         }

         // Nếu có currentPage và currentPage nhỏ hơn hoặc bằng tổng số trang, thực hiện truy vấn tiếp theo bằng startAfter và limit
         if (currentPage <= totalPage) {
            // Tính chỉ số của khóa học đầu tiên của trang hiện tại
            const firstCourseIndex =
               currentPage === "1" ? 0 : (parseInt(currentPage) - 1) * parseInt(pageSize);

            // Lấy khóa học đầu tiên của trang hiện tại từ mảng allUsers
            const firstCourse = allUsers[firstCourseIndex];

            // Nếu trang cuối cùng (currentPage === totalPage), chỉ sử dụng limit
            if (parseInt(currentPage) === totalPage) {
               query = query.limit(parseInt(pageSize));
            } else {
               // Trang không phải trang cuối cùng, sử dụng startAfter và limit
               query = query.startAfter(firstCourse.createdAt).limit(parseInt(pageSize));
            }
         }

         // Thực hiện truy vấn cuối cùng và lấy dữ liệu
         const querySnapshot = await query.get();
         const pageCourses = [];
         querySnapshot.forEach((course) => {
            pageCourses.push({ id: course.id, ...course.data() });
         });

         return res.status(200).json({ totalPage, totalUsersCount, data: pageCourses });
      } catch (error) {
         console.error("Error getting all course:", error);
         return res.status(500).json({ error: "Failed to get all course from Firestore" });
      }
   }
   async getUserById(req, res) {
      const { uid } = req.body;
      try {
         const usersRef = admin.firestore().collection("users");
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
   async getUserByIdQuery(req, res) {
      const { id } = req.params;
      try {
         const usersRef = admin.firestore().collection("users");
         const courseDoc = await usersRef.doc(id).get();
         if (!courseDoc.exists) {
            res.status(401).json({ mes: "Không tìm thấy user" });
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
         // Sử dụng Firebase Admin SDK để xóa người dùng
         await admin.auth().deleteUser(uid);
         // Xóa tài liệu trong collection "users"
         const usersRef = admin.firestore().collection("users");
         const userQuery = await usersRef.where("uid", "==", uid).get();
         const userDoc = userQuery.docs[0];
         await userDoc.ref.delete();
         res.status(200).json({ message: "Xóa người dùng thành công" });
      } catch (error) {
         console.error("Error deleting user:", error);
         res.status(500).json({ message: "Xóa người dùng thất bại", error });
      }
   }
   async updateProfile(req, res) {
      const { uid, phoneNumber, displayName, photoURL } = req.body;
      const photoURLNew = req.file;
      let formattedPhoneNumber = "";
      let userDataFull = null;
      if (!phoneNumber) {
         formattedPhoneNumber = PhoneNumber(phoneNumber, "VN").format("E.164");
      }

      try {
         const usersRef = admin.firestore().collection("users");
         // Sử dụng Firebase Admin SDK để cập nhật thông tin người dùng trên Firebase Authentication
         if (!phoneNumber) {
            userDataFull = {
               displayName: displayName,
               photoURL: photoURLNew ? photoURLNew.path : photoURL,
               phoneNumber: formattedPhoneNumber,
            };
         } else {
            userDataFull = {
               displayName: displayName,
               photoURL: photoURLNew ? photoURLNew.path : photoURL,
            };
         }

         await admin.auth().updateUser(uid, userDataFull);
         // Cập nhật thông tin người dùng trong collection "users"
         const updateData = {
            phoneNumber: phoneNumber,
            displayName: displayName,
            photoURL: photoURLNew ? photoURLNew.path : photoURL,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         await usersRef.doc(uid).set(updateData, { merge: true });

         const updatedUserDoc = await usersRef.doc(uid).get();
         const data = updatedUserDoc.data();

         res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công",
            data,
         });
      } catch (error) {
         console.error("Error updating user:", error);
         res.status(500).json({ message: "Cập nhật thông tin người dùng thất bại", error });
      }
   }
   async create(req, res) {
      const { email, password, displayName, photoURL, active, role, phoneNumber } = req.body;
      try {
         const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
            photoURL: photoURL,
         });
         const usersRef = admin.firestore().collection("users");
         const userData = {
            uid: userRecord.uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
            phoneNumber: phoneNumber,
            active: active,
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         await usersRef.doc(userRecord.uid).set(userData);

         res.status(200).json(userRecord.uid);
      } catch (error) {
         console.error("Error creating new user:", error);
         res.status(500).json({ message: "Tạo người dùng thất bại", error });
      }
   }
   async addUser(req, res) {
      const { uid, email, displayName, photoURL, active, role, phoneNumber } = req.body;
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
   async addWishList(req, res) {
      const { idUser, idCourse } = req.body;
      try {
         const getListRef = admin.firestore().collection("wishList");
         const listQuery = await getListRef
            .where("idUser", "==", idUser)
            .where("idCourse", "==", idCourse)
            .get();

         if (!listQuery.empty) {
            // Nếu có tài liệu tồn tại, xóa tài liệu đầu tiên
            const listDoc = listQuery.docs[0];
            await listDoc.ref.delete();
            res.status(200).json({ message: "Xóa thành công" });
         } else {
            // Nếu không tìm thấy tài liệu, thêm một tài liệu mới vào collection "wishList"
            const listRef = admin.firestore().collection("wishList");
            const data = {
               idUser: idUser,
               idCourse: idCourse,
               createdAt: admin.firestore.FieldValue.serverTimestamp(),
               updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await listRef.add(data);

            res.status(200).json({ message: "Thêm thành công" });
         }
      } catch (error) {
         console.error("Error add wishlist:", error);
         res.status(500).json({ message: "Thêm thất bại", error });
      }
   }
   async getWishList(req, res) {
      const { idUser } = req.params;
      try {
         const getListRef = admin.firestore().collection("wishList");
         const querySnapshot = await getListRef.where("idUser", "==", idUser).get();

         if (!querySnapshot.empty) {
            // Nếu có tài liệu tồn tại, xóa tài liệu đầu tiên
            const allWishList = [];
            querySnapshot.forEach((doc) => {
               allWishList.push({ id: doc.id, ...doc.data() });
            });
            res.status(200).json(allWishList);
         } else {
            // Nếu không tìm thấy tài liệu, thêm một tài liệu mới vào collection "wishList"
            res.status(200).json([]);
         }
      } catch (error) {
         console.error("Error get wishlist:", error);
         res.status(500).json({ message: "Lấy thất bại", error });
      }
   }
}
module.exports = new NewsSite();
