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
      const formattedPhoneNumber = phoneNumber && PhoneNumber(phoneNumber, "VN").format("E.164");
      try {
         // Sử dụng Firebase Admin SDK để cập nhật thông tin người dùng trên Firebase Authentication
         await admin.auth().updateUser(uid, {
            phoneNumber: formattedPhoneNumber,
            displayName: displayName,
            photoURL: photoURL,
         });
         // Cập nhật thông tin người dùng trong collection "users"
         const usersRef = admin.firestore().collection("users");
         const userDoc = await usersRef.doc(uid).get();
         if (!userDoc.exists) {
            res.status(404).json({ mes: "Không tìm thấy người dùng" });
            return;
         }

         const updateData = {
            phoneNumber: phoneNumber ?? userDoc.data().phoneNumber,
            displayName: displayName ?? userDoc.data().displayName,
            photoURL: photoURL ?? userDoc.data().photoURL,
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
   async signIn(req, res) {
      const { uid } = req.body;
      try {
         res.status(200).json({ message: "Đăng nhập thành công", uid: userRecord });
      } catch (error) {
         console.error("Error creating new user:", error);
         res.status(500).json({ message: "Đăng nhập thất bại", error });
      }
   }
}
module.exports = new NewsSite();
