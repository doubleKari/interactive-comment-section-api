import express from "express";  
import { getComments, addComments } from "../controllers/comments.controller.mjs";


const router = express.Router();

router.get("/", (req, res)=> {
    res.json({"message": "Hello World!"})
});
router.post("/comments/", addComments);





export default router;