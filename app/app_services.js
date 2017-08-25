const config = require("./app_config");
const appFactory = require("./app_factory");


function runWebsocketServer() {
    const io = require("socket.io");
    const server = appFactory.createWebsocketApp(config);
    io.listen(server);
    server.listen(config.PORT);
    console.log("Running Express on " + config.HOST + ":" + config.PORT);
}


module.exports = {
    runWebsocketServer: runWebsocketServer
}