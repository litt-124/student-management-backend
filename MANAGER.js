

'use strict';
require('dotenv').config();
const path = require('path');
const fs = require('fs-extra');
const mongoose = require('mongoose');
const TimerUtil = require(path.join(process.cwd(), 'src/utils/TimerUtil'));
let bodyParser = require('body-parser');
let cors = require('cors');

class MANAGER {
  static instance;

  /**
   *
   * @param app
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * returns singleton instance of MANAGER class
   *
   * @returns MANAGER
   */
  static getInstance(app) {
    if(MANAGER.instance) {
      return MANAGER.instance;
    }
    if(!app) {
      throw new Error('APP not provided');
    }
    MANAGER.instance = new MANAGER(app);
    return MANAGER.instance;
  }

  async initialize() {
    let connected = await this.connectToDb();
    if(!connected) {
      throw new Error('failed to connect to DB ' + process.env.DB);
    }
    await this.initRequests();
    await this.initializeDtos();
    await this.initializeRoutes();
  }


  /**
   * returns current project Directory
   *
   * @returns {string}
   */
  getProjectDir() {
    return process.cwd();
  }


  /**
   * returns routes Directory
   *
   * @returns {string}
   */
  getRoutesDir() {
    return path.join(this.getClassesDir(), 'routes');
  }


  /**
   * returns dtos Directory
   *
   * @returns {string}
   */
  getDtosDir() {
    return path.join(this.getClassesDir(), 'dal/dto');
  }


  /**
   * returns loads Directory
   *
   * @returns {string}
   */
  getLoadsDir() {
    return path.join(this.getClassesDir(), 'loads');
  }


  /**
   * returns actions Directory
   *
   * @returns {string}
   */
  getActionsDir() {
    return path.join(this.getClassesDir(), 'actions');
  }


  /**
   * returns middlewares Directory
   *
   * @returns {string}
   */
  getMiddlewaresDir() {
    return path.join(this.getClassesDir(), 'middlewares');
  }

  /**
   * returns utils Directory
   *
   * @returns {string}
   */
  getUtilsDir() {
    return path.join(this.getClassesDir(), 'utils');
  }

  /**
   * returns managers Directory
   *
   * @returns {string}
   */
  getManagersDir() {
    return path.join(this.getClassesDir(), 'managers');
  }


  /**
   * returns validators Directory
   *
   * @returns {string}
   */
  getValidatorsDir() {
    return path.join(this.getClassesDir(), 'validators');
  }


  /**
   * returns App Directory
   *
   * @returns {string}
   */
  getAppDir() {
    return path.join(this.getProjectDir(), 'app');
  }

  /**
   * returns views Directory
   *
   * @returns {string}
   */
  getViewsDir() {
    return path.join(this.getAppDir(), 'views');
  }


  /**
   * returns styles Directory
   *
   * @returns {string}
   */
  getStylesDir() {
    return path.join(this.getAppDir(), 'css');
  }


  /**
   * returns js Directory
   *
   * @returns {string}
   */
  getJsDir() {
    return path.join(this.getAppDir(), 'js');
  }

  /**
   * returns images Directory
   *
   * @returns {string}
   */
  getImagesDir() {
    return path.join(this.getAppDir(), 'assets/images');
  }

  /**
   * returns file uploads Directory
   *
   * @returns {string}
   */
  getUploadsDir() {
    return path.join(this.getClassesDir(), 'data','uploads');
  }


  /**
   * returns current project classes Directory
   *
   * @returns {string}
   */
  getClassesDir() {
    return path.join(this.getProjectDir(), 'src');
  }

  /**
   * returns current App
   * @returns {Express}
   */
  getApp() {
    return this.app;
  }

  /**
   * connect to DB
   *
   * @returns {Promise<boolean>}
   */
  async connectToDb() {
    let tryCount = 0;
    while(tryCount < 5) {
      try {
        await mongoose.connect(process.env.DB);
        return true;
      }
      catch(error) {
        console.log('failed to connect to DB ' + process.env.DB + ": " + error.message);
        tryCount++;
        await TimerUtil.sleep(5000);
      }
    }
    return false;
  }


  /**
   * initialize request handling part
   *
   * @returns {Promise<void>}
   */
  async initRequests() {
    const corsOptions = {
      origin: '*',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    };

    this.getApp().use(cors(corsOptions));
    this.getApp().use(bodyParser.urlencoded({
      limit: '10mb',
      extended: true
    }));
    this.getApp().use(bodyParser.json({ limit: '500mb' }));
  }

  /**
   * initialize dtos
   *
   * @returns {Promise<void>}
   */
  async initializeDtos() {
    let apiRoutesPath = this.getDtosDir();
    let dtos = await fs.readdir(apiRoutesPath);
    for(let i=0; i<dtos.length; i++) {
      let dtoPath = path.join(apiRoutesPath, dtos[i]);
      require(dtoPath);
      console.log('dto ' + dtos[i] + ' initialized');
    }
  }


  /**
   * initialize routes
   *
   * @returns {Promise<void>}
   */
  async initializeRoutes() {
    let apiRoutesPath = this.getRoutesDir();
    let routes = await fs.readdir(apiRoutesPath);

    for(let i=0; i<routes.length; i++) {
      if(routes[i] === 'AbstractRoute.js') {
        continue;
      }

      let routerPath = path.join(apiRoutesPath, routes[i]);
      let router = require(routerPath);
      await router.initialize();
    }
    console.log(routes)
    this.getApp().use((req, res, next) => {
      console.log(req)
      res.status(404).send('Not Found');
    });
  }


}

module.exports = MANAGER;

