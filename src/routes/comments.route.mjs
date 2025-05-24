import express from "express"
import {commentsController, repliesController} from "../controllers/index.mjs"



const router = express.Router();

router.use(express.json());
router.post("/", commentsController.addComment);
router.get("/", commentsController.getComments);
router.get("/:id", commentsController.getComment);
router.delete("/:id", commentsController.deleteComment);
router.patch("/:id/", commentsController.updateComment);

router.post("/:id/replies", repliesController.addReply);
router.get("/:id/replies", repliesController.getRepliesForComment);



export default router;
