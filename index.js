const services = require("./app/app_services");


args = {
    "runserver": services.runWebsocketServer
}


args[process.argv[2]]();
