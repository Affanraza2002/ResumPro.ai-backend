// api/index.js
const serverless = require("serverless-http");
const app = require("../server.js"); // server.js should export app (module.exports = app)

module.exports.handler = serverless(app);
