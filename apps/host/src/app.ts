import * as dotenv from 'dotenv';
dotenv.config();

import * as bodyParser from 'body-parser';

import express from 'express';

import './db';
import router from './routes';
import { generateData } from './generateData';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    (async () => {
      await generateData();
    })();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
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
