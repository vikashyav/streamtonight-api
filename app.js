const express = require('express');
const mongoose = require('mongoose');
import expressUpload from "express-fileupload";
import bodyParser from "body-parser";
import dotEnv from "dotenv";
import extensions from './src/helper/extensions';
import cors from "cors";
import path from "path";
// import constant from "./src/helper/constant";

class MyApp {
  constructor() {
		dotEnv.config();
    // this.app = express();
    extensions.loadExtensions()
			.then(() => {
    const constant = require("./src/helper/constant");
        global.constant = constant.default;
				console.log("1. Establishing database connections.");
				return this.connectToMongoDB();
			}).then((mongodb)=>{
                console.log("2. Configuring express-server.");
				return this.configureApp({mongodb});
            }).then((app)=>{
                  console.log('Connected to MongoDB');
                console.log("3. Binding error-handlers.");
				return this.configureHandlers(app);
            }).then((app) => {
				console.log("4. Starting service.");
				return this.startServer(app);
			}).catch(err => {
				console.log(`Day2movies API failed to initialize!`);
				console.log(err);
			});
    
    // this.setupRoutes();
  }

  async connectToMongoDB() {
    return mongoose.connect(constant.MONGODB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });
    try {
      console.log("process.env.MONGODB_CONNECTION_URL", typeof process.env.MONGODB_CONNECTION_URL);
      const mongodb = await mongoose.connect(constant.MONGODB_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true,
        w: 'majority'
      });
      console.log('Connected to MongoDB');
      return mongodb
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  configureApp = async ({ mongodb,}) => {
    const app = express();
    const routes = require(`./src/routes`).default;
    // const apitoolkitClient = await APIToolkit.NewClient({ apiKey: process.env.API_TOOLKIT_KEY });
    app.set("base", process.env.API_PREFIX);
    app.use(cors()); // enable cors
    // app.use(nocache()); // prevent default server-cache
    app.use(expressUpload()); // enable multipart-file upload
    app.use(express.json({ limit: '10mb' })); // set default response-type to json
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, "public")));
    
    app.use(`/${constant.API_PREFIX}`, routes);
    // app.use(apitoolkitClient.expressMiddleware);

    // global vars
    global.mongodb = mongodb;
    // global.moment = moment;
    global.rootdir = path.resolve(__dirname);

    return app;
};

configureHandlers = (app) => {
    return new Promise((resolve, _) => {
        // 404
        app.use((req, res, next) => {
            return res.status(404).send({
                error: `Not found: ${req.url}`,
            });
        });
        // 500
        app.use((err, req, res, next) => {
            console.log("err", err); // write to pm2 logs
            const statusCode = err.status || 500;
            const { message, ...rest } = err;
            const dbError = (rest.errors || []).map((item) => item.message);
            let error = null;
            if (dbError.length > 0) {
                error = { error: dbError };
            } else {
                error = Object.keys(rest).length && err.status ? rest : { error: message };
            }
            return res.status(statusCode).send(error);
        });

        resolve(app);
    });
}
  setupRoutes() {
    // Define a sample route
    this.app.get('/', (req, res) => {
      res.send('Hello, MongoDB with Express!');
    });

    // Add your other routes here
  }

  startServer(app) {
    const port = constant.PORT;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default new MyApp();
// myApp.startServer();
