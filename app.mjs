import express from "express";  
import bodyParser from "body-parser";
import {commentsRouter} from "./src/routes/index.mjs"





const app = express();


app.use(bodyParser.json());
app.use("/api/", commentsRouter);

export default app;



