import express from "express"
import {commentsController} from "../controllers/index.mjs"


const router = express.Router();

router.use(express.json());
router.post("/", commentsController.addComment);
router.get("/", commentsController.getComments);
router.get("/:id", commentsController.getComment);


export default router;
