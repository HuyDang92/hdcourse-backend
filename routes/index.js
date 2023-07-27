const auth = require("./auth");
const course = require("./course");
const category = require("./category");
const instructor = require("./instructor");
function route(app) {
   app.use("/api/instructor", instructor);
   app.use("/api/category", category);
   app.use("/api/course", course);
   app.use("/api/current-user", auth);
}

module.exports = route;
