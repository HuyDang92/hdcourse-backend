const admin = require("../firebase/index");

class NewsSite {
   async getAllCat(req, res) {
      try {
         const courseRef = admin.firestore().collection("categories");
         const allCat = [];

         const querySnapshot = await courseRef.get();
         for (const doc of querySnapshot.docs) {
            const category = { id: doc.id, ...doc.data(), subcategories: [] };

            const courseRefTwo = admin.firestore().collection("categories_two");
            const querySnapshotTwo = await courseRefTwo.where("parent_ID", "==", doc.id).get();

            for (const docTwo of querySnapshotTwo.docs) {
               const categoryTwo = { id: docTwo.id, ...docTwo.data(), subcategories: [] };

               const courseRefThree = admin.firestore().collection("categories_three");
               const querySnapshotThree = await courseRefThree
                  .where("parent_ID", "==", docTwo.id)
                  .get();

               querySnapshotThree.forEach((docThree) => {
                  categoryTwo.subcategories.push({ id: docThree.id, ...docThree.data() });
               });

               category.subcategories.push(categoryTwo);
            }

            allCat.push(category);
         }

         return res.status(200).json(allCat);
      } catch (error) {
         console.error("Error getting all categories:", error);
         throw new Error("Failed to get all categories from Firestore");
      }
   }

   async getCatLevelOne(req, res) {
      try {
         const courseRef = admin.firestore().collection("categories");
         const querySnapshot = await courseRef.get();
         const allCat = [];
         querySnapshot.forEach((doc) => {
            allCat.push({ id: doc.id, ...doc.data() });
         });
         return res.status(200).json(allCat);
      } catch (error) {
         console.error("Error getting all users:", error);
         throw new Error("Failed to get all users from Firestore");
      }
   }
   async getAllCatLevelTwo(req, res) {
      try {
         const courseRef = admin.firestore().collection("categories_two");
         const querySnapshot = await courseRef.get();
         const allCat = [];
         querySnapshot.forEach((doc) => {
            allCat.push({ id: doc.id, ...doc.data() });
         });
         return res.status(200).json(allCat);
      } catch (error) {
         console.error("Error getting all users:", error);
         throw new Error("Failed to get all users from Firestore");
      }
   }

   async getCatLevelTwo(req, res) {
      const { parent_ID } = req.body;
      try {
         const courseRef = admin.firestore().collection("categories_two");
         const querySnapshot = await courseRef.where("parent_ID", "==", parent_ID).get();
         const allCat = [];
         querySnapshot.forEach((doc) => {
            allCat.push({ id: doc.id, ...doc.data() });
         });
         return res.status(200).json(allCat);
      } catch (error) {
         console.error("Error getting all users:", error);
         throw new Error("Failed to get all users from Firestore");
      }
   }
   async getCatLevelThree(req, res) {
      const { parent_ID } = req.body;
      try {
         const courseRef = admin.firestore().collection("categories_three");
         const querySnapshot = await courseRef.where("parent_ID", "==", parent_ID).get();
         const allCat = [];
         querySnapshot.forEach((doc) => {
            allCat.push({ id: doc.id, ...doc.data() });
         });
         return res.status(200).json(allCat);
      } catch (error) {
         console.error("Error getting all users:", error);
         throw new Error("Failed to get all users from Firestore");
      }
   }
   async getAllCatLevelThree(req, res) {
      try {
         const courseRef = admin.firestore().collection("categories_three");
         const querySnapshot = await courseRef.get();
         const allCat = [];
         querySnapshot.forEach((doc) => {
            allCat.push({ id: doc.id, ...doc.data() });
         });
         return res.status(200).json(allCat);
      } catch (error) {
         console.error("Error getting all users:", error);
         throw new Error("Failed to get all users from Firestore");
      }
   }
   async addCatLevelThree(req, res) {
      const { idCatOne, parent_ID, name } = req.body;
      try {
         const cat = {
            parent_ID: parent_ID,
            name: name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         };
         const courseRef = admin.firestore().collection("categories_three");
         await courseRef.doc().set(cat);

         res.status(200).json({ mess: "Thêm thành công" });
      } catch (error) {
         console.error("Error creating new course:", error);
         res.status(500).json({ message: "Thêm thất bại", error });
      }
   }
}
module.exports = new NewsSite();
