import * as bodyParser from 'body-parser';
import express from 'express';
import * as path from 'path';

import router from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.set('view engine', 'ejs');
    this.app.set('views', path.resolve(__dirname, './../views'));
    // this.app.use(express.static(__dirname + 'public'));
    this.app.use(
      express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
    );

    this.app.enable('trust proxy');


    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, GET, POST, DELETE, OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
    this.app.use(router);
  }
}

export default new App().app;
