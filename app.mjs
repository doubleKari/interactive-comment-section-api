import express from "express";  
import bodyParser from "body-parser";
import swaggerUI from 'swagger-ui-express';
import YAML from "yamljs";
import path from "node:path"
import { fileURLToPath } from "node:url";
import {commentsRouter} from "./src/routes/index.mjs"
import { userRouter } from "./src/routes/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));





const app = express();

app.use(express.json())
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use("/api/users/", userRouter);
app.use("/api/comments/", commentsRouter);



export default app;



