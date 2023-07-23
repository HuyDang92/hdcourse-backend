const admin = require("../firebase/index");

class NewsSite {
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
}
module.exports = new NewsSite();
