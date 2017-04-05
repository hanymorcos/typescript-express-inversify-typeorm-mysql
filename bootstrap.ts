import 'reflect-metadata';
import { interfaces, Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Container } from 'inversify';
import * as bodyParser from 'body-parser';
import TYPES from './constant/types';
import TAGS from './constant/tags';
import { HomeController } from './controller/home';
import { UserController } from './controller/user';
import { UserService } from './service/user';
import { User } from './entity/t_user';
import { createConnection } from 'typeorm'
import { ConfigProvider } from './ConfigProvider'
import { injectable, inject} from 'inversify';

// load everything needed to the Container
let container = new Container();

container.bind<interfaces.Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
container.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed(TAGS.UserController);
container.bind<UserService>(TYPES.UserService).to(UserService);

class Startup 
{

  public server ()
  {
      let config : any = ConfigProvider;

      // create database connection 
      createConnection({
                  driver: {
                    type: config.type,
                    host: config.host,
                    port: config.post,
                    database: config.database,
                    username: config.username,
                    password: config.password
                  },
                  entities: [
                    User
                  ],
                  autoSchemaSync: true,
                }) .then(() => {
                     this.startExpressServer();
                  });
  }

    private startExpressServer ()
    {
         // start the server
                  let server = new InversifyExpressServer(container);
                  server.setConfig((app) => {
                    app.use(bodyParser.urlencoded({
                      extended: true
                    }));
                    app.use(bodyParser.json());
                  });

                let app = server.build();
                app.listen(3000);
                console.log('Server started on port 3000 :)');
    }
}

let startup = new Startup(); 
startup.server();