const auth = require("./auth");
const course = require("./course");
const category = require("./category");
function route(app) {
   app.use("/api/category", category);
   app.use("/api/course", course);
   app.use("/api/current-user", auth);
}

module.exports = route;
