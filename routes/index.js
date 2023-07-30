const auth = require("./auth");
const course = require("./course");
const category = require("./category");
const instructor = require("./instructor");
const section = require("./section");
const lecture = require("./lecture");
function route(app) {
   app.use("/api/lecture", lecture);
   app.use("/api/section", section);
   app.use("/api/instructor", instructor);
   app.use("/api/category", category);
   app.use("/api/course", course);
   app.use("/api/current-user", auth);
}

module.exports = route;
