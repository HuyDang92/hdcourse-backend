const usersRouter = require("./users");
// const newsRouter = require("./tin");
const siteRouter = require("./site");
function route(app) {
    /* GET home page. */
    // app.use("/news", newsRouter);
    app.use("/api/users", usersRouter);
    app.use("/", siteRouter);
}

module.exports = route;
