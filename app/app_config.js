const path = require("path");


const BASE_DIR = path.join(__dirname);
const STATIC_DIR = path.resolve(BASE_DIR + path.sep + ".." + path.sep + "public_vue");


module.exports = {
    HOST: "http://127.0.0.1",
    PORT: 3000,
    STATIC_DIR: STATIC_DIR
}