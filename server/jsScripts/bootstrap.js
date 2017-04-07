"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const bodyParser = require("body-parser");
const express = require("express");
const path_1 = require("path");
const types_1 = require("./constant/types");
const tags_1 = require("./constant/tags");
const home_1 = require("./controller/home");
const user_1 = require("./controller/user");
const user_2 = require("./service/user");
const t_user_1 = require("./entity/t_user");
const typeorm_1 = require("typeorm");
const ConfigProvider_1 = require("./ConfigProvider");
class Startup {
    server() {
        let config = ConfigProvider_1.ConfigProvider;
        // create database connection 
        typeorm_1.createConnection({
            driver: {
                type: config.type,
                host: config.host,
                port: config.post,
                database: config.database,
                username: config.username,
                password: config.password
            },
            entities: [
                t_user_1.User
            ],
            autoSchemaSync: true,
        }).then(() => {
            this.startExpressServer();
        });
    }
    startExpressServer() {
        // load everything needed to the Container
        let container = new inversify_1.Container();
        container.bind(inversify_express_utils_1.TYPE.Controller).to(home_1.HomeController).whenTargetNamed(tags_1.default.HomeController);
        container.bind(inversify_express_utils_1.TYPE.Controller).to(user_1.UserController).whenTargetNamed(tags_1.default.UserController);
        container.bind(types_1.default.UserService).to(user_2.UserService);
        // start the server
        let server = new inversify_express_utils_1.InversifyExpressServer(container);
        server.setConfig((app) => {
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(bodyParser.json());
            app.use(express.static(path_1.join(__dirname, '../../client')));
        });
        let app = server.build();
        app.listen(3000);
        console.log('Server started on port 3000 :)');
    }
}
let startup = new Startup();
startup.server();
//# sourceMappingURL=bootstrap.js.map