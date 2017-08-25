const config = require("./app/app_config");
const appFactory = require("./app/app_factory");
const server = appFactory.createWebsocketApp(config);
const io = require("socket.io");


io.listen(server);
server.listen(config.PORT);
console.log("Running Express on " + config.HOST + ":" + config.PORT);