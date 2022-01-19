import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";
import Users from "./models/user-model.js";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerAutogen from 'swagger-autogen';
//import swaggerFile from "./swagger-output.json";
//import *  as swaggerFile from './swagger-output.json'
import { readFile } from "fs/promises";
const swaggerFile = JSON.parse(await readFile("./swagger-output.json"));


//import appEmi from "./app.js";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database Connected...');
    //await Users.sync();
} catch (error) {
    console.error(error);
}

app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
  
const swaggerOptions = {
    swaggerDefinition: {
        info:{
            title : 'Library API',
            version : '1.0'
        }
    },
    apis : ['./routes/index.js'],
    //apis : ['./app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve);
//router.get('/api-docs', swaggerUi.setup(swaggerDocs));
router.use('/api-docs', swaggerUi.setup(swaggerFile));

app.listen(3000, ()=> console.log('Server running at port 3000'));