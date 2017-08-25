const express = require("express");
const http = require("http");


function createWebsocketApp(config) {
    const app = express();
    const server = http.createServer(app);
    app.use(express.static(config.STATIC_DIR));
    registerRouters(app);
    return server;
}


function registerRouters(app) {
    const appRouters = require("./app_routers");
    app.use(appRouters.router);
}


module.exports = {
    createWebsocketApp: createWebsocketApp
}