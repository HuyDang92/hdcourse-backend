const tasksRouter = require("./tasks");
const listsRouter = require("./lists");
const boardsRouter = require("./boards");
const usersRouter = require("./users");
const siteRouter = require("./site");
function route(app) {
    app.use("/api/tasks", tasksRouter);
    app.use("/api/lists", listsRouter);
    app.use("/api/boards", boardsRouter);
    app.use("/api/users", usersRouter);
    app.use("/", siteRouter);
}

module.exports = route;
