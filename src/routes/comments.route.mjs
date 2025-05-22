import express from "express"
import {commentsController} from "../controllers/index.mjs"


const router = express.Router();

router.use(express.json());
router.post("/comments/", commentsController.addComment);
router.get("/comments/", commentsController.getComments);


export default router;
