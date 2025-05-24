import express from "express";  
import bodyParser from "body-parser";
import {commentsRouter} from "./src/routes/index.mjs"
import { userRouter } from "./src/routes/index.mjs";





const app = express();


app.use(bodyParser.json());
app.use("/api/users/", userRouter);
app.use("/api/comments/", commentsRouter);



export default app;



