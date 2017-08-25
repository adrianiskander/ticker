"use strict";
const express = require("express");
const config = require("./app_config");
const router = express.Router();


router.get("/", function(request, response) {
    response.sendFile(config.STATIC_DIR + "index.html");
});


module.exports = {
    router: router
}